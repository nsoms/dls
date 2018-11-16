require('./common');
var Handlebars = require('handlebars/runtime');
if (typeof Handlebars.templates === 'undefined')
    Handlebars.templates = [];
Handlebars.templates.users_list = require('./templates/users_list.hbs');
Handlebars.templates.groups_select = require('./templates/groups_select.hbs');

require('bootstrap-multiselect');

var search_request = null;

var PersonModDlg = require('./person_mod');

$(document).ready(function() {
    bind_user_link();
    bind_filter();
    $('#FilterButton').click();
});

function bind_filter() {
    $('input', '#iFilter').keyup(function(event) {
        $('#FilterButton').click();
    });
    ajax({
        async: false,
        url: ROOT + 'mt/groups.php',
        data: {
            action: 'groups_list'
        },
        success: function(data) {
            $('#FilterGroup').html(Handlebars.templates.groups_select({
                'groups': data.groups/*,
                'additional': 'Все'*/
            }));
            $('#FilterGroup').multiselect({
                buttonText: function (options, select) {
                    if (options.length === 0) {
                        return 'Необходимо выбрать группы';
                    }
                    else {
                        var labels = [];
                        options.each(function () {
                            if ($(this).attr('label') !== undefined) {
                                labels.push($(this).attr('label'));
                            }
                            else {
                                labels.push($(this).html());
                            }
                        });
                        return labels.join(', ') + ' ';
                    }
                }
            }).change(function() {
                $('#FilterButton').click();
            });
        }
    });
    $('#FilterButton').click(function (event){
        event.preventDefault();

        if(search_request != null)
            search_request.cancel();

        search_request = ajax({
            url: ROOT + 'mt/users.php',
            data: {
                action: 'users_list',
                s: $('#FilterSurname').val(),
                c: $('#FilterCard').val(),
                g: $('#FilterGroup').val()
            },
            success: function(data) {
                $('#UsersList').html(Handlebars.templates.users_list(data));

                bind_user_link();
                $(document).scroll(0);
                search_request = null;
                bind_pupil_add();
                bind_teacher_add();
            }
        });
    });
}

function bind_user_link() {
    $('a.link', '#UsersList').click(function(event) {
        event.preventDefault();
        var user_id = $(this).data('user-id');
        PersonModDlg.edit(user_id, [], function () {
            $('#FilterButton').click();
        });
    });
}

function bind_pupil_add() {
    $('#AddPersonPupilBtn').click( function () {
        PersonModDlg.edit(-1, [$('#FilterGroup').val(), String(PUPIL_GROUP_ID)], function () {
            $('#FilterButton').click();
        });
    });
}

function bind_teacher_add() {
    $('#AddPersonTeacherBtn').click( function () {
        PersonModDlg.edit(-1, [String(TEACHER_GROUP_ID)], function () {
            $('#FilterButton').click();
        });
    });
}