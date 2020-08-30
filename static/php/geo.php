<?php

class GeoJson
{
    public static function getGeoJson($country){
        // country must be ISO_A2
        // get geojson from file
        $rawGeoJson = file_get_contents("../libs/geojson/ne_110m_admin_0_countries.geojson");
        $geoJson = json_decode($rawGeoJson);

        foreach($geoJson->features as $feature){
            if ($feature->properties->ISO_A2 == $country){
                $output = $feature;
            break;
            }
        }

        return $output;
    }
}

?>