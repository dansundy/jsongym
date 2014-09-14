<?php

include( 'class-workout-manager.php' );

$data = json_decode( file_get_contents( 'php://input' ) );

if ( class_exists( 'JSON_Manager' ) ) :
  $workouts = new JSON_Manager();
  if ( ! empty( $data->jsonURL ) ) {
    // echo $data->jsonURL;
    // echo json_encode( $data->jsonURL  );
    echo json_encode( $workouts->glean_file( $data->jsonURL ) );
  } else {
    
    echo json_encode( $workouts->glean_dir() );
  }
endif;

?>