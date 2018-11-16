var SHOW_TIME = 5 * 1000; // 5 seconds

$(document).ready( function() {
    $(".Warning", "#Error").each(function() {
        show_warning($(this).html());
    });
    $(".Success", "#Error").each(function() {
        show_success($(this).html());
    });
});

function show_error( msg ) {
    show_msg(msg, "#g_error");
}

function show_warning( msg ) {
    show_msg(msg, "#g_warning");
}

function show_info( msg ) {
    show_msg(msg, "#g_info");
}

function show_success( msg ) {
    show_msg(msg, "#g_success");
}

function show_msg( msg, target ) {
    if( target == null || !$(target) )
        return;

    $(".data", target).html(msg);
    $(target).slideDown('slow');

    var timer = window.setTimeout(function() {
        hide_msg(target);
    }, SHOW_TIME);

    $(".alertclose", target).click( function() {
        clearTimeout(timer);
        hide_msg(target);
    });
}


function hide_msg( target ) {
    $(target).slideUp('fast');
}


function print_typed_val( val ) {
    if( val == 'open' )             return 'открыто';
    else if( val == 'closed' )      return 'закрыто';
    else if( val == 'new' )         return 'открыто';
    else if( val == 'register' )    return 'регистрация';
    //'absence', 'presence', 'testing', 'examiner', 'closed', 'transfer'
    else if( val == 'initial' )     return 'незарегистрирован';
    else if( val == 'registered' )  return 'зарегистрирован';
    else if( val == 'absence' )     return 'неявка';
    else if( val == 'presence' )    return 'явка';
    else if( val == 'testing' )     return 'тестирование';
    else if( val == 'tested' )      return 'завершено';
    else if( val == 'examiner' )    return 'экзаменатор';
    else if( val == 'transfer' )    return 'перенос';
    return 'неизв.';
}

function print_test_types( value ) {
    if( value=="initial" )
        return 'первичная';
    else if( value=="periodical" )
        return 'периодическая';
    else
        return 'внеочередная';
}

function get_course_name(course) {
    return course.split(' ')[0];
}

function get_testing_time(str) {
    return str.substr(11,8);
}

function get_testing_length( str ) {
// 01234567890123456789012345
// 20:58:03.857691
    return str.substr(3, 5);
}

function get_twig_datetime( str ){
    return str.substr(8,2) + "."
        + str.substr(5, 2) + "."
        + str.substr(0,4) + " "
        + str.substr(11,8);
}

function get_twig_date( str ){
    // 0123456789
    // 2014-07-06
    return str.substr(8,2) + "."
        + str.substr(5, 2) + "."
        + str.substr(0,4);
}

// function highlights substring in string
function autocompl_highlight(s, t) {
    var matcher = new RegExp("("+$.ui.autocomplete.escapeRegex(t)+")", "ig" );
    return s.replace(matcher, "<strong>$1</strong>");
}

function tak_ajax(param) {
    var uri,data,onsuccess, async;
    uri = param.url;
    type = 'POST';
    data = param.data;
    onsuccess = param.success;
    if( typeof(param.async) == 'undefined' )
        async = true;
    else
        async = param.async;
    if( typeof(param.omit_errors) == 'undefined' )
        param.omit_errors = false;
    var e_status = $('#LoadingBox'); // 2DO: loading statuses - object with method update (on beforeSend - increment, and on success, error - decrement)
    var e_errors = $('#Error');
    if (e_status) e_status.show();
    if (e_errors) e_errors.hide();
    return $.ajax({
        url:uri,
        type:type,
        dataType:'json',
        data:data,
        async:async,
        success: function(data) {
            if (e_status) e_status.hide();
            if (!data||data.error) {
                if (data) {
//                    e_errors.html(data.error);
//                    alert(data.error);
                    if( !param.omit_errors )
                        show_error(data.error);
                }
                else 
//                    e_errors.html(S_AJAX_CONNECTION_ERROR+' '+ S_AJAX_EMPTY_RESPONSE);
                    show_error(S_AJAX_CONNECTION_ERROR+' '+ S_AJAX_EMPTY_RESPONSE);
//                if (e_errors)
//                    e_errors.show();
                return;
            }
            if (onsuccess) onsuccess(data);
        },
        error: function (xhr, status, err) {
            if (e_status) e_status.hide();
//            if (e_errors) {
                var emsg = '';
                if (status=="timeout") emsg = S_AJAX_CONNECTION_TIMEOUT;
                else if (status=="abort") emsg = S_AJAX_CONNECTION_ABORTED;
                else if (status=="parsererror") emsg = S_AJAX_CONNECTION_PARSER_ERROR;
                else emsg = xhr.statusText; // status=="error"
//                e_errors.html(S_AJAX_CONNECTION_ERROR+' '+emsg);
//                e_errors.show();
                if( !param.omit_errors && status != "abort" )
                    show_error(S_AJAX_CONNECTION_ERROR+' '+emsg);
//            }
        }
    });      
}

function clear_dialog( dlg_id ) {
    $(':text', dlg_id).val('');
    $('[type=number]', dlg_id).val('');
    $('[type=password]', dlg_id).val('');
    $('[type=hidden]', dlg_id).val('');
    $('textarea', dlg_id).val('');
    $('input:checked', dlg_id).attr('checked', false);
}

