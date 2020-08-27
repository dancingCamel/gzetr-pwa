<?php
class ClimateData
    {
        public static function getClimateData($lat,$long){
            $ch = curl_init();
            // set breakby =self?
            $key = getenv ( 'VISCROSS_APIKEY', $local_only = TRUE );
            $url = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/historysummary?aggregateHours=24&combinationMethod=aggregate&collectStationContributions=false&maxStations=3&maxDistance=-1&minYear=2016&maxYear=2020&chronoUnit=months&breakBy=years&dailySummaries=false&contentType=json&unitGroup=uk&locationMode=single&key=$key&locations=$lat%2C%20$long";
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

        public static function formatData($raw){
            $formatted;

            return $formatted;
        }

    }

?>