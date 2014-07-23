# JSON Gym

Write custom workouts in `JSON` (JavaScript Object Notation).

## Getting Started

1. Download or clone the repository.
2. The `jsongym` folder is the production ready application. Put it wherever you want to run the application from.
  * Advanced Users: If you want to make your own customizations to the application you can do so in the `src` folder. The application is built with the command `gulp build`.
3. Write a custom workout in valid `JSON` using the example and the API below. Place it in the workouts directory.

A very simple workout would look something like this:


    {
        "name": "Example Workout",
        "description" : "The workout's description",
        "exercises": [
            {
               "name": "The First Exercise",
            	"reps": 10,
       			"rest": 30
      		}
    	]
	}

## API

### name (Required)
* **Type:** String

The name of the workout as you would like it to appear in the application.

### description
* **Type:** String

A description of the workout. If provided, this information will appear as a sub section of the workouts list.

### order
* **Type:** Integer

Forces the order of appearance in the list of workouts. If the order is not explicitly set, workouts will appear with the most recently modified file first. If timestamps are all the same (e.g. if all files are uploaded at the same time), they will appear in alphabetical order by name.

### cycles
* **Type:** Integer

The number of times to go through the list of excercises.

### exercises
* **Type:** Array

An array of objects that contains the information for each exercise in the workout.

### exercise
* **Type:** String

The name of the exercise as you would like to have it appear during the workout.

### reps
* **Type:** Integer

The number of times to perform the exercise.

### time
* **Type:** Integer

Sets a timer for the given exercise. Countdown starts automatically. If no reps are set the workout will advance to the rest stage or the next exercise.

### rest
* **Type:** Integer

The number of seconds of rest after the respective exercise. Rest time will not appear at the end of the last cycle.









