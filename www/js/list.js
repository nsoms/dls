/**
 * Created by soms on 04.02.15.
 */
var request = null;

$(document).ready(function() {
    var update_func = function () {
        if(request != null)
            request.cancel();

        request = tak_ajax({
            url: ROOT + 'mt/log.php',
            data: {
                action: 'log'
            },
            success: function(data) {
                $('#icontent').html(tpl_log_list({
                    data: data.data
                }));

                $(document).scroll(0);
                request = null;
            }
        });
    }

    setInterval(update_func, 5000);
});
