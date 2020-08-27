<?php
// NEED TO SEARCH FOR CLIMATE DATA FOR CAPITAL CITY!!!
// NEED TO FIND NEW API
// https://www.getambee.com/api/weather
// https://opendata.stackexchange.com/questions/4242/historical-weather-data
// https://weatherstack.com/documentation


    class ClimateData
    {
        public static function getTemp($country){
            $base_url = "";
            $query = $base_url . $country;
            $ch = curl_init();
            $options = [
                CURLOPT_URL => $query,
                CURLOPT_RETURNTRANSFER => 1,
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_SSL_VERIFYHOST => false
            ];
            curl_setopt_array($ch, $options);

            $ret = curl_exec($ch);

            return $ret;
        }

        public static function getPrecip($country){
            $base_url = "";
            $query = $base_url . $country;
            $ch = curl_init();
            $options = [
                CURLOPT_URL => $query,
                CURLOPT_RETURNTRANSFER => 1,
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_SSL_VERIFYHOST => false
            ];
            curl_setopt_array($ch, $options);

            $ret = curl_exec($ch);

            return $ret;
        }
    }

?>