require('./common');
var request = null;
var Handlebars = require('handlebars/runtime');
if (typeof Handlebars.templates === 'undefined')
    Handlebars.templates = [];
Handlebars.templates.log_list = require('./templates/log_list.hbs');

$(document).ready(function () {
    var update_func = function () {
        if (request != null)
            request.cancel();

        request = ajax({
            url: ROOT + 'mt/log.php',
            data: {
                action: 'log'
            },
            success: function (data) {
                $('#icontent').html(Handlebars.templates.log_list(data));

                $(document).scroll(0);
                request = null;
            },
            complete: function(){
                setTimeout(update_func, 5000);
            }
        });
    };

    update_func();
});
