<?php
// capitalize first letter
function my_mb_ucfirst($str) {
    $str = trim($str);
    $fc = mb_strtoupper(mb_substr($str, 0, 1));
    return $fc . mb_substr($str, 1);
}


function str_putcsv($input, $delimiter = ',', $enclosure = '"')
{
    // Open a memory "file" for read/write...
    $fp = fopen('php://temp', 'r+');
    // ... write the $input array to the "file" using fputcsv()...
//    print_r($input);
    fputcsv($fp, $input, $delimiter, $enclosure);
    // get file size
    $filesize = ftell($fp);
    // ... rewind the "file" so we can read what we just wrote...
    rewind($fp);
    // ... read the entire line into a variable...
    $data = fread($fp, $filesize);
    // ... close the "file"...
    fclose($fp);
    // ... and return the $data to the caller, with the trailing newline from fgets() removed.
    $data = rtrim($data, "\n");
    
    str_replace("\"\"", "\"", $data);
    
    return $data;
}

function DativeCase($SurName, $Name, $MiddleName)
{
    $SurName = trim($SurName);
    $Name = trim($Name);
    $MiddleName = trim($MiddleName);
    
    if (!empty($SurName) && !empty($Name) && !empty($MiddleName))
    {
        # Получаем пол человека:
        if (substr($MiddleName, -2) == 'ч')
        {
            # Склонение фамилии мужчины:
            switch (substr($SurName, -4))
            {
                case 'ха':
                    $SurName = substr($SurName, 0, -4).'хе';
                    break;
                
                default:
                    switch (substr($SurName, -2))
                    {
                        case 'е': case 'о': case 'и': case 'я': case 'а':
                            break;
                        
                        case 'й':
                            $SurName = substr($SurName, 0, -4).'ому';
                            break;
                        
                        case 'ь':
                            $SurName = substr($SurName, 0, -2).'и';
                            break;
                        
                        default:
                            $SurName = $SurName.'у';
                            break;
                    }
                    break;
            }
            
            # Склонение мужского имени:
            switch (substr($Name, -2))
            {
                case 'л':
                    If (substr($Name, -4, 2) == 'е')
                        $Name = substr($Name, 0, -4).'лу';
                    else
                        $Name = substr($Name, 0, -2).'лу';
                    break;
                
                case 'а': case 'я':
                    If (substr($Name, -4, 2) == 'и')
                        $Name = substr($Name, 0, -2).'и';
                    else
                        $Name = substr($Name, 0, -2).'е';
                    break;
                
                case 'й': case 'ь':
                    $Name = substr($Name, 0, -2).'ю';
                    break;
                
                case 'в':
                    If (substr($Name, -4, 2) == 'е')
                        $Name = substr($Name, 0, -4).'ьву'; // Лев - Льву
                    else
                        $Name = $Name.'у';
                    break;
                        
                default:
                    $Name = $Name.'у';
                    break;
            }
            
            # Склонение отчества
            $MiddleName = $MiddleName.'у';
            
        }
        else
        {
            # Склоенение женской фамилии
            switch (substr($SurName, -2))
            {
                case 'о': case 'и': case 'б': case 'в': case 'г': 
                case 'д': case 'ж': case 'з': case 'к': case 'л': 
                case 'м': case 'н': case 'п': case 'р': case 'с': 
                case 'т': case 'ф': case 'х': case 'ц': case 'ч': 
                case 'ш': case 'щ': case 'ь':
                    break;
                
                case 'я':
                    $SurName = substr($SurName, 0, -4).'ой';
                    break;
                
                default:
                    $SurName = substr($SurName, 0, -2).'ой';
                    break;
            }
            
            # Склонение женского имени:
            switch (substr($Name, -2))
            {
                case 'а': case 'я':
                    If (substr($Name, -4, 2) == 'и')
                    {
                        $Name = substr($Name, 0, -2).'и';
                    }
                    else
                    {
                        $Name = substr($Name, 0, -2).'е';
                    }
                    break;
                
                case 'ь':
                    $Name = substr($Name, 0, -2).'и';
                    break;
            }
            
            # Склонение женского отчества
            $MiddleName = substr($MiddleName, 0, -2).'е';
            
        }
        
        return array($SurName, $Name, $MiddleName);
    }
}

function resample_image( $src, $w_src, $h_src, $dest_w, $dest_h ) {
    // ratio
    $t_ratio = ($w_src > $h_src ? $w_src / $dest_w : $h_src / $dest_h);
   
    // calc destination width and height
    $w_dest_t = floor($w_src / $t_ratio);
    $h_dest_t = floor($h_src / $t_ratio);
   
    // create image and fill white
    $dest_t = imagecreatetruecolor($dest_w, $dest_h);
    $white = imagecolorallocate($dest_t, 255, 255, 255);
    imagefill($dest_t, 0, 0, $white);
   
    // copy and resample source image to dest and place it centered
    if( imagecopyresampled($dest_t, $src,
                            ($w_src > $h_src ? 0 : floor(($dest_w - $w_dest_t)/2.0)),
                            ($w_src > $h_src ? floor(($dest_h - $h_dest_t)/2.0) : 0),
                            0, 0,
                            $w_dest_t, $h_dest_t,
                            $w_src, $h_src) == false )
        return -1000;
   
    // get image content
    ob_start();
    imagejpeg($dest_t, NULL, 100);  // best quality
    $dest_img = ob_get_contents();
    ob_end_clean();
   
    // destroy image
    imagedestroy($dest_t);
   
    return $dest_img;
}

function tak4_format_date($q, $style = 0) {
// 01234567890123456789012345
// 2011-08-17 20:58:03.857691
    if( $q == null || $q == '' )
        return '';
    if( $style == 1 ) {
        date_default_timezone_set('Europe/Moscow');
        $d = DateTime::createFromFormat("Y-m-d", $q);
        return $d->format('d.m.Y');
//        return substr($q,8,2) . "." . substr($q, 5, 2) . "." + substr($q,0,4);
    } elseif( $style == 2 ) {
        return substr($q,11,8);
    }
    return substr($q,8,2) . "." . substr($q, 5, 2) . "." . substr($q,0,4)
        . " " . substr($q,11,8);
}

function protocol_date($q) {
    $monthes = array(1 => 'Января', 2 => 'Февраля', 3 => 'Марта', 4 => 'Апреля',
        5 => 'Мая', 6 => 'Июня', 7 => 'Июля', 8 => 'Августа',
        9 => 'Сентября', 10 => 'Октября', 11 => 'Ноября', 12 => 'Декабря');

// 01234567890123456789012345
// 2011-08-17 20:58:03.857691
    $d = DateTime::createFromFormat("Y-m-d", $q);

    return date('d ', $d->getTimestamp()) . $monthes[(date('n', $d->getTimestamp()))] . date(' Y', $d->getTimestamp());
    //return strftime("%d %B %Y", $d->getTimestamp()); //$d->format('d F Y');
}

function get_testing_time( $q ) {
    return tak4_format_date($q, 2);
}

function get_testing_length( $q ) {
// 01234567890123456789012345
// 20:58:03.857691
    return substr($q, 3, 5);
}

function get_twig_datetime( $q ) {
    return tak4_format_date($q, 0);
}

function get_twig_date( $q ) {
    return tak4_format_date($q, 1);
}

function get_course_name($course) {
    $n = explode(' ', $course);
    return $n[0];
}

function print_typed_val( $val ) {
    if( $val == 'open' )             return 'открыто';
    else if( $val == 'closed' )      return 'закрыто';
    else if( $val == 'new' )         return 'открыто';
    else if( $val == 'register' )    return 'регистрация';
    //'absence', 'presence', 'testing', 'examiner', 'closed', 'transfer'
    else if( $val == 'initial' )     return 'незарег';
    else if( $val == 'registered' )  return 'зарег';
    else if( $val == 'absence' )     return 'неявка';
    else if( $val == 'presence' )    return 'явка';
    else if( $val == 'testing' )     return 'тест';
    else if( $val == 'examiner' )    return 'экзамен';
    else if( $val == 'transfer' )    return 'перенос';
    return 'неизв.';
}

function print_test_types( $value ) {
    if( $value=="initial" )
        return 'Первичная';
    else if( $value=="periodical" )
        return 'Периодическая';
    else
        return 'Внеочередная';
}

function parse_comm_member(&$r, $split_name = false, $parse_record = true) {
    if( $parse_record )
        $r = DB::parse_record($r);
    if( $r[0] == null || strlen($r[0]) == 0 ) {
        $r = null;
        return;
    }
    if( $split_name )
        $r[1] = preg_split("/[\s.]+/", $r[1]);
}

function parse_commission( &$r, $split_name = false ) {
    parse_comm_member($r[1], $split_name);
    parse_comm_member($r[2], $split_name);
    parse_comm_member($r[3], $split_name);
    parse_comm_member($r[4], $split_name);
    return;
/*    $r[1] = DB::parse_record($r[1]);
    if( $r[1][0] == null || strlen($r[1][0]) == 0 )
        $r[1] = null;
    $r[2] = DB::parse_record($r[2]);
    if( $r[2][0] == null || strlen($r[2][0]) == 0 )
        $r[2] = null;
    $r[3] = DB::parse_record($r[3]);
    if( $r[3][0] == null || strlen($r[3][0]) == 0 )
        $r[3] = null;
    $r[4] = DB::parse_record($r[4]);
    if( $r[4][0] == null || strlen($r[4][0]) == 0 )
        $r[4] = null;*/
}

function GetNodeValue( $root, $nodeName )
{
    $node = $root->getElementsByTagName( $nodeName );

    if( $node->length < 1 )
        return null;

    // if node found - get its value
    $res = trim($node->item(0)->nodeValue, "\t ");

    return $res;
}

function str_to_dbdate($str)
{
    list($day, $month, $year) = preg_split('/\./', $str);
    return $year . '-' . $month . '-' . $day;
}
?>