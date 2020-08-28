<?php

    class Factbook
    {
        public static function getDataByCountry($country)
        {
            // get factbook data from file
            $factbookStr = file_get_contents("../libs/factbook/cia_world_factbook_api/data/factbook.json");
            $factbookJson = json_decode($factbookStr);

            if ($factbookJson){
                // return the country
                $country = strtolower($country);
                $country = str_replace(" ", "_", $country);
                try {
                    $ret = $factbookJson->countries->$country->data;
                }
                catch (exception $e){
                    $ret['status'] = 404;
                    $ret['message'] = "Country not found. $e";
                }
                
                return $ret;
            }
            
            $ret['status'] = 500;
            $ret['message'] = "Something went wrong opening the json file.";
            return $ret;
        }
    }


?> 