<?php

define('ROOT','../');
require(ROOT.'classes/init.php');
require(ROOT.'classes/html.php');
require_once(ROOT.'classes/db.php');
include(ROOT . 'classes/json.php');
include(ROOT . 'classes/helpers.php');

Util::set_json_mode(true);

$action = get_or_post('action');
if( $action === 'log' ) {
    $data = $db->log_list(DLSConfig::$log_list_limit);

    JSON::reply(array(
        'data' => $data
    ));
}