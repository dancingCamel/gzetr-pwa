<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	include('../libs/OpenCage/AbstractGeocoder.php');
	include('../libs/OpenCage/Geocoder.php');
	include('env.php');

	class Geolocation{
		public static function getDataByName($name){
			$key = getenv ( 'OPENCAGE_APIKEY', $local_only = TRUE );
			// Change this to own api key. saved in env vars
			$geocoder = new \OpenCage\Geocoder\Geocoder($key);

			$result = $geocoder->geocode($name,['language'=>"en"]);

			if (in_array($result['status']['code'], [401,402,403,429])){
				$output['code'] = $result['status']['code'];
				$output['name'] = "error";
				$output['message'] = $result['status']['message'];
				
				return json_encode($output, JSON_UNESCAPED_UNICODE);
			}

			$searchResult = [];

			try{
				if(gettype($result['results'] === 'array')){
					$output = $result['results'][0];
					// https://api.opencagedata.com/geocode/v1/json/?q=United%20States%20Minor%20Outlying%20Islands&key=5d3b9ac806534c019274987a54d31cfd
				}
				
			}
			catch (exception $e){
				$output['code'] = 500;
				$output['name'] = "error";
				$output['message'] = "Something went wrong reading the opencage data.";
			}

			return json_encode($output, JSON_UNESCAPED_UNICODE);
		}

		public static function getDataByCoords($lat, $long){
			$key = getenv ( 'OPENCAGE_APIKEY', $local_only = TRUE );
			// Change this to own api key. saved in env vars
			$geocoder = new \OpenCage\Geocoder\Geocoder($key);
			$query = $lat . "," .$long;
			$result = $geocoder->geocode($query,['language'=>"en"]);

			if (in_array($result['status']['code'], [401,402,403,429])){
				$output['code'] = $result['status']['code'];
				$output['name'] = "error";
				$output['message'] = $result['status']['message'];
				
				return json_encode($output, JSON_UNESCAPED_UNICODE);
			}

			$searchResult = [];

			try{
				if(gettype($result['results'] === 'array')){
					$output = $result['results'][0];
					// https://api.opencagedata.com/geocode/v1/json/?q=United%20States%20Minor%20Outlying%20Islands&key=5d3b9ac806534c019274987a54d31cfd
				}
				
			}
			catch (exception $e){
				$output['code'] = 500;
				$output['name'] = "error";
				$output['message'] = "Something went wrong reading the opencage data.";
			}

			return json_encode($output, JSON_UNESCAPED_UNICODE);
		}

		public static function formatOcData($data){
			// Opencage : currency
			if (array_key_exists('currency', $data['annotations'])){
				$output['currencyName'] = $data['annotations']['currency']['name'];
				$output['currencySymbol'] = $data['annotations']['currency']['symbol'];
			} else {
				$output = "No Data";
			}

			return $output;
		}
	}



?>
