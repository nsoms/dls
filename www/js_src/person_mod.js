/**
 * Person  add dialogue
 */
var Functions = require('../common');
var Handlebars = require('handlebars/runtime');
if (typeof Handlebars.templates === 'undefined')
    Handlebars.templates = [];
Handlebars.templates.groups_select = require('../templates/groups_select.hbs');

require('webpack-jquery-ui/dialog');
require('webpack-jquery-ui/datepicker');
require('bootstrap-multiselect');
var BootstrapDialog = require('bootstrap3-dialog');

var PersonModDlg = {
    element: '#person_mod_dlg',
    canvas: false,
    context: false,
    video: false,
    img_changed: false,
    dlg: null,
    init: function () {
        if ($(PersonModDlg.element).length === 0)
            return;

        if (PersonModDlg.dlg === null)
            PersonModDlg.dlg = new BootstrapDialog({
                type: BootstrapDialog.TYPE_PRIMARY,
                size: BootstrapDialog.SIZE_LARGE,
                message: $(PersonModDlg.element).html()
            });

        PersonModDlg.canvas = document.getElementById("canvas");
        PersonModDlg.context = PersonModDlg.canvas.getContext("2d");
        PersonModDlg.video = document.getElementById("video");
        PersonModDlg.bind_all();
        PersonModDlg.play_canvas();
    },
    prepare_dlg: function () {
        if ($(PersonModDlg.element).length == 0) {
            console.error("Target not found");
            return;
        }

        Functions.clear_dialog(PersonModDlg.element);
        $('img', PersonModDlg.element).attr('src', '#');
        PersonModDlg.stop_canvas();
    },
    fill_groups: function (groups, selected) {
        console.log(selected);
        $('#groups_select', PersonModDlg.element).html(
            Handlebars.templates.groups_select({
                'groups': groups,
                'sel': selected
            })
        );
        $('#groups_select', PersonModDlg.element).multiselect('destroy');
        $('#groups_select', PersonModDlg.element).multiselect({
            //checkboxName: 'groups[]',
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
        });
    },
    open: function (group_id, add_group_id, callback) {
        if ($(PersonModDlg.element).length == 0) {
            console.error("Target not found");
            return;
        }

        PersonModDlg.prepare_dlg();

        PersonModDlg.dlg.setTitle("Добавить персону");
        // $(PersonModDlg.element).dialog("option", "title", "Добавить персону");

        PersonModDlg.img_changed = true;
        //PersonModDlg.play_canvas();
        $('#snapshot', PersonModDlg.element).show();
        $('#curphoto', PersonModDlg.element).hide();

        var groups = [String(group_id), String(add_group_id)];

        ajax({
            async: false,
            url: ROOT + 'mt/groups.php',
            data: {
                action: 'groups_list'
            },
            success: function (data) {
                PersonModDlg.fill_groups(data.groups, groups);
            }
        });

        PersonModDlg.dlg.setButtons(
            [
                {
                    label: 'Сохранить',
                    action: function () {
                        if (!PersonModDlg.validate())
                            return;

                        ajax({
                            url: ROOT + 'mt/users.php',
                            data: {
                                action: 'user_add',
                                params: PersonModDlg.get_data(),
                                group_id: group_id
                            },
                            success: function (data) {
                                if (callback)
                                    callback(data.id, data.name);
                                PersonModDlg.close();
                            }
                        });
                    }
                },
                {
                    label: 'Отмена',
                    action: function () {
                        PersonModDlg.close();
                    }
                }
            ]
        );
        PersonModDlg.dlg.open();
    },
    edit: function (user_id, callback) {
        if ($(PersonModDlg.element).length === 0) {
            console.error("Target not found");
            return;
        }

        PersonModDlg.prepare_dlg();
        PersonModDlg.dlg.setTitle("Редактировать персону");

        ajax({
            async: false,
            url: ROOT + 'mt/users.php',
            data: {
                action: 'user_info',
                id: user_id
            },
            success: function (data) {
                if (data.user_rights['mod'] != 't') {
                    show_error('Недостаточно прав');
                    return;
                }

                $('input[name="card"]', PersonModDlg.element).focus();

                var user = null, pic_name = null;
                if (data.users.length === 1)
                    user = data.users[0];
                if (user.length === 0) {
                    show_error('Ошибка получения данных');
                    return;
                }

                $('input[name="card"]', PersonModDlg.element).val(user[1]);
                $('input[name="surname"]', PersonModDlg.element).val(user[2]);
                $('input[name="name"]', PersonModDlg.element).val(user[3]);
                $('input[name="middle"]', PersonModDlg.element).val(user[4]);
                pic_name = user[5];
                $('input[name="dbdate"]', PersonModDlg.element).val(user[5]);
                var date = new Date(user[6]);
                $('input[name="birthday"]', PersonModDlg.element).datepicker("setDate", date);

                $('input[name="regday"]', PersonModDlg.element).val(user[7]);
                $('input[name="regclass"]', PersonModDlg.element).val(user[8]);

                if (pic_name !== null && pic_name !== '') {
                    PersonModDlg.img_changed = false;
                    //PersonModDlg.stop_canvas();
                    $('#snapshot', PersonModDlg.element).hide();
                    $('#curphoto', PersonModDlg.element).show();
                    $('#picname', PersonModDlg.element).attr('src', pic_name + '?rand=' + Math.random());
                } else {
                    PersonModDlg.img_changed = true;
                    //PersonModDlg.play_canvas();
                    $('#snapshot', PersonModDlg.element).show();
                    $('#curphoto', PersonModDlg.element).hide();
                }

                PersonModDlg.fill_groups(data.groups, user[13]);
            }
        });

        PersonModDlg.dlg.setButtons(
            [
                {
                    label: 'Сохранить',
                    action: function () {
                        if (!PersonModDlg.validate())
                            return;

                        ajax({
                            url: ROOT + 'mt/users.php',
                            data: {
                                action: 'user_mod',
                                id: user_id,
                                params: PersonModDlg.get_data()
                            },
                            success: function (data) {
                                if (callback)
                                    callback(data.id);
                                PersonModDlg.close();
                            }
                        });
                    }
                },
                {
                    label: 'Отмена',
                    action: function () {
                        $(this).dialog('close');
                    }
                }
            ]);
        PersonModDlg.dlg.open();
    },
    bind_all: function () {
        $('input[name="birthday"]', PersonModDlg.element).datepicker({
            changeMonth: true,
            changeYear: true,
            minDate: '-90y',
            defaultDate: '01.01.1970',
            yearRange: '1930:-10y',
            altField: $('input[name="dbdate"]', PersonModDlg.element),
            altFormat: 'yy-mm-dd'
        });

        PersonModDlg.bind_snap();
        PersonModDlg.bind_change();
    },
    play_canvas: function () {
        // Grab elements, create settings, etc.
        var videoObj = {video: true, audio: false, facingMode: "user"},
            errBack = function (error) {
                console.error("Video capture error: ", error.code);
            };

        // Put video listeners into place
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) { // Standard
            navigator.mediaDevices.getUserMedia(videoObj)
                .then(function (stream) {
                    console.log(PersonModDlg.video);
                    console.log(PersonModDlg.video.srcObject);
                    console.log(PersonModDlg.video.src);
                    PersonModDlg.video.srcObject = PersonModDlg.video.src = stream;
                    PersonModDlg.video.play();
                })
                .catch(errBack);
        }
    },
    stop_canvas: function () {
        //PersonModDlg.video.pause();
        //PersonModDlg.video.src = null;

        var context = PersonModDlg.canvas.getContext("2d");
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    },
    bind_snap: function () {
        $('#snap', PersonModDlg.element).click(function (event) {
            event.preventDefault();
            PersonModDlg.context.drawImage(PersonModDlg.video, 0, 0, 320, 240);
        });
    },
    bind_change: function () {
        $('#change').click(function (event) {
            event.preventDefault();
            PersonModDlg.img_changed = true;
            //PersonModDlg.play_canvas();
            $('#snapshot', PersonModDlg.element).show();
            $('#curphoto', PersonModDlg.element).hide();
        });
    },
    close: function () {
        PersonModDlg.stop_canvas();
        PersonModDlg.dlg.close();
        // $(PersonModDlg.element).dialog('close');
    },
    validate: function () {
        var ret = true;
        $('label.mandatory', PersonModDlg.element).each(function (index) {
            if ($(this).next('input').val() == '') {
                $(this).next('input').addClass('not_filled');
                ret = false;
            }
            else
                $(this).next('input').removeClass('not_filled');
        });

        return ret;
    },
    get_data: function () {
        var data = {};
        $('input', PersonModDlg.element).each(function () {
            data[$(this).attr('name')] = $(this).val();
        });
        data['canvas'] = (PersonModDlg.img_changed ? PersonModDlg.canvas.toDataURL("image/jpeg") : null);
        data['groups'] = $('#groups_select', PersonModDlg.element).val();

        return data;
    }
};

$(document).ready(function () {
    PersonModDlg.init();
});

module.exports = PersonModDlg;
