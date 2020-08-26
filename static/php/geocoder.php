<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	include('../libs/OpenCage/AbstractGeocoder.php');
	include('../libs/OpenCage/Geocoder.php');
	include('env.php');

	class Geolocation{
		public static function getCountryByName($name){
			$key = getenv ( 'OPENCAGE_APIKEY', $local_only = TRUE );
			// Change this to own api key. saved in env vars
			$geocoder = new \OpenCage\Geocoder\Geocoder($key);

			$result = $geocoder->geocode($name,['language'=>"en"]);

			if (in_array($result['status']['code'], [401,402,403,429])){
				$output['status']['code'] = $result['status']['code'];
				$output['status']['name'] = "error";
				$output['message'] = $result['status']['message'];
				
				return json_encode($output, JSON_UNESCAPED_UNICODE);
			}

			$searchResult = [];

			// put formatting in main script;
			// $entry = $result['results'][0];

			// $searchResult['formatted'] = $entry['formatted'];
			// $searchResult['geometry']['lat'] = $entry['geometry']['lat'];
			// $searchResult['geometry']['lng'] = $entry['geometry']['lng'];
			// $searchResult['currency']['code'] = $entry['annotations']['currency']['iso_code'];
			// $searchResult['currency']['name'] = $entry['annotations']['currency']['name'];
			// $searchResult['currency']['symbol'] = $entry['annotations']['currency']['symbol'];

			return json_encode($result['results'][0], JSON_UNESCAPED_UNICODE);
		}
	}

?>
