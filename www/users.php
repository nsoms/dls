<?php
/**
 * Created by PhpStorm.
 * User: soms
 * Date: 31.01.15
 * Time: 19:30
 */

define('ROOT','./');
require(ROOT.'classes/init.php');
require(ROOT.'classes/html.php');

HTML::set_title('Персоны');
HTML::header();

//$users = $db->users_get($user->id, null, null, null, null, null);
$users = array();

HTML::template('users', array($users));
HTML::footer();
HTML::flush();
?>