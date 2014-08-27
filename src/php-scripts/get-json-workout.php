<?php

$data = json_decode(file_get_contents("php://input"));
$url = 'https://dl.dropboxusercontent.com/u/18328850/1-percent-workout.json'; //$data->jsonURL;
$url = 'http://jsongym.com/workouts/1-percent-workout.json';
$wk = json_decode(file_get_contents($url));
echo json_encode($wk);

?>