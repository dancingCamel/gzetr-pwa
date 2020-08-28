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

        public static function formatRcData($data){
            // rest_countries : flag, capital, area, population, languages, tld, calling code, timezones
            $output['name'] = $data['name'];
            $output['flag'] = $data['flag'];
            $output['capital'] = $data['capital'];
            $output['area'] = $data['area'];
            $output['population'] = $data['population'];
            $output['languages'] = $data['languages'];
            $output['tld'] = $data['topLevelDomain'];
            $output['callingCodes'] = $data['callingCodes'];
            $output['timezones'] = $data['timezones'];

            return $output;
        }
    }

?>