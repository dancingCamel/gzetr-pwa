<?php

    // enable error reporting. 
    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    include('restcountries.php');
    include('geocoder.php');
    include('climatedata.php');
    include('factbook.php');
    include('geo.php');

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
    // TODO: if search for Iran climate (ir) can't find weather stations.
    // Need to tell users that climate data is not available somehow
    // $climate_result = ClimateData::getClimateData($oc_decode['geometry']['lat'], $oc_decode['geometry']['lng']);
    // $climate_decode = json_decode($climate_result,true);
    // $output = handleErrorIfExists($climate_decode);
    // // maybe use goto keyword and jump to point after formatting climate data?
    // if ($output){
    //     goto end;
    // }

    // use opencage country name response to search factbook static method
    $fb_decode = Factbook::getDataByCountry($oc_decode['components']['country']);
    $output = handleErrorIfExists($fb_decode);
    if ($output){
        goto end;
    }

    $gj_decode = GeoJson::getGeoJson($oc_decode['components']['country']);
    
    // $output['clim'] = ClimateData::formatClimateData($climate_decode);
    $output['rc'] = RestCountries::formatRcData($rc_decode);
    $output['oc'] = Geolocation::formatOcData($oc_decode);
    $output['fb'] = Factbook::formatFbData($fb_decode);
    
    $output['geo'] = $gj_decode;

    $output['status']['code'] = 200;
    $output['status']['name'] = "success";


    end:
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($output, JSON_UNESCAPED_UNICODE); 
    

    // helper functions
    function handleErrorIfExists($data){
        if (is_array($data)){
            if (array_key_exists('status', $data)){
                
                $output['message'] = $data['message'];
                return $output;
            } else if (array_key_exists('errorCode', $data)){
                $output['status']['code'] = $data['errorCode'];
                $output['status']['name'] = "error";
                $output['message'] = $data['message'];
                return $output;
            }
        } 

        if (gettype($data) == "object"){
            if (property_exists($data, 'status')){
                $output['status']['code'] = $data['status'];
                $output['status']['name'] = "error";
                $output['message'] = $data['message'];
                return $output;
            } 
        }

        return false;
        
    }
?>