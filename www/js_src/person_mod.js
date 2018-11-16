/**
 * Person  add dialogue
 */
var Functions = require('./common');
var Handlebars = require('handlebars/runtime');
if (typeof Handlebars.templates === 'undefined')
    Handlebars.templates = [];
Handlebars.templates.groups_select = require('./templates/groups_select.hbs');
Handlebars.templates.user_edit_dlg = require('./templates/user_edit_dlg.hbs');

require('bootstrap-multiselect');
var moment = require('moment');
var BootstrapDialog = require('bootstrap3-dialog');
require('bootstrap-datepicker');
var parseDate = require('postgres-date');

var PersonModDlg = {
    user: {},
    groups: [],
    sel_groups: [],
    dlg: null,
    canvas: false,
    context: false,
    video: null,
    callback: function () {
    },
    element: null,
    edit: function (user_id, sel_groups, callback) {
        PersonModDlg.callback = callback;
        ajax({
            async: false,
            url: ROOT + 'mt/users.php',
            data: {
                action: 'user_info',
                id: user_id
            }
        }).then(function (data) {
            if (('user_rights' in data) && data.user_rights['mod'] !== 't')
                return;
            if (!('groups' in data) || !('users' in data))
                return;
            if (data.users.length === 1 && data.users[0].length !== 0) {
                PersonModDlg.user = data.users[0];
                PersonModDlg.groups = data.groups;
                PersonModDlg.sel_groups = PersonModDlg.user['group_ids'];
            }
            else {
                PersonModDlg.user = null;
                PersonModDlg.groups = data.groups;
                PersonModDlg.sel_groups = sel_groups;
            }

            PersonModDlg.show(PersonModDlg.user === null);
        });
    },
    show: function (new_person) {
        console.log(PersonModDlg.sel_groups);
        PersonModDlg.element = $(Handlebars.templates.user_edit_dlg(
            {
                'user': PersonModDlg.user,
                'groups': PersonModDlg.groups,
                'sel_groups': PersonModDlg.sel_groups,
                'ROOT': ROOT
            }
        ));
        PersonModDlg.dlg = new BootstrapDialog({
            type: BootstrapDialog.TYPE_PRIMARY,
            size: BootstrapDialog.SIZE_WIDE,
            message: PersonModDlg.element,
            onhidden: function () {
                PersonModDlg.stop_canvas();
                $('input[name="birthday"]', PersonModDlg.element).datepicker('destroy');
                PersonModDlg.callback = function () {
                };
            }
        });
        PersonModDlg.canvas = $('#canvas', PersonModDlg.element)[0];
        PersonModDlg.context = PersonModDlg.canvas.getContext("2d");
        PersonModDlg.video = $('#video', PersonModDlg.element)[0];

        PersonModDlg.bind();

        if (new_person || PersonModDlg.user['pic_name'] == '') {
            PersonModDlg.img_changed = true;
            PersonModDlg.play_canvas();
            $('#snapshot', PersonModDlg.element).show();
        } else {
            PersonModDlg.img_changed = false;
            PersonModDlg.stop_canvas();
            $('#curphoto', PersonModDlg.element).show();

        }

        if (new_person) {
            PersonModDlg.dlg.setTitle("Добавить персону");
            PersonModDlg.set_buttons('user_add', PersonModDlg.callback, null, PersonModDlg.sel_groups);
        } else {
            PersonModDlg.dlg.setTitle("Редактировать персону");
            PersonModDlg.set_buttons('user_mod', PersonModDlg.callback, PersonModDlg.user['id']);
        }
        PersonModDlg.dlg.open();
    },
    bind: function () {
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
        $('input[name="birthday"]', PersonModDlg.element).datepicker({
            language: "ru",
            todayHighlight: true,
            toggleActive: false
        }).on('changeDate', function () {
            $('input[name="dbdate"]', PersonModDlg.element).val(
                moment($(this).datepicker('getDate')).format('YYYY-MM-DD')
            );
        });

        var vl = $('input[name="dbdate"]', PersonModDlg.element).val();
        var dt = new Date();
        if (vl != '')
            dt = new Date(vl);
        $('input[name="birthday"]', PersonModDlg.element).datepicker(
            'update',
            new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 0, 0, 0)
        );

        PersonModDlg.bind_snap();
        PersonModDlg.bind_change();
    },
    bind_snap: function () {
        $('#snap', PersonModDlg.element).unbind('click').click(function (event) {
            event.preventDefault();
            PersonModDlg.context.drawImage(PersonModDlg.video, 0, 0, 320, 240);
        });
    },
    bind_change: function () {
        $('#change', PersonModDlg.element).unbind('click').click(function (event) {
            event.preventDefault();
            PersonModDlg.img_changed = true;
            PersonModDlg.play_canvas();
            $('#snapshot', PersonModDlg.element).show();
            $('#curphoto', PersonModDlg.element).hide();
        });
    },
    errBack: function (error) {
        console.error("Video capture error: ", error.code);
    },
    play_canvas: function () {
        // Grab elements, create settings, etc.
        var videoObj = {video: true, audio: false, facingMode: "user"};

        // Put video listeners into place
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) { // Standard
            navigator.mediaDevices
                .getUserMedia(videoObj)
                .then(function (stream) {
                    PersonModDlg.video.srcObject = PersonModDlg.video.src = stream;
                    PersonModDlg.video.play();
                })
                .catch(PersonModDlg.errBack);
        }
    },
    stop_canvas: function () {
        var context = PersonModDlg.canvas.getContext("2d");
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        if (PersonModDlg.video && PersonModDlg.video.srcObject)
            PersonModDlg.video.srcObject
                .getTracks()
                .forEach(function (e) {
                    e.stop();
                });
    },
    validate: function () {
        var ret = true;
        $('label.mandatory', PersonModDlg.element).each(function (index) {
            if ($(this).next('input').val() == '') {
                $(this).next('input').addClass('danger');
                ret = false;
            }
            else
                $(this).next('input').removeClass('danger');
        });

        return ret;
    },
    set_buttons: function (action, callback, user_id, group_id) {
        if (PersonModDlg.dlg === null)
            return;
        PersonModDlg.dlg.setButtons(
            [
                {
                    label: 'Сохранить',
                    action: function () {
                        if (!PersonModDlg.validate())
                            return;

                        ajax({
                            method: 'post',
                            url: ROOT + 'mt/users.php',
                            data: {
                                action: action,
                                id: user_id,
                                group_id: group_id,
                                params: PersonModDlg.get_data()
                            },
                            success: function (data) {
                                if (callback)
                                    callback(data.id);
                                PersonModDlg.dlg.close();

                            }
                        });
                    }
                },
                {
                    label: 'Отмена',
                    action: function () {
                        PersonModDlg.dlg.close();
                    }
                }
            ]);
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

module.exports = PersonModDlg;
