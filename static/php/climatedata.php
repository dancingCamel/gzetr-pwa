<?php
class ClimateData
    {
        public static function getClimateData($lat,$long){
        // public static function getClimateData($city){
            $ch = curl_init();
            $key = getenv ( 'VISCROSS_APIKEY', $local_only = TRUE );
            $url = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/historysummary?aggregateHours=24&combinationMethod=aggregate&collectStationContributions=false&maxStations=3&maxDistance=-1&minYear=2017&maxYear=2019&chronoUnit=months&breakBy=years&dailySummaries=false&contentType=json&unitGroup=uk&locationMode=single&key=$key&locations=$lat%2C%20$long";
            // get the lat and log of capital city, then pass to this funciton
            // $url = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/historysummary?aggregateHours=24&combinationMethod=aggregate&collectStationContributions=false&maxStations=3&maxDistance=-1&minYear=2017&maxYear=2019&chronoUnit=months&breakBy=years&dailySummaries=false&contentType=json&unitGroup=uk&locationMode=single&key=$key&locations=$city";
            curl_setopt_array($ch, array(
                CURLOPT_URL => $url,
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_CUSTOMREQUEST => "GET",
                CURLOPT_RETURNTRANSFER => 1,
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_SSL_VERIFYHOST => false
            ));

            $ret = curl_exec($ch);
            $err = curl_error($ch);

            curl_close($ch);

            if ($err) {
                return $err;
            } else {
                return $ret;
            }
        }

        public static function formatClimateData($raw){
            
            if ($raw == null){
                $output = "No Data";
                return $output;
            }

            if (array_key_exists('errorCode', $raw)){
                $output = "No Data";
                return $output;
            }
            
            $months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

            foreach($months as $month){
                ${$month} = array('precip'=>[], 'temp'=>[]);
            }

            foreach($raw['location']['values'] as $value){
                $monthArray = explode(" ", $value['period']);
                $month = strtolower($monthArray[0]);
                
                array_push(${$month}['precip'], $value['precip']);
                array_push(${$month}['temp'], $value['temp']);
            }

            foreach($months as $month){
                // average precip
                ${$month}['precip'] = array_filter(${$month}['precip']);
                if(count(${$month}['precip'])) {
                    ${$month}['precip'] = array_sum(${$month}['precip'])/count(${$month}['precip']);
                }
                // average temp
                ${$month}['temp'] = array_filter(${$month}['temp']);
                if(count(${$month}['temp'])) {
                    ${$month}['temp'] = array_sum(${$month}['temp'])/count(${$month}['temp']);
                }
            }

            $output['january'] = $jan;
            $output['february'] = $feb;
            $output['march'] = $mar;
            $output['april'] = $apr;
            $output['may'] = $may;
            $output['june'] = $jun;
            $output['july'] = $jul;
            $output['august'] = $aug;
            $output['september'] = $sep;
            $output['october'] = $oct;
            $output['november'] = $nov;
            $output['december'] = $dec;

            return $output;
        }

    }

?>