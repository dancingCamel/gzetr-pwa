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
            $result = $conn->query("SELECT * FROM countries WHERE name='$country'");
        }

        // output data of row
        $output = [];
        if ($result->num_rows > 0) { 
            while($row = $result->fetch_assoc()) {
                $temp = [];
                $temp['id'] = $row['id'];
                $temp['name'] = $row['name'];
                $temp['alpha2']=$row['alpha2'];
                $temp['data'] = $row['data'];
                $temp['expiry'] = $row['expiry'];
                array_push($output, $temp);
            }
        } 

        return $output;
    }

    public function insertCountry($country, $alpha, $dataStr, $climateData = true){
        if ( empty( $country ) || empty( $alpha ) || empty($dataStr)) {
            return "Missing parameters";
        }

        if (sizeof($this->selectCountry($country)) > 0){
            return "Country already exists";
        }

        $conn = $this->connect();

         // create expiry date
         $current_timestamp = time();
         // check to see if got climate data
         if ($climateData){
             // add one month
             $expiry = $current_timestamp + 2628000;
         } else {
             // add one day
             $expiry = $current_timestamp + 86400;
         }

        // form sql query - not escaping string as created by own server
        $sql = "INSERT INTO countries (name, alpha2, data, expiry) VALUES ('$country', '$alpha', '$dataStr', $expiry);";

        if ($conn->query($sql) === TRUE) {
        return "New record created successfully";
        } else {
        return "Error: " . $sql . "<br>" . $conn->error;
        }
    }

    // TODO:
    // this is complicated update function. need to replace with one with fixed table, where etc. should only pass county, alpha2 and json
    // use insert into where sql
    public function update($table, $data, $format, $where, $where_format) {
        // Check for $table or $data not set
        if ( empty( $table ) || empty( $data ) ) {
            return false;
        }
        
        // Connect to the database
        $db = $this->connect();
        
        // Cast $data and $format to arrays
        $data = (array) $data;
        $format = (array) $format;
        
        // Build format array
        $format = implode('', $format); 
        $format = str_replace('%', '', $format);
        $where_format = implode('', $where_format); 
        $where_format = str_replace('%', '', $where_format);
        $format .= $where_format;
        
        list( $fields, $placeholders, $values ) = $this->prep_query($data, 'update');
        
        //Format where clause
        $where_clause = '';
        $where_values = '';
        $count = 0;
        
        foreach ( $where as $field => $value ) {
            if ( $count > 0 ) {
                $where_clause .= ' AND ';
            }
            
            $where_clause .= $field . '=?';
            $where_values[] = $value;
            
            $count++;
        }

        // Prepend $format onto $values
        array_unshift($values, $format);
        $values = array_merge($values, $where_values);

        // Prepary our query for binding
        $stmt = $db->prepare("UPDATE {$table} SET {$placeholders} WHERE {$where_clause}");
        
        // Dynamically bind values
        call_user_func_array( array( $stmt, 'bind_param'), $this->ref_values($values));
        
        // Execute the query
        $stmt->execute();
        
        // Check for successful insertion
        if ( $stmt->affected_rows ) {
            return true;
        }
        
        return false;
    }
}
?> 