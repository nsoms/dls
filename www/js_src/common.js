require('../scss/styles.scss');

require('jquery');
require('jquery-ui');
require('bootstrap');
require('bootstrap-multiselect');
require('jquery.aiire.ajax.js');

var Handlebars = require('handlebars/runtime');
require('aiire.handlebars.ifcond.js')(Handlebars);

Handlebars.registerHelper('ifIn', function(elem, list, options) {
    if(list && list.constructor === Array && list.indexOf(elem) > -1) {
        return options.fn(this);
    }
    return options.inverse(this);
});
Handlebars.registerHelper('formatDate', formatDate);
Handlebars.registerHelper('formatDateTime', formatDateTime);

var SHOW_TIME = 5 * 1000; // 5 seconds


function formatDateTime( str ){
    if (str == null)
        return "";

    return str.substr(8,2) + "."
        + str.substr(5, 2) + "."
        + str.substr(0,4) + " "
        + str.substr(11,8);
}

function formatDate( str ){
    // 0123456789
    // 2014-07-06
    if (str == null)
        return "";
    return str.substr(8,2) + "."
        + str.substr(5, 2) + "."
        + str.substr(0,4);
}

// function highlights substring in string
function autocompl_highlight(s, t) {
    var matcher = new RegExp("("+$.ui.autocomplete.escapeRegex(t)+")", "ig" );
    return s.replace(matcher, "<strong>$1</strong>");
}

function clear_dialog( dlg_id ) {
    $(':text', dlg_id).val('');
    $('[type=number]', dlg_id).val('');
    $('[type=password]', dlg_id).val('');
    $('[type=hidden]', dlg_id).val('');
    $('textarea', dlg_id).val('');
    $('input:checked', dlg_id).attr('checked', false);
}

module.exports = {
    'clear_dialog': clear_dialog
};

