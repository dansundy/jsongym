<?php

/**
 * The main class that handles managing .json files.
 *
 * @param string $dir The directory that holds the workout files.
 * @since 1.2.0
 */
class JSON_Manager {
  private $workout_dir;

  function __construct( $dir = '../workouts' ) {
    $this->workout_dir = $dir;
  }

  /**
   * Scans a directory for valid files.
   *
   * @return Array An array of workout objects
   */
  public function glean_dir() {
    $dir = $this->workout_dir;

    self::validate_dir( $dir );

    $handle = opendir( $dir );
    $files  = array();

    while ( false !== ( $file = readdir( $handle ) ) ) {
      $file_meta = self::process_filename( $file );

      if ( ! empty( $file_meta ) ) {
        array_push( $files, $file_meta );
      }
    }

    if ( count( $files ) > 0 ) {
      $workouts = self::glean_file( $files );
      return $workouts;
    } else {
      die( 'There are no valid JSON files.' );
    }
  }

  /**
   * Scans an array of workout files to construct workouts.
   *
   * This is an array of objects. The objects are created
   * with the process_filename() method.
   *
   * @param  array $files An array of workout JSON files.
   * @return array A validated workout array.
   */
  public function glean_file( $files ) {
    $workouts = array();
    foreach ( $files as $file ) {

      $w = json_decode( file_get_contents( $file->location ) );

      $w->id        = $file->id;
      $w->timestamp = filemtime( $file->location );

      array_push( $workouts, $w );
      return $workouts;
    }
  }

  /**
   * Utility funcion to change a string into a web safe ID.
   *
   * @param  string $string
   * @return string A web safe ID.
   */
  public function string_to_id( $string ) {
    $id = strtolower(trim(preg_replace('~[^0-9a-z]+~i', '-', html_entity_decode(preg_replace('~&([a-z]{1,2})(?:acute|cedil|circ|grave|lig|orn|ring|slash|th|tilde|uml);~i', '$1', htmlentities($string, ENT_QUOTES, 'UTF-8')), ENT_QUOTES, 'UTF-8')), '-'));
    return $id;
  }

  /**
   * Utility function to validate a directory path.
   *
   * Function ensures that the directory in question
   * exists and is not empty. Function kills the script
   * with an error message if unsuccessful.
   *
   * @param  string $dir A directory path.
   * @return boolean True if successful.
   */
  private function validate_dir( $dir ) {
    if ( !file_exists( $dir ) ) :
      die( 'The directory doesn\'t exist.' );
    elseif ( count( glob($dir . '/*' ) ) === 0 ) :
      die( 'There are no files in the directory.' );
    else :
      return true;
    endif;
  }

  /**
   * Returns the file meta data if valid.
   *
   * Meta data contents include the original name, a URL safe ID,
   * and the file's path (based on $this->workout_dir).
   *
   * @param  string $file The filename to be processed.
   * @return object|boolean Meta data object or false.
   */
  private function process_filename( $file ) {
    $extension = strtolower( substr( strrchr( $file, '.' ), 1 ) );
    if ( $extension == 'json' ) {

      $name = explode( '.json', $file )[0];
      $file_meta = (object) array(
        'name'     => $name,
        'id'       => self::string_to_id( $name ),
        'location' => $this->workout_dir . '/' . $file
      );

      return $file_meta;

    }

    return false;
  }
}


?>