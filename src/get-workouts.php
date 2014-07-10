<?php

$workouts = array();

$workout_dir = './workouts';
$handle = opendir($workout_dir);

while (false !== ($file = readdir($handle))){
  $extension = strtolower(substr(strrchr($file, '.'), 1));
  if ($extension == 'json') {

    $w = json_decode(file_get_contents($workout_dir . '/' . $file));

    /**
     * Add the id.
     */
    $string = explode('.json', $file);
    $id = strtolower(trim(preg_replace('~[^0-9a-z]+~i', '-', html_entity_decode(preg_replace('~&([a-z]{1,2})(?:acute|cedil|circ|grave|lig|orn|ring|slash|th|tilde|uml);~i', '$1', htmlentities($string[0], ENT_QUOTES, 'UTF-8')), ENT_QUOTES, 'UTF-8')), '-'));
    $w->id = $id;

    /**
     * Add a timestamp based on modification date.
     */
    $w->timestamp = filemtime($workout_dir . '/' . $file);

    array_push($workouts, $w);
  } 
}

// echo '<pre>';
// var_dump($workouts);
// echo '</pre>';

echo json_encode($workouts);

?>