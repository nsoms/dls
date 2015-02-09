/**
 * Person  add dialogue
 */

var PersonModDlg = {
    element: '#person_mod_dlg',
    canvas: false,
    context: false,
    video: false,
    img_changed: false,
    init: function() {
        if( $(PersonModDlg.element).length == 0 )
            return;
        $(PersonModDlg.element).dialog({
            autoOpen: false,
            modal: true,
            width: 800,
            height: 650,
            resizable: false
        });
        PersonModDlg.canvas = document.getElementById("canvas");
        PersonModDlg.context = PersonModDlg.canvas.getContext("2d");
        PersonModDlg.video = document.getElementById("video");
        PersonModDlg.bind_all();
        PersonModDlg.play_canvas();
    },
    open: function ( org_id, callback, in_surname ) {
        if( $(PersonModDlg.element).length == 0 ) {
            console.error("Target not found");
            return;
        }

        clear_dialog( PersonModDlg.element );
        $(PersonModDlg.element).dialog( "option", "title", "Добавить персону" );
        PersonModDlg.img_changed = true;
        //PersonModDlg.play_canvas();

        if( in_surname )
            $('input[name="surname"]', PersonModDlg.element).val(in_surname);
        
        $(PersonModDlg.element).dialog('option', {
            'buttons': [{   text: 'Сохранить',
                            click: function () {
                                if( !PersonModDlg.validate() )
                                    return;

                                tak_ajax({
                                    url: ROOT + 'mt/persons.php',
                                    data: {
                                        action: 'person_add',
                                        org: org_id,
                                        params: PersonModDlg.get_data()
                                    },
                                    success: function(data) {
                                        if( callback )
                                            callback(data.id, data.name);
                                        PersonModDlg.close();
                                    }
                                });
                            }
                        },
                        {   text: 'Отмена',
                            click: function() {
                                $(this).dialog('close');
                            }
                        }],
            'position': 'center top+10'
                    
        });
        $(PersonModDlg.element).dialog('open');
    },
    edit: function ( user_id, callback ) {
        if( $(PersonModDlg.element).length == 0 ) {
            console.error("Target not found");
            return;
        }

        clear_dialog( PersonModDlg.element );
        $(PersonModDlg.element).dialog( "option", "title", "Редактировать персону" );
        PersonModDlg.stop_canvas();

        tak_ajax({
            async: false,
            url: ROOT + 'mt/users.php',
            data: {
                action: 'user_info',
                id: user_id
            },
            success: function(data) {
                if(data.user_rights['mod'] != 't'){
                    show_error('Недостаточно прав');
                    return;
                }
                $('input[name="card"]',   PersonModDlg.element).focus();


                var user = null, pic_name = null;
                if(data.users.length == 1)
                    user = data.users[0];
                if(user.length == 0){
                    show_error('Ошибка получения данных');
                    return;
                }

                $('input[name="surname"]',   PersonModDlg.element).val(user[2]);
                $('input[name="name"]',      PersonModDlg.element).val(user[3]);
                $('input[name="middle"]',    PersonModDlg.element).val(user[4]);
                pic_name = user[5];
                $('input[name="dbdate"]',    PersonModDlg.element).val(user[5]);
                var date = new Date(user[6]);
                $('input[name="birthday"]',  PersonModDlg.element).datepicker("setDate", date);

                $('input[name="regday"]',    PersonModDlg.element).val(user[7]);
                $('input[name="regclass"]',  PersonModDlg.element).val(user[8]);

                if (pic_name !== null && pic_name != '') {
                    PersonModDlg.img_changed = false;
                    //PersonModDlg.stop_canvas();
                    $('#snapshot', PersonModDlg.element).hide();
                    $('#curphoto', PersonModDlg.element).show();
                    $('#picname', PersonModDlg.element).attr('src', pic_name);
                } else {
                    PersonModDlg.img_changed = true;
                    //PersonModDlg.play_canvas();
                    $('#snapshot', PersonModDlg.element).show();
                    $('#curphoto', PersonModDlg.element).hide();
                }

                $('#groups_select', PersonModDlg.element).html(
                    tpl_groups_select({
                        'groups': data.groups,
                        'sel': user[13]
                    })
                );
                $('#groups_select', PersonModDlg.element).multiselect('destroy');
                $('#groups_select', PersonModDlg.element).multiselect({
                    //checkboxName: 'groups[]',
                    buttonText: function(options, select) {
                        if (options.length === 0) {
                            return 'Необходимо выбрать группы';
                        }
                        else {
                            var labels = [];
                            options.each(function() {
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
            }
        });

        $(PersonModDlg.element).dialog('option', {
            'buttons': [{   text: 'Сохранить',
                click: function () {
                    if( !PersonModDlg.validate() )
                        return;

                    tak_ajax({
                        url: ROOT + 'mt/users.php',
                        data: {
                            action: 'user_mod',
                            id: user_id,
                            params: PersonModDlg.get_data()
                        },
                        success: function(data) {
                            if( callback )
                                callback(data.id);
                            PersonModDlg.close();
                        }
                    });
                }
            },
                {   text: 'Отмена',
                    click: function() {
                        $(this).dialog('close');
                    }
                }],
            'position': 'center top+10'
        });
        $(PersonModDlg.element).dialog('open');
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
    play_canvas: function() {
        // Grab elements, create settings, etc.
        var videoObj = { "video": true },
            errBack = function(error) {
                console.error("Video capture error: ", error.code);
            };

        // Put video listeners into place
        if(navigator.getUserMedia) { // Standard
            navigator.getUserMedia(videoObj, function(stream) {
                PersonModDlg.video.src = stream;
                PersonModDlg.video.play();
            }, errBack);
        } else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
            navigator.webkitGetUserMedia(videoObj, function(stream){
                PersonModDlg.video.src = window.webkitURL.createObjectURL(stream);
                PersonModDlg.video.play();
            }, errBack);
        }
        else if(navigator.mozGetUserMedia) { // Firefox-prefixed
            navigator.mozGetUserMedia(videoObj, function(stream){
                PersonModDlg.video.src = window.URL.createObjectURL(stream);
                PersonModDlg.video.play();
            }, errBack);
        }
    },
    stop_canvas: function () {
        //PersonModDlg.video.pause();
        //PersonModDlg.video.src = null;

        var context = PersonModDlg.canvas.getContext("2d");
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    },
    bind_snap: function() {
        $('#snap', PersonModDlg.element).click( function(event) {
            event.preventDefault();
            PersonModDlg.context.drawImage(PersonModDlg.video, 0, 0, 320, 240);
        });
    },
    bind_change: function () {
        $('#change').click( function(event) {
            event.preventDefault();
            PersonModDlg.img_changed = true;
            //PersonModDlg.play_canvas();
            $('#snapshot', PersonModDlg.element).show();
            $('#curphoto', PersonModDlg.element).hide();
        });
    },
    close: function () {
        PersonModDlg.stop_canvas();
        $(PersonModDlg.element).dialog('close');
    },
    validate: function () {
        var ret = true;
        $('label.mandatory', PersonModDlg.element).each( function (index) {
            if( $(this).next('input').val() == '' ) {
                $(this).next('input').addClass('not_filled');
                ret = false;
            }
            else
                $(this).next('input').removeClass('not_filled');
        });
        
        return ret;
    },
    get_data: function() {
        var data = {};
        $('input', PersonModDlg.element).each(function () {
            data[$(this).attr('name')] = $(this).val();
        });
        data['canvas'] = (PersonModDlg.img_changed ? PersonModDlg.canvas.toDataURL("image/jpeg") : null);
        data['groups'] = $('#groups_select', PersonModDlg.element).val();

        return data;
    }
};

$(document).ready( function () {
    PersonModDlg.init();
});