<?php

$workouts = array();

$workout_dir = './workouts';
$handle = opendir($workout_dir);

while (false !== ($file = readdir($handle))){
  $extension = strtolower(substr(strrchr($file, '.'), 1));
  if ($extension == 'json') {
    $w = json_decode(file_get_contents($workout_dir . '/' . $file));

    $string = explode('.json', $file);
    $id = strtolower(trim(preg_replace('~[^0-9a-z]+~i', '-', html_entity_decode(preg_replace('~&([a-z]{1,2})(?:acute|cedil|circ|grave|lig|orn|ring|slash|th|tilde|uml);~i', '$1', htmlentities($string[0], ENT_QUOTES, 'UTF-8')), ENT_QUOTES, 'UTF-8')), '-'));
    $workouts[$id] = $w;
  } 
}

echo json_encode($workouts);

?>