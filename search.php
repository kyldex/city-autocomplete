<?php
if (isset($_GET['input'])) {
    // Get data
    $data = file_get_contents('./data/towns.txt');
    // Creates an array from data
    $array_data = unserialize($data);
    sort($array_data);
    $array_length = count($array_data);
    // New array to push results
    $new_array_results = array();
    // htmlspecialchars as a precaution, but user inputs won't be displayed when returning the request to the client
    $string_to_find = htmlspecialchars($_GET['input']);

    // Max 20 results
    for($i = 0; $i < $array_length && count($new_array_results) < 20; $i++) {

        $has_string = stripos($array_data[$i], $string_to_find);
                
        // String has been found and $array_data[$i] starts with the same characters
        if ($has_string === 0) {
            array_push($new_array_results, $array_data[$i]);
        }
    }

    // Creates a string to send to the client (city1|city2|city3 etc.)
    $raw_text_to_send = implode('|', $new_array_results);

    echo $raw_text_to_send;
}
