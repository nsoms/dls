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
    if($card == '')
        $card = null;
    $group_ids = get_or_post('g');
    $id = get_or_post_int('id');

    if(!is_array($group_ids) && $group_ids !== null)
        $group_ids = array($group_ids);

    $users = $db->users_get($user->id, $id, $card, $surname, $name, ($group_ids !== null ? $group_ids : null));
    $user_rights = array('mod' => $user->users_mod, 'role_set' => $user->users_role_set);

    JSON::reply(array(
        'users' => $users,
        'user_rights' => $user_rights
    ));
} elseif ($action === 'user_info') {
    $id = get_or_post_int('id');

    $users = $db->users_get($user->id, $id, null, null, null, null);
    $user_rights = array('mod' => $user->users_mod, 'role_set' => $user->users_role_set);

    $groups = $db->groups_get($user->id, null, null);

    foreach ($users as &$user)
        $user[13] = $db->parse_array($user[13]);

    JSON::reply(array(
        'users' => $users,
        'groups' => $groups,
        'user_rights' => $user_rights
    ));
} elseif ($action === 'user_mod') {
    $id = get_or_post_int('id');
    $data = get_or_post('params');
    //print_r($data);

    list($card, $surname, $name, $middle, $birthday, $regclass, $regday, $groups) = array(
        Sanitize::clean($data['card']),
        Sanitize::clean($data['surname']),
        Sanitize::clean($data['name']),
        Sanitize::clean($data['middle']),
        Sanitize::clean($data['birthday']),
        Sanitize::clean($data['regclass']),
        Sanitize::clean($data['regday']),
        $data['groups']
    );

    if ($regclass == '' || $regclass == null)
        JSON::error(-1000);

    $picname = null;
    $canvas = $data['canvas'];
    if (strlen($canvas) > 0) {
        $canvas = str_replace('data:image/jpeg;base64,', '', $canvas);
        $canvas = str_replace(' ', '+', $canvas);
        $img = base64_decode($canvas);

        $path = ROOT . '/photos/' . substr($regday, 0, 4) . '/' . $regclass;
        if (!file_exists($path)) {
            mkdir($path, 0777, true);
        }
        $picname = $path . '/' . $surname . $id . '.jpg';
        file_put_contents($picname, $img);
    }


    $res = $db->user_mod($user->id, $id, $card, $surname, $name, $middle, $picname, $birthday, $regclass, $groups);

    if ($res < 0)
        JSON::error($res);

    JSON::reply(array(
        'success' => 1
    ));
}
