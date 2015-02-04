<?php

define('INSTALL_ROOT', dirname(__FILE__).'/');
define('ROOT', INSTALL_ROOT.'./');

spl_autoload_register(function($class) {
    if (0 === strpos($class, 'TwigJs\\')) {
        $file = INSTALL_ROOT. str_replace('\\', '/', $class) . '.php';
        if (is_file($file)) {
            require $file;
            return true;
        }
    }
});

# recursively remove a directory
function rrmdir($dir) {
    foreach(glob($dir . '/*') as $file) {
        if(is_dir($file))
            rrmdir($file);
        else
            unlink($file);
    }
    rmdir($dir);
}

require_once ROOT.'Twig/Autoloader.php';
Twig_Autoloader::register();

require_once ROOT . 'classes/helpers.php';
require_once ROOT . 'config.php';

$tplDir = ROOT.'twig_tpl';
$jsTplDir = ROOT.'templates/twig_js/';
//$phpTplDir = ROOT.'../templates/php/twig';
$phpTplDir = TWIG_PHP_TPL_DIR; //'./twig_cache';
rrmdir($phpTplDir);
mkdir($phpTplDir);
$loader = new Twig_Loader_Filesystem($tplDir);
$twig = new Twig_Environment($loader, array(
//    'debug' => true,
    'auto_reload' => true,
    'cache' => $phpTplDir,
    'autoescape' => false));
$twig->addGlobal('ROOT', ROOT);
//$twig->addExtension(new Twig_Extensions_Extension_I18n());
$twig->addExtension(new Twig_Extension_Core());
$twig->addFilter('get_course_name', new Twig_Filter_Function('get_course_name'));
$twig->addFilter('get_testing_time', new Twig_Filter_Function('get_testing_time'));
$twig->addFilter('get_testing_length', new Twig_Filter_Function('get_testing_length'));
$twig->addFilter('print_typed_val', new Twig_Filter_Function('print_typed_val'));
$twig->addFilter('print_test_types', new Twig_Filter_Function('print_test_types'));
$twig->addFilter('protocol_date', new Twig_Filter_Function('protocol_date'));
$twig->addFilter('get_twig_datetime', new Twig_Filter_Function('get_twig_datetime'));
$twig->addFilter('get_twig_date', new Twig_Filter_Function('get_twig_date'));
$twig->addExtension(new Twig_Extension_Debug());

$handler = new TwigJs\CompileRequestHandler($twig, new TwigJs\JsCompiler($twig));

foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($tplDir), RecursiveIteratorIterator::LEAVES_ONLY) as $file) {
    if ('.twig' !== substr($file, -5)) continue;

    $request = new TwigJs\CompileRequest('__twig_tpl_'.basename($file), file_get_contents($file));
    file_put_contents($jsTplDir.basename($file, '.twig').'.js',
        $handler->process($request));
    $twig->loadTemplate(str_replace($tplDir.'/', '', $file));
}

?> 
