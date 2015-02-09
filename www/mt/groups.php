<?php

define('ROOT','../');
require(ROOT.'classes/init.php');
require(ROOT.'classes/html.php');
require_once(ROOT.'classes/db.php');
include(ROOT . 'classes/json.php');
include(ROOT . 'classes/helpers.php');

Util::set_json_mode(true);

$action = get_or_post('action');
if( $action === 'groups_list' ) {
    $groups = $db->groups_get($user->id, null, null);
    $user_rights = array('mod' => $user->groups_mod);

    JSON::reply(array(
        'groups' => $groups,
        'user_rights' => $user_rights
    ));
}
