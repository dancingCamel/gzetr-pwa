<?php

class CountryDb {
    private $host = "localhost";
    private $username = "osboxes";
    private $password = "osboxes.org";
    private $database = "db";

    protected function connect() {
        return new mysqli($this->host, $this->username, $this->password, $this->database);
    }

    public function selectCountry($country){
        if ( empty( $country )) {
            return false;
        }

        $conn = $this->connect();

        if (strlen($country) < 3){
            // get alpha2
            $result = $conn->query("SELECT * FROM countries WHERE alpha2='$country'");
        } else {
            // get country
            // $result = $conn->query("SELECT * FROM countries WHERE NAME='$country'");
            $result = $conn->query("SELECT * FROM countries WHERE name='$country'");
        }

        // output data of row
        $output = [];
        if ($result->num_rows > 0) { 
            while($row = $result->fetch_assoc()) {
                $temp = [];
                $temp['id'] = $row['id'];
                // $temp['name'] = $row['NAME'];
                $temp['name'] = $row['name'];
                $temp['alpha2']=$row['alpha2'];
                // $temp['data'] = $row['DATA'];
                $temp['data'] = $row['data'];
                $temp['expiry'] = $row['expiry'];
                array_push($output, $temp);
            }
        } 


        if (count($output)===0){
            $output = "Country not found";
        } elseif (count($output) > 1){
            $output = "More than one entry has that name.";
        }

        return $output;
    }

    public function insertCountry($country, $alpha, $dataStr, $climateData = true){
        if ( empty( $country ) || empty( $alpha ) || empty($dataStr)) {
            return "Missing parameters";
        }

        if (gettype($this->selectCountry($country)) === 'array'){
            return "Country already exists";
        }

        $conn = $this->connect();

        // create expiry date
        $expiry = $this->getExpiry($climateData);

        $dataStr = $conn->real_escape_string($dataStr);

        // form sql query - not escaping string as created by own server
        // $sql = "INSERT INTO countries (NAME, alpha2, DATA, expiry) VALUES ('$country', '$alpha', '$dataStr', $expiry);";
        $sql = "INSERT INTO countries (name, alpha2, data, expiry) VALUES ('$country', '$alpha', '$dataStr', $expiry);";

        if ($conn->query($sql) === TRUE) {
        return "New record created successfully";
        } else {
        return "Error: " . $sql . "<br>" . $conn->error;
        }
    }

    public function updateCountry($country, $alpha, $dataStr, $climateData = true) {
        if ( empty( $country ) || empty( $alpha ) || empty($dataStr)) {
            return "Missing parameters";
        }

        if (sizeof($this->selectCountry($country)) === 0){
            return "Cannot update country - doesn't exist";
        }
        
        $expiry = $this->getExpiry($climateData);

        // Connect to the database
        $conn = $this->connect();

        $dataStr = $conn->real_escape_string($dataStr);
        
        // use country name
        // $sql = "UPDATE countries SET alpha2='$alpha', DATA='$dataStr', expiry='$expiry'  WHERE NAME='$country'";
        $sql = "UPDATE countries SET alpha2='$alpha', data='$dataStr', expiry='$expiry'  WHERE name='$country'";
        
        if ($conn->query($sql) === TRUE) {
            return "Record updated successfully";
        } else {
            return "Error: " . $sql . "<br>" . $conn->error;
        }
        
        return false;
    }

    function getExpiry($bool){
        // create expiry date
        $current_timestamp = time();
        // check to see if got climate data
        if ($bool){
            // add one month
            $expiry = $current_timestamp + 2628000;
         } else {
             // add one day
             $expiry = $current_timestamp + 86400;
         }
         return $expiry;
    }
}
?>