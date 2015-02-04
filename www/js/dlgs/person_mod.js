/**
 * Person  add dialogue
 */

var PersonModDlg = {
    element: '#person_mod_dlg',
    init: function() {
        if( $(PersonModDlg.element).length == 0 )
            return;
        $(PersonModDlg.element).dialog({
            autoOpen: false,
            modal: true,
            width: 750,
            height: 320,
            resizable: false
        });
        PersonModDlg.bind_all();
    },
    open: function ( org_id, callback, in_surname ) {
        if( $(PersonModDlg.element).length == 0 ) {
            console.error("Target not found");
            return;
        }

        clear_dialog( PersonModDlg.element );
        $(PersonModDlg.element).dialog( "option", "title", "Добавить персону" );

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
    edit: function ( person_id, callback ) {
        if( $(PersonModDlg.element).length == 0 ) {
            console.error("Target not found");
            return;
        }

        clear_dialog( PersonModDlg.element );
        $(PersonModDlg.element).dialog( "option", "title", "Редактировать персону" );


        tak_ajax({
            async: false,
            url: ROOT + 'mt/persons.php',
            data: {
                action: 'person_info',
                person_id: person_id
            },
            success: function(data) {
                $('input[name="name"]',      PersonModDlg.element).val(data.info[1]);
                $('input[name="d_name"]',    PersonModDlg.element).val(data.info[4]);
                $('input[name="surname"]',   PersonModDlg.element).val(data.info[2]);
                $('input[name="d_surname"]', PersonModDlg.element).val(data.info[5]);
                $('input[name="middle"]',    PersonModDlg.element).val(data.info[3]);
                $('input[name="d_middle"]',  PersonModDlg.element).val(data.info[6]);
                $('input[name="dbdate"]',    PersonModDlg.element).val(data.info[7]);
                var date = new Date(data.info[7]);
                $('input[name="birthday"]',  PersonModDlg.element).datepicker("setDate", date);
                $('input[name="pos"]',       PersonModDlg.element).val(data.info[10]);
            }
        });

        $(PersonModDlg.element).dialog('option', {
            'buttons': [{   text: 'Сохранить',
                click: function () {
                    if( !PersonModDlg.validate() )
                        return;

                    tak_ajax({
                        url: ROOT + 'mt/persons.php',
                        data: {
                            action: 'person_mod',
                            person_id: person_id,
                            params: PersonModDlg.get_data()
                        },
                        success: function(data) {
                            if( callback )
                                callback(data.id, data.name, data.d_name);
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
        $('input[name="surname"],input[name="name"],input[name="middle"]', PersonModDlg.element).unbind('blur').blur(function (e) {
            var s, n, m;
            s = $('input[name="surname"]', PersonModDlg.element).val();
            n = $('input[name="name"]', PersonModDlg.element).val();
            m = $('input[name="middle"]', PersonModDlg.element).val();
            
            if( s == '' || n == '' || m == '' ) {
                $('input[name="d_surname"],input[name="d_name"],input[name="d_middle"]', PersonModDlg.element).val('').attr('disabled', true);
                return;
            }
            
            tak_ajax({
                url: ROOT + 'mt/persons.php',
                data: {
                    action: 'dative',
                    surname: s,
                    name: n,
                    middle: m
                },
                success: function(data) {
                    $('input[name="d_surname"]', PersonModDlg.element).val(data.surname);
                    $('input[name="d_name"]', PersonModDlg.element).val(data.name);
                    $('input[name="d_middle"]', PersonModDlg.element).val(data.middle);
                    
                    $('input[name="d_surname"],input[name="d_name"],input[name="d_middle"]', PersonModDlg.element).attr('disabled', false);
                }
            });
            
        });

        $('input[name="birthday"]', PersonModDlg.element).datepicker({
            changeMonth: true,
            changeYear: true,
            minDate: '-90y',
            defaultDate: '01.01.1980',
            yearRange: '1930:-10y',
            altField: $('input[name="dbdate"]', PersonModDlg.element),
            altFormat: 'yy-mm-dd'/*,
            onSelect: function(dateText, inst) {
                load_trdays_by_date();
            }*/
        });
    },
    close: function () {
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
        return $('input', PersonModDlg.element).serializeObject();
    }
}

$(document).ready( function () {
    PersonModDlg.init();
});