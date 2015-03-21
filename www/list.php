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

HTML::set_title('Активность');
HTML::header(false, false);
HTML::template('list', array());
HTML::footer();
HTML::flush();
?>