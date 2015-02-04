<?php

define('ROOT','./');
require(ROOT.'classes/init.php');
require(ROOT.'classes/html.php');

function redir_logout()
{
    header('Location:' . ROOT . 'logout.php');
    exit(0);
}


function redir() {
    Session::start();
    if (isset($_SESSION['login_redirect'])) {
        $redirect = $_SESSION['login_redirect'];
        $_SESSION['login_redirect'] = null;
    }

    if (!isset($redirect) || !$redirect || $redirect[0]!='/') {
        $redirect=substr($_SERVER["PHP_SELF"],0,-9).ROOT.'index.php';
    }

    $redirect='http://'.$_SERVER["SERVER_NAME"].":".$_SERVER["SERVER_PORT"].$redirect;
    header ('Location: '.$redirect);
    exit(0);
}

function write_form($err=1) {
    global $redirect;
    if ($err<0) HTML::add_error($err);
    HTML::header();
    HTML::include_jquery();
    HTML::template('login_form',array());
    HTML::footer();
    HTML::flush();
    exit(0);
}



HTML::set_title('Вход');

if( !$user->is_anonymous() ) {
    redir_logout();
}

if (isset($_GET['login_required'])) 
    write_form(-1);

if (isset($_POST['l'])&&isset($_POST['p'])) {
    require_once(ROOT.'classes/db.php');
    $u = $db->check_auth($_POST['l'],$_POST['p']);
    if ($u==null)
        write_form(-2);
    $user = $u;
    $user->set_session();
    redir();
    exit(0);
}

if (isset($_GET['action'])) 
    $action = $_GET['action'];
else 
    $action = '';

write_form();

?>
