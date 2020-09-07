<?php 

    // enable error reporting. 
    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $search = $_GET['q'];
    $countriesFile = fopen("../python/countries.txt", "r") or die("Unable to open file!");
    $countriesStr = fread($countriesFile,filesize("../python/countries.txt"));
    $countriesArray = explode(";", $countriesStr);
    
    $output = [];

    foreach($countriesArray as $name){
        
        $position = stripos($name, $search);
        
        if ($position !== false ){
            array_push($output, $name);
        } 
    }

    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($output, JSON_UNESCAPED_UNICODE);
    fclose($countriesFile);
?>