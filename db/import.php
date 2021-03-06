<?php

define('ADMIN_USER_ID', '1');

define('ROOT','../www/');
require(ROOT.'classes/init.php');
require(ROOT.'classes/html.php');
require(ROOT.'classes/helpers.php');

function csv_to_array($filename='', $delimiter=',')
{
    if(!file_exists($filename) || !is_readable($filename))
        return FALSE;

    $header = NULL;
    $data = array();
    if (($handle = fopen($filename, 'r')) !== FALSE)
    {
        while (($row = fgetcsv($handle, 1000, $delimiter)) !== FALSE)
            $data[] = $row;
        fclose($handle);
    }

    //print_r($data);
    return $data;
}

function get_pupil_data_1($p) {
    $res = array(
        'surname'   => $p[0],
        'name'      => $p[1],
        'middle'    => $p[2],
        'bday'      => $p[3],
        'partic_year'   => '',
        'form'      => '',
        'position'  => null,
        'card'      => ''
    );
    if (isset($p[4]))
        $res = array_merge($res, array(
            'partic_year' => $p[4],
            'form'      => $p[5]
        ));
    if (isset($p[6]))
        $res = array_merge($res, array(
            'position' => $p[6],
            'card'     => $p[7]
        ));
    return $res;
}


/*******************************************
 * Main script starts here
 */
if (sizeof($argv) < 3) {
    echo  "USAGE: php import.php FILE_NAME.csv 'GROUP_NAME' 'GROUP_NAME' ...\n"
        . "       FILE_NAME  - file name of csv file with childs in format of \n"
        . "                    https://www.schoolconnect.ru/classadmin/students.aspx\n"
        . "                    export to Excel\n"
        . "       GROUP_NAME - name of group to import to if exists\n" ;
    exit(0);
}

$file_name = $argv[1];
$group_names = array_slice($argv, 2);

echo "\n\nImporting $file_name file\n";
// parse csv to array
$data = csv_to_array($file_name);

// columns are as followed:
// #	ФИО	Номер личного дела	Экстерном	Дата рождения	Адрес	Домашний телефон	ФИО отца	Телефон отца	ФИО матери	Телефон матери

// check groups with given name exists
$group_ids = array();
foreach ($group_names as $group_name) {
    $groups = $db->groups_get(ADMIN_USER_ID, null, $group_name);

    $group = null;
    // due to that groups_get returns all groups by substring we should check all returned groups for its name
    foreach ($groups as $gr)
        if ($gr[1] == $group_name)
            $group = $gr;

    // if group still not found - add it
    if ($group === null) {
        $group_id = $db->group_add(ADMIN_USER_ID, $group_name);
        if ($group_id < 0) {
            echo "Ошибка " . $group_id . ": " . Errors::get($group_id);
            exit(0);
        }
    } else
        $group_id = $group[0];

    $group_ids[] = $group_id;
}

$skip_rows = 0; // skip 2 first rows in csv file
// pass through users from file and put them into database
foreach ($data as $person) {
    if ($skip_rows > 0){
        $skip_rows--;
        continue;
    }

    $pp = get_pupil_data_1($person);

/*$user_id, $card, $surname, $name, $middle,
$pic_name, $bday, $reg_form, $group_ids*/
    $person_id = $db->user_add(ADMIN_USER_ID, $pp['card'], $pp['surname'], $pp['name'], $pp['middle'],
        null, str_to_dbdate($pp['bday']), $group_names[0], $group_ids, $pp['position']);
    if ($person_id < 0) {
        echo "Ошибка " . $person_id . " (" . $pp['surname'] . "): " . Errors::get($person_id) . "\n";
        continue;
    }
    echo $pp['surname'] . " добавлен с идентификатором " . $person_id . "\n";
}
