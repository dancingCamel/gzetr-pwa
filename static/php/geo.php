<?php

class GeoJson
{
    public static function getGeoJson($country){
        // get geojson from file
        $rawGeoJson = file_get_contents("../libs/geojson/ne_110m_admin_0_countries.geojson");
        $geoJson = json_decode($rawGeoJson);

        foreach($geoJson->features as $feature){
            if ($feature->properties->ADM0_A3_IS == $country){
                $output = $feature;
            break;
            } else {
                $output = "No Data";
            }
        }

        return $output;
    }
}

?>