<?php
list($users) = $args;

HTML::include_js('js/users.js');

HTML::js('
    var TEACHER_GROUP_ID=' . $db->group_id_by_name(DLSConfig::$teachers_group_name) . ';
    var PUPIL_GROUP_ID=' . $db->group_id_by_name(DLSConfig::$pupils_group_name) . ';
');
