<?php
list($left_menu, $check_login) = $args;
global $user;

$pagename = HTML::page_name();
?><!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">


    <link rel="apple-touch-icon" sizes="180x180" href="<?php echo ROOT; ?>/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="<?php echo ROOT; ?>/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="<?php echo ROOT; ?>/favicon-16x16.png">
    <link rel="manifest" href="<?php echo ROOT; ?>/manifest.json">
    <link rel="mask-icon" href="<?php echo ROOT; ?>/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="theme-color" content="#ffffff">

    <?php
    HTML::include_js(ROOT . 'js/vendor.js');
    HTML::include_css(ROOT . 'js/vendor.css');
    ?>

    <title><?php echo HTML::$title; ?></title>

    <?php
    HTML::write_css_files();
    HTML::write_js_code();
    HTML::write_js_files();
    ?>

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>
<body>

<!-- Navigation -->
<nav class="navbar navbar-default navbar-static-top" role="navigation" style="margin-bottom: 0">
    <div class="navbar-header">
        <a class="navbar-brand" href="<?php echo ROOT; ?>index.php"><?php echo DLSConfig::$site_name ?></a>
    </div>
    <!-- /.navbar-header -->

    <ul class="nav navbar-top-links navbar-right">
        <li>
            <?php
            if (!$user->is_anonymous()) {
                ?>
                <a href="<?php echo ROOT; ?>logout.php"><i class="fa fa-sign-out fa-fw"></i> Выйти</a>
                <?php
            } else {
                ?>
                <a href="<?php echo ROOT; ?>login.php"><i class="fa fa-sign-out fa-fw"></i> Войти</a>
                <?php
            }
            ?>
        </li>
        <!-- /.dropdown -->
    </ul>
</nav>

<div class="errors hidden" id="errors"><?php HTML::placeholder('errors'); ?></div>
<div class="infos hidden" id="infos"><?php HTML::placeholder('infos'); ?></div>

<!-- CONTENT STARTED -->
