<?php
define('ROOT','./');
require(ROOT.'classes/init.php');
require(ROOT.'classes/html.php');
 
if( !$user || $user->is_anonymous() )
{
    $redirect=ROOT.'login.php';
    header ('Location: '.$redirect);
    exit(0);
}
 
$redirect=ROOT.'td.php';
header ('Location: '.$redirect);
exit(0);
HTML::set_title('');
HTML::header();
HTML::write( "Добро пожаловать!!!<br/>");
/*HTML::write( "<a href='login.php'>Login</a><br/>");
HTML::write( "<a href='register.php'>Register</a><br/>");
HTML::write( "<input type='button' onclick='$(\"#Error\").show();' value='do' />");
*/
HTML::footer();
HTML::flush();
?>
