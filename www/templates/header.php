<?php
list($left_menu, $check_login) = $args;

global $user;
if ($check_login && $user->is_anonymous() && HTML::page_name() != "login.php") {
    header("Location: login.php");
    exit(0);
}
if (!$check_login && $user->is_anonymous())
    $user = User::create_anonymous();

$menu = array(
    array(
        'pagename' => 'users.php',
        'caption' => 'Персоны',
        'show' => $user->users_see
    ),
    array(
        'pagename' => 'groups.php',
        'caption' => 'Группы',
        'show' => $user->groups_see
    ),
    array(
        'pagename' => 'list.php',
        'caption' => 'Активность',
        'show' => $user->log_see
    )
);
?><!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title><?php echo HTML::$title; ?></title>
    <meta http-equiv="content-type" content="text/html; charset=utf-8"/>
    <?php

    HTML::js('var AUTHENTICATED=' . ($user->is_anonymous() ? 'false;' : 'true;'));

    HTML::js('');

    HTML::write_css_files(); ?>
</head>
<body>
<div id="wrapper">
    <!-- Navigation -->
    <nav class="navbar navbar-default navbar-static-top" role="navigation" style="margin-bottom: 0">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse"
                    data-target=".navbar-collapse">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="<?php echo ROOT; ?>index.php">
                <?php echo DLSConfig::$site_name ?>
            </a>
            <small id="loading_target" style="display: none"></small>
        </div>
        <!-- /.navbar-header -->

        <?php
        if (!$user->is_anonymous()) {
            ?>
            <ul class="nav navbar-top-links navbar-right">
                <li class="dropdown">
                    <a id="user_dropdown" class="dropdown-toggle" data-toggle="dropdown"
                       aria-haspopup="true" aria-expanded="false" href="/" style="">
                        <?php echo $user->name; ?>
                        <i class="fa fa-user fa-fw"></i> <i class="fa fa-caret-down"></i>
                    </a>
                    <ul class="dropdown-menu dropdown-user" aria-labelledby="user_dropdown">
                        <?php
                        /*
                        <li><a href="#"><i class="fa fa-user fa-fw"></i> User Profile</a></li>
                        <li><a href="#"><i class="fa fa-gear fa-fw"></i> Settings</a></li>
                        <li class="divider"></li>
                        */
                        ?>
                        <li><a href="<?php echo ROOT; ?>logout.php"><i class="fa fa-sign-out fa-fw"></i>
                                Выйти</a></li>
                    </ul>
                    <!-- /.dropdown-user -->
                </li>
                <!-- /.dropdown -->
            </ul>
            <!-- /.navbar-top-links -->
            <?php
        }
        ?>

        <div class="navbar-default sidebar" role="navigation">
            <div class="sidebar-nav navbar-collapse">
                <ul class="nav" id="side-menu">
                    <?php //echo Menu::print_menu($user);
                    foreach ($menu as $m) {
                        if (/*isset($user) && !$user->is_anonymous() && */
                            $m['show'] === 't')
                            echo "<li",
                            (HTML::page_name() == $m['pagename'] || HTML::page_path() . '/' . HTML::page_name() == $m['pagename'] ? ' class="selected"' : ''),
                            "><a href='", ROOT, $m['pagename'], "'>", $m['caption'], "</a></li>\n";
                    } ?>
                </ul>
            </div>
            <!-- /.sidebar-collapse -->
        </div>
        <!-- /.navbar-static-side -->
    </nav>

    <div id="page-wrapper">
        <div class="errors hidden" id="errors"><?php HTML::placeholder('errors'); ?></div>
        <div class="infos hidden" id="infos"><?php HTML::placeholder('infos'); ?></div>

        <!-- CONTENT STARTED -->
