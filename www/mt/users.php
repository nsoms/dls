<?php

define('ROOT','../');
require(ROOT.'classes/init.php');
require(ROOT.'classes/html.php');
require_once(ROOT.'classes/db.php');
include(ROOT . 'classes/json.php');
include(ROOT . 'classes/helpers.php');

Util::set_json_mode(true);

$action = get_or_post('action');
if( $action === 'users_list' ) {
    $name = get_or_post('n');
    $surname = get_or_post('s');
    $card = get_or_post('c');
    $group_id = get_or_post_int('g');
    $id = get_or_post_int('id');

    $users = $db->users_get($user->id, $id, $card, $surname, $name, ($group_id !== null ? array($group_id) : null));
    $user_rights = array('mod' => $user->users_mod, 'role_set' => $user->users_role_set);

    JSON::reply(array(
        'users' => $users,
        'user_rights' => $user_rights
    ));
}
