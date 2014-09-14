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

    $read_files = self::glean_file( $files );

    return $read_files;
    
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

    $f = is_array( $files ) ? $files : array( $files );

    foreach ( $f as $file ) {

      $file_meta = self::process_filename( $file );

      if ( $file_meta ) :

        $w = json_decode( file_get_contents( $file_meta->location ) );

        if ( empty( $w ) ) {
          return (object) array(
            "status"   => 0,
            "msg"      => 'Oops. File is not valid or unreadable.'
          );
        }; 

        $w->id        = $file_meta->id;
        // $w->timestamp = file_exists( $file_meta->location ) ? filemtime( $file_meta->location ) : time();
        $w->timestamp = time();

        array_push( $workouts, $w );  

      endif;
      
    }

    $c = count( $workouts );

    if ( $c > 0 ) {
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
  private function process_filename( $file ) {
    $extension = strtolower( substr( strrchr( $file, '.' ), 1 ) );

    // $abs = ( strpos( $file, 'http' ) === 0 ) ? true : false;

    if ( $extension == 'json' ) {
      
      $file_array = explode( '/', $file );
      $clean_file = end( $file_array );
      
      $name = explode( '.json', $clean_file )[0];
      $file_meta = (object) array(
        'name'     => $name,
        'id'       => self::string_to_id( $name ),
        'location' => $file
      );

      return $file_meta;

    }

    return false;
  }
}


?>