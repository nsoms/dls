<?php /* Общие элементы html и локализация*/

require_once(ROOT.'classes/init.php');
require_once(ROOT.'classes/session.php');
require_once(ROOT.'classes/user.php');
require_once(ROOT.'/config.php');

define ('TEMPLATE_TYPE_PLAIN', 0);
define ('TEMPLATE_TYPE_META', 1);
define ('TEMPLATE_TYPE_TWIG', 2);
define ('TEMPLATE_TYPE_DLG', 3);

define ('PAGE_CAPT_PREFIX', 'DLS');

class HTML {

    public static $errors = array();
    public static $infos = array();
    public static $title = PAGE_CAPT_PREFIX;
    public static $page_title = '';
    public static $twig = null;
    public static $output_started = false;

    private static $templates = array();
    private static $js_files = array();
    private static $js = array();
    private static $js_templates = array();
    private static $css_files = array();
    private static $placeholders = array();
    private static $flush_started = false;
    private static $error_calls = 0;

    private static $twig_js_initialized = false;
    public static function get_ip_address() {
        return $_SERVER['REMOTE_ADDR'];
        /*
        foreach (array('HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 'HTTP_X_CLUSTER_CLIENT_IP', 'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED', 'REMOTE_ADDR') as $key) {
            if (array_key_exists($key, $_SERVER) === true) {
                foreach (explode(',', $_SERVER[$key]) as $ip) {
                    if (filter_var($ip, FILTER_VALIDATE_IP) !== false) {
                        return $ip;
                    }
                }
            }
        }*/
    }

    // function check client ip address and if it is in 192.*.*.* then returns true, otherwise - false
    public static function ip_address_is_local() {
        if( filter_var(
                    HTML::get_ip_address(),
                    FILTER_VALIDATE_IP,
                    FILTER_FLAG_IPV4 | FILTER_FLAG_NO_PRIV_RANGE ) !== false
                && HTML::get_ip_address() != '127.0.0.1' )
            return false;
        return true;
    }

    public static function page_name() {
        return substr($_SERVER["SCRIPT_NAME"],strrpos($_SERVER["SCRIPT_NAME"],"/")+1);
    }
    public static function page_path() {
        $page = $_SERVER["SCRIPT_NAME"];
        if( $page[0] == '/' )
            $page = substr($page, 1);
        $page = substr($page, 0, strpos($page, HTML::page_name()) - 1);
        $last_slash = strrpos($page,"/");
        $page = ( $last_slash === false ? $page : substr($page,$last_slash+1) );
        return $page;
    }
    public static function page_params() {
        return $_SERVER['QUERY_STRING'];
    }
    public static function page_params_array() {
       $arr = array();
       parse_str($_SERVER['QUERY_STRING'], $arr);
       return $arr;
    }
    public static function page_name_w_params() {
        return HTML::page_name() . '?' . HTML::page_params();
    }
    public static function template($tpl,$args=array()) {
        HTML::$templates[] = array(TEMPLATE_TYPE_META, $tpl, $args);
    }
    public static function include_template_meta($template,$args=null) {
        global $user,$db,$topic_id;
        $metafile = ROOT.'templates/'.$template.'.meta.php';
        if (!file_exists($metafile)) return;
        include($metafile);
    }
    public static function flush() {
        global $db;
        HTML::$flush_started = true;
        foreach (HTML::$infos as $e) {
            HTML::fill_placeholder('errors','<b>Info: '.$e.'</b><br/>');
        }
        foreach (HTML::$errors as $e) {
            HTML::fill_placeholder('errors','<b>Error: '.$e.'</b><br/>');
        }

        $init_twig = false;
        foreach (HTML::$templates as $t) {
            list($tt,$tc,$args) = $t;
            switch ($tt) {
                case TEMPLATE_TYPE_PLAIN:
                    break;
                case TEMPLATE_TYPE_DLG:
                    break;
                case TEMPLATE_TYPE_META:
                    HTML::include_template_meta($tc,$args);
                    break;
                case TEMPLATE_TYPE_TWIG:
                    $init_twig = true;
                    break;
            }
        }
        if ($init_twig) HTML::twig_init();

        HTML::$output_started = true;
        foreach (HTML::$templates as $t) {
            list($tt,$tc,$args) = $t;
            switch ($tt) {
                case TEMPLATE_TYPE_PLAIN:
                    echo $tc;
                    break;
                case TEMPLATE_TYPE_DLG:
                    include_once(ROOT.'templates/dlgs/'.$tc.'.php');
                    break;
                case TEMPLATE_TYPE_META:
                    include_once(ROOT.'templates/'.$tc.'.php');
                    break;
                case TEMPLATE_TYPE_TWIG:
                    echo HTML::twig_template_render($template, $args);
                    break;
            }
        }
    }

    public static function shit_happens($errid=-1000) {
        HTML::add_error($errid);
    }

    public static function add_error($errid) {
        if($errid>=1000) {
            HTML::$errors[] = Errors::get(-1000);
        } else {
            HTML::$errors[] = Errors::get($errid);
        }
        HTML::js("$(document).ready(function() { $('#Error').show(); });");
    }

    public static function add_info($errid) {
        if($errid>=1000) {
            HTML::$infos[] = Errors::get(-1000);
        } else {
            HTML::$infos[] = Errors::get($errid);
        }
    }

    public static function all($template,$args=array()) {
        HTML::header();
        HTML::template($template,$args);
        HTML::footer();
        HTML::flush();
        exit(0);
    }

    public static function write($html) {
        HTML::$templates[] = array(0,$html."\n",null);
    }
    public static function set_title($page_title) {
        HTML::$page_title = $page_title;
        HTML::$title = PAGE_CAPT_PREFIX . ' - ' . $page_title; 
    }

    public static function header($jquery=false) {
        HTML::template('header');
    }

    public static function include_dlg( $template, $args ) {
        HTML::$templates[] = array(TEMPLATE_TYPE_DLG, $template, $args);
        //HTML::fill_placeholder( 'dialogues', file_get_contents( ROOT . 'templates/dlgs/' .  $name . '.php' ) );
        HTML::include_js( ROOT . 'js/dlgs/' . $template . '.js' );
    }

    /*
     * Определяет дату модификации файла на основе
     * Config::$files_versions из config.auto.php
     * Если данных нет возвращает null
     */
    public static function get_file_timestamp($filename) {
        $filename = substr($filename, strlen(ROOT));
        if (isset(Config::$files_versions[$filename]))
            return Config::$files_versions[$filename];
        return null;
    }

    public static function write_js_files() {
        foreach (HTML::$js_files as $f=>$ch) {
            if ($ch===true) $chstr='';
            else $chstr=' charset="'.$ch.'"';
//            echo '<script type="text/javascript" src="',$f,'"',$chstr,'></script>',"\n";
            $tstamp = HTML::get_file_timestamp($f);
            echo '<script type="text/javascript" src="', $f;
            if ($tstamp) echo '?', $tstamp;
            echo '"', $chstr, '></script>', "\n";
        }
    }
    
    public static function write_js_code() {
        if (count(HTML::$js)<=0) return; 
        echo '<script type="text/javascript">';
        foreach (HTML::$js as $f) echo $f,"\n";
        echo '</script>',"\n";
    }
    
    public static function write_css_files() {
        foreach (HTML::$css_files as $f=>$tmp) {
//            echo '<link rel="stylesheet" type="text/css" media="all" href="',$f,'" />',"\n";
            $tstamp = HTML::get_file_timestamp($f);
            echo '<link rel="stylesheet" type="text/css" media="all" href="';
            echo $f;
            if ($tstamp) echo '?', $tstamp;
            echo '" />';
        }
    }
    
    public static function js($code) {
        HTML::$js[] = $code;
    }
    public static function js_template($name,$code) {
        $code = trim($code);
        $code = str_replace("\r",'',$code);
        $code = str_replace("'","\\'",$code);
        $code = str_replace("\n","\\n'+\n'",$code);
        HTML::$js[] = 'var '.$name.'_obj = new EJS({text:\''.$code.'\'});'; // ejs templates
        HTML::$js[] = "var $name = ${name}_obj.render.bind(${name}_obj);";
    }
    public static function js_template_file($name) {
        $fname = 'templates/js/'.$name.'.ejs';
//    HTML::$js[] = 'EJS.config({cache: false});';
        HTML::$js[] = 'var '.$name.'_obj = new EJS({url:"'.$fname.'?'.strval(filemtime($fname)).'"});';
//        HTML::$js[] = 'var '.$name.'_obj = new EJS({uri:"'.$fname.'"});';
        HTML::$js[] = "var $name = ${name}_obj.render.bind(${name}_obj);";
    }
    public static function twig_js_template_file($name) {
        if (!HTML::$twig_js_initialized) {
            HTML::$twig_js_initialized = true;
            HTML::$js[] = "Twig.getGlobals()['ROOT']=''; "
            ;
        }
        $fname = ROOT.'templates/twig_js/'.$name.'.js';
        HTML::include_js(ROOT.'js/twig.js');
        HTML::include_js($fname);
        HTML::$js[] = "tpl_$name=function(a){return Twig.render(__twig_tpl_$name,a);};";
    }
    public static function include_js($fname,$charset=true) {
        HTML::$js_files[$fname] = $charset;
    }
    
    public static function include_css($fname) {
        HTML::$css_files[$fname] = true;
    }
    
    public static function include_jquery() {
        HTML::include_js(ROOT.'js/jquery-1.9.1.min.js');
        HTML::include_js(ROOT.'js/jquery-migrate-1.1.0.min.js');
    }
    
    public static function include_jquery_ui() {
        HTML::include_js(ROOT.'js/jquery-ui-1.10.1.custom.min.js');
        HTML::include_js(ROOT.'js/jquery.ui.datepicker-ru.js');
        HTML::include_css(ROOT.'css/smoothness_new/jquery-ui.css');
    }

    public static function fill_placeholder($name,$content) {
        if (!isset(HTML::$placeholders[$name])) 
            HTML::$placeholders[$name] = array($content);
        else 
            HTML::$placeholders[$name][] = $content;
    }

    public static function placeholder($name) {
        if (!isset(HTML::$placeholders[$name])) 
            return;
        foreach (HTML::$placeholders[$name] as $ph) 
            echo $ph;
    }
    
    public static function error($errid) {
        HTML::$error_calls++;
        if (HTML::$error_calls>5) 
            return; // to prevent recursion
        
        if (HTML::$output_started) {
            echo Errors::get($errid);
            return;//exit(0);
        }
        if (HTML::$flush_started) {
            HTML::fill_placeholder('errors','<b>Error: '.Errors::get($errid).'</b><br/>');
            return;
        }
        HTML::add_error($errid);
        HTML::header();
        HTML::footer();
        HTML::flush();
        exit(0);
    }

    public static function error_box($error) {
        echo '<dl class="error"><dt>Ошибка</dt><dd>', $error, '</dd></dl>';
    }
    
    public static function info_box($info) {
        echo '<dl class="ginfo"><dt>Инфо</dt><dd>', $info, '</dd></dl>';
    }

    public static function footer() {
        HTML::template('footer');
    }

    public static function twig_init($options = array()) {
        if (HTML::$twig !== null) return;
        require_once ROOT.'Twig/Autoloader.php';
        Twig_Autoloader::register();
        $loader = new Twig_Loader_Filesystem(ROOT.'twig_tpl');
        HTML::$twig = new Twig_Environment($loader, array_merge(array(
            'debug' => 'true',
            'cache' => TWIG_PHP_TPL_DIR, //ROOT . 'twig_cache',
            'autoescape' => false
        ), $options));
        HTML::$twig->addGlobal('ROOT', ROOT);
        HTML::$twig->addFilter('get_course_name', new Twig_Filter_Function('get_course_name'));
        HTML::$twig->addFilter('get_testing_time', new Twig_Filter_Function('get_testing_time'));
        HTML::$twig->addFilter('get_testing_length', new Twig_Filter_Function('get_testing_length'));
        HTML::$twig->addFilter('print_typed_val', new Twig_Filter_Function('print_typed_val'));
        HTML::$twig->addFilter('print_test_types', new Twig_Filter_Function('print_test_types'));
        HTML::$twig->addFilter('protocol_date', new Twig_Filter_Function('protocol_date'));
        HTML::$twig->addFilter('get_twig_datetime', new Twig_Filter_Function('get_twig_datetime'));
        HTML::$twig->addFilter('get_twig_date', new Twig_Filter_Function('get_twig_date'));
        HTML::$twig->addExtension(new Twig_Extension_Debug());
    }

    public static function twig_template($template, $args) {
        HTML::$templates[] = array(TEMPLATE_TYPE_TWIG, $template, $args);
    }

    public static function twig_template_render($template, $args) {
        HTML::twig_init();
        echo HTML::$twig->render($template.'.twig', $args);
    }

    public static function twig_template_render_str($template, $args) {
        HTML::twig_init();
        return HTML::$twig->render($template.'.twig', $args);
    }
};

HTML::js('var ROOT="'.ROOT.'";');
?>
