<?php

    class RestCountries 
    {
        public static function findByAlpha2($alpha2){
            $base_url = "https://restcountries.eu/rest/v2/alpha/";
            $query = $base_url . $alpha2;
            $ch = curl_init();
            $options = [
                CURLOPT_URL => $query,
                CURLOPT_RETURNTRANSFER => 1,
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_SSL_VERIFYHOST => false
            ];
            curl_setopt_array($ch, $options);

            $ret = curl_exec($ch);

            curl_close($ch);

            return $ret;
        }

        public static function findByName($name){
            $base_url = "https://restcountries.eu/rest/v2/name/";
            $query = $base_url . $name . "?fullText=true";
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