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
                        // this can't find jamaica for some reason
                        if (property_exists($factbookJson->countries, $country)){
                            $ret = $factbookJson->countries->$country->data;
                        }else {
                            $ret['status'] = 404;
                            $ret['message'] = "Country not found. Doesn't Exist in Factbook";
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
            $output['background'] = checkExists($data->introduction,'background');
            $output['noun'] = checkExists($data->people->nationality,'noun');
            $output['adj'] = checkExists($data->people->nationality,'adjective');

            // economy
            $output['gdpLatest'] = checkExists($data->economy->gdp->purchasing_power_parity->annual_values[0],'value');
            $output['gdp'] = checkExists($data->economy->gdp->purchasing_power_parity,'annual_values');
            $output['capitaLatest'] = checkExists($data->economy->gdp->per_capita_purchasing_power_parity->annual_values[0],'value');
            $output['capita'] = checkExists($data->economy->gdp->per_capita_purchasing_power_parity, 'annual_values');
            $output['growth'] = checkExists($data->economy->gdp->real_growth_rate,'annual_values')[0];
            $output['unemployment'] = checkExists($data->economy->unemployment_rate,'annual_values')[0];
            $output['inflation'] = checkExists($data->economy->inflation_rate,'annual_values')[0];
            $output['exports'] = checkExists($data->economy->exports->total_value,'annual_values')[0];
            $output['imports'] = checkExists($data->economy->imports->total_value,'annual_values')[0];
            $output['econOverview'] = checkExists($data->economy,'overview');

            // demographics
            $output['ethnicity'] = checkExists($data->people->ethnic_groups,'ethnicity');
            $output['languages'] = checkExists($data->people->languages,'language');
            $output['religions'] = checkExists($data->people->religions,'religion');
            $output['ages'] = checkExists($data->people,'age_structure');
            $output['popGrowth'] = checkExists($data->people,'population_growth_rate');
            $output['birthRate'] = checkExists($data->people,'birth_rate');
            $output['deathRate'] = checkExists($data->people,'death_rate');
            $output['infantMortality'] = checkExists($data->people->infant_mortality_rate,'total');
            $output['lifeExpectancy'] = checkExists($data->people->life_expectancy_at_birth,'total_population');
            $output['fertility'] = checkExists($data->people,'total_fertility_rate');

            // health
            $output['cleanWater'] = checkExists(checkExists(checkExists($data->people,'drinking_water_source'),'improved'),'total');
            $output['sanitation'] = checkExists(checkExists(checkExists($data->people,'sanitation_facility_access'),'improved'),'total');
            $output['hiv'] = checkExists(checkExists($data->people,'hiv_aids'),'adult_prevalence_rate');
            $output['obesity'] = checkExists($data->people,'adult_obesity');

            // education
            $output['eduExpenditure']= checkExists($data->people,'education_expenditures');
            $output['eduExpenditure']= checkExists($data->people, 'education_expenditures');
            $output['literacy'] = checkExists(checkExists($data->people,'literacy'),'total_population');
            $output['yearsInSchool'] = checkExists(checkExists($data->people,'school_life_expectancy'),'total');

            // geography
            $output['highestPoint'] = checkExists($data->geography->elevation,'highest_point');
            $output['lowestPoint'] = checkExists($data->geography->elevation,'lowest_point');
            $output['naturalResources'] = checkExists($data->geography->natural_resources,'resources');
            $output['naturalHazards'] = checkExists($data->geography,'natural_hazards');
            $output['climateOverview'] = checkExists($data->geography,'climate');

            return $output;
        }
    }

    // helper functions
    function checkExists($parent, $element){
        if (property_exists($parent, $element)){
            return $parent->$element;
        }
        return "No Data";
    }
?> 