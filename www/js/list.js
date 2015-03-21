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
                action: 'list'
            },
            success: function(data) {
                $('#icontent').html(tpl_log_list({
                    'list': data.users
                }));

                $(document).scroll(0);
                request = null;
                bind_pupil_add();
                bind_teacher_add();
            }
        });
    }
});
