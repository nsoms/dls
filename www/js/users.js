/**
 * Created by soms on 04.02.15.
 */

$(document).ready(function() {
    bind_user_link();
    bind_filter();
});

function bind_filter() {
    $('input', '#iFilter').keyup(function(event) {
        $('#FilterButton').click();
    });
    $('#FilterButton').click(function (event){
        event.preventDefault();

        tak_ajax({
            url: ROOT + 'mt/users.php',
            data: {
                action: 'users_list',
                s: $('#FilterSurname').val(),
                c: $('#FilterCard').val(),
                g: $('#FilterGroup').val()
            },
            success: function(data) {
                $('#UsersList').html(tpl_users_list({
                    'users': data.users
                }));

                bind_user_link();
            }
        });
    });
}

function bind_user_link() {
    $('a.link', '#UsersList').click(function(event) {
        event.preventDefault();
        var user_id = $(this).data('user-id');
        PersonModDlg.edit(user_id, function () {
        });
    })
}