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

    $checkdir = self::validate_dir( $dir );

    if ( gettype( $checkdir ) === 'string' ) :
      return (object) array(
        "status"   => 0,
        "msg"      => $checkdir
      );
    endif;

    $handle = opendir( $dir );
    $files  = array();

    while ( false !== ( $file = readdir( $handle ) ) ) {
      array_push( $files, $file );
    }

    $workouts = self::glean_file( $files );
    if ( count( $workouts ) > 0 ) {
      
      $c = count( $workouts );
      return (object) array(
        "success"  => 1,
        "msg"      => "Successfully retrieved $c workout(s)",
        "workouts" => $workouts
      );
    } else {
      return (object) array(
        "success"  => 0,
        "msg"      => "Could not find a valid JSON file."
      );
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

      $file_meta = self::process_filename( $file );

      if ( $file_meta ) :

        if ( file_exists( $file_meta->location ) ) {
          $w = json_decode( file_get_contents( $file_meta->location ) );

          $w->id        = $file_meta->id;
          $w->timestamp = filemtime( $file_meta->location );

          array_push( $workouts, $w );
        }        

      endif;
      
    }

    return $workouts;
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
      return "There is no workouts directory.";
    elseif ( count( glob( $dir . '/*' ) ) === 0 ) :
      return "There are no files in the workouts directory.";
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
  private function process_filename( $file, $abs = false ) {
    $extension = strtolower( substr( strrchr( $file, '.' ), 1 ) );
    if ( $extension == 'json' ) {
      
      $file_array = explode( '/', $file );
      $clean_file = end( $file_array );
      
      $name = explode( '.json', $clean_file )[0];
      $file_meta = (object) array(
        'name'     => $name,
        'id'       => self::string_to_id( $name ),
        'location' => $abs ? $file : $this->workout_dir . '/' . $file
      );

      var_dump($file_meta);

      return $file_meta;

    }

    return false;
  }
}


?>