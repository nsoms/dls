<?php
list($users) = $args;

HTML::include_jquery();
HTML::include_jquery_ui();

HTML::include_bootstrap();
HTML::include_js('js/bootstrap-multiselect.js');
HTML::include_css('css/bootstrap-multiselect.css');

HTML::include_js('js/users.js');
HTML::twig_js_template_file('users_list');
HTML::twig_js_template_file('groups_select');

HTML::include_dlg('person_mod', array());



HTML::js('
    var TEACHER_GROUP_ID=' . $db->group_id_by_name(DLSConfig::$teachers_group_name) . ';
    var PUPIL_GROUP_ID=' . $db->group_id_by_name(DLSConfig::$pupils_group_name) . ';
');
