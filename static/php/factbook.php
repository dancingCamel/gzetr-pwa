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
                    if (gettype($factbookJson)=="object"){
                        if (property_exists($factbookJson->countries, $country)){
                            $ret = $factbookJson->countries->$country->data;
                        }else {
                            $ret['status'] = 404;
                            $ret['message'] = "Country not found.";
                        }
                        
                    }
                    else {
                        $ret['status'] = 500;
                        $ret['message'] = "Something went wrong opening the json file.";
                    }
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

        public static function formatFbData($data){
            
            // overview
            $output['background'] = $data->introduction->background;
            $output['noun'] = $data->people->nationality->noun;
            $output['adj'] = $data->people->nationality->adjective;

            // economy
            $output['gdpLatest'] = $data->economy->gdp->purchasing_power_parity->annual_values[0]->value;
            $output['gdp'] = $data->economy->gdp->purchasing_power_parity->annual_values;
            $output['capitaLatest'] = $data->economy->gdp->per_capita_purchasing_power_parity->annual_values[0]->value;
            $output['capita'] = $data->economy->gdp->per_capita_purchasing_power_parity->annual_values;
            $output['growth'] = $data->economy->gdp->real_growth_rate->annual_values[0];
            $output['unemployment'] = $data->economy->unemployment_rate->annual_values[0];
            $output['inflation'] = $data->economy->inflation_rate->annual_values[0];
            $output['exports'] = $data->economy->exports->total_value->annual_values[0];
            $output['imports'] = $data->economy->imports->total_value->annual_values[0];
            $output['econOverview'] = $data->economy->overview;

            // demographics
            $output['ethnicity'] = $data->people->ethnic_groups->ethnicity;
            $output['languages'] = $data->people->languages->language;
            $output['religions'] = $data->people->religions->religion;
            $output['ages'] = $data->people->age_structure;
            $output['popGrowth'] = $data->people->population_growth_rate;
            $output['birthRate'] = $data->people->birth_rate;
            $output['deathRate'] = $data->people->death_rate;
            $output['infantMortality'] = $data->people->infant_mortality_rate->total;
            $output['lifeExpectancy'] = $data->people->life_expectancy_at_birth->total_population;
            $output['fertility'] = $data->people->total_fertility_rate;

            // health
            $output['cleanWater'] = $data->people->drinking_water_source->improved->total;
            $output['sanitation'] = $data->people->sanitation_facility_access->improved->total;
            // $output['hiv'] = $data->people->hiv_aids->adult_prevalence_rate;
            $output['obesity'] = $data->people->adult_obesity;

            // education
            // $output['eduExpenditure']= $data->people->education_expenditures;
            // $output['literacy'] = $data->people->literacy->total_population;
            $output['yearsInSchool'] = $data->people->school_life_expectancy->total;

            // geography
            $output['highestPoint'] = $data->geography->elevation->highest_point;
            $output['lowestPoint'] = $data->geography->elevation->lowest_point;
            $output['naturalResources'] = $data->geography->natural_resources->resources;
            $output['naturalHazards'] = $data->geography->natural_hazards;
            $output['climateOverview'] = $data->geography->climate;

            return $output;
        }
    }

    // TODO: Add function to check if the data exists. if not, omit it from data. then can add missing data

?> 