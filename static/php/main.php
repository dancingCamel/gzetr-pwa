<?php

    // enable error reporting. 
    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    include('restcountries.php');
    include('geocoder.php');
    include('climatedata.php');

    // accept country as parameter from request and save as variable
    $country = $_REQUEST['country'];

    // if less than 4 letters, search with rest country alpha 2 static method. else full name search
    if (strlen($country) < 4){
        $rc_result = RestCountries::findByAlpha2($country);
        $rc_decode = json_decode($rc_result,true);
        $output = handleErrorIfExists($rc_decode);
        if ($output){
            goto end;
        }
    } else {
        $rc_result = RestCountries::findByName($country);
        $rc_decode = json_decode($rc_result,true);
        $output = handleErrorIfExists($rc_decode);
        if ($output){
            goto end;
        }
        $rc_decode = $rc_decode[0];
    }


    // use rest country to search opencage static method
    $oc_result = Geolocation::getCountryByName($rc_decode['name']);
    $oc_decode = json_decode($oc_result,true);
    $output = handleErrorIfExists($oc_decode);
    if ($output){
        goto end;
    }

    // use rest country to search climate data api static method
    $climate_result = ClimateData::getClimateData($oc_decode['geometry']['lat'], $oc_decode['geometry']['lng']);
    $climate_decode = json_decode($climate_result,true);
    $output = handleErrorIfExists($climate_decode);
    if ($output){
        goto end;
    }
    
    // use opencage country name response to search factbook static method

    // echo response to user

    // if error (not status 200) at any point, use goto and jump to return echo
    // only have one header and echo bit of code

    // do all formatting here
    // rest_countries : flag, capital, area, population, languages, tld, calling code, timezones
    // factbook : noun, demonym (adj), gdp, gdp/capita, background, climate overview, historical gdp, 
    //            historical gdp/capita, gdp growth, unemployment, import , expoert, inflation, economic overview, 
    //            literacy, years in school, edu expenditure, religion, ethnicity, age histogram , median age, 
    //            population growth, fertility rate, highest point, lowerst point, natural resources, natural hazards, 
    //            child mortality, clean water, life expectancy, death rate
    // Opencage : currency
    // status, code, message

    // raw outputs for development
    $output['rc'] = $rc_decode;
    $output['oc'] = $oc_decode;
    $output['clim'] = $climate_decode;


    end:
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($output, JSON_UNESCAPED_UNICODE); 
    
    function handleErrorIfExists($object){
        if (array_key_exists('status', $object)){
            $output['status']['code'] = $object['status'];
            $output['status']['name'] = "error";
            $output['message'] = $object['message'];
            return $output;
        } else if (array_key_exists('errorCode', $object)){
            $output['status']['code'] = $object['errorCode'];
            $output['status']['name'] = "error";
            $output['message'] = $object['message'];
            return $output;
        }
        return false;
        
    }
?>