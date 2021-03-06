<?php

define('ROOT','../');
require(ROOT.'classes/init.php');
require(ROOT.'classes/html.php');
require_once(ROOT.'classes/db.php');
include(ROOT . 'classes/json.php');
include(ROOT . 'classes/helpers.php');

Util::set_json_mode(true);

$action = get_or_post('action');
if( $action === 'check' ) {
    $card_num = get_or_post('card');
    $reader = get_or_post('reader');

    $res = $db->check_card($card_num, $reader);

    JSON::reply(array(
        'access' => $res
    ));
}