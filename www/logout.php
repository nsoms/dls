<?php

define('ROOT','./');
include(ROOT.'classes/html.php');

Session::destroy();
$user = User::create_anonymous();

$redirect=ROOT.'login.php';
header ('Location: '.$redirect);
exit(0);

/*
HTML::header();
HTML::write('logged out');
HTML::footer();
HTML::flush();
*/
?>
