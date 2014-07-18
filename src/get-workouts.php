<?php

$workouts = array();

$workout_dir = './workouts';

// var_dump(count(glob($workout_dir . '/*')));

if (!file_exists($workout_dir)) :
  // echo 'The directory doesn\'t exist.';
  die('There is no "workouts" directory.');
elseif (count(glob($workout_dir . '/*')) === 0):
  // echo 'There are no files in the directory.';
  die('There are no files in the "workouts" directory.');
else :
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

  echo json_encode($workouts);
endif;

?>