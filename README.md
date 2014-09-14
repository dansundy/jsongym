# JSON Gym

Write custom workouts in `JSON` (JavaScript Object Notation).

## Getting Started

JSON Gym leads you through customized workouts – telling you what exercise to do next and timing exercises and rest times. Go to [jsongym.com](http://jsongym.com) to check it out.

## Example

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

### name (required)
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
* **Default:** 1

The number of times to go through the list of excercises.

### autoStart
* **Type:** Boolean
* **Default:** false

Set whether or not timed exercises should start automatically.

### autoNext
* **Type:** Boolean
* **Default:** true

Set whether or not timed exercises should move on to rest time or the next exercise automatically.

### exercises (required)
* **Type:** Array

An array of objects that contains the information for each exercise in the workout.

### exercises -> title (required)
* **Type:** String

The name of the exercise as you would like to have it appear during the workout.

### exercises -> reps
* **Type:** Integer

The number of times to perform the exercise.

### exercises -> time
* **Type:** Integer

Sets a timer for the given exercise. Countdown starts automatically. If no reps are set the workout will advance to the rest stage or the next exercise.

### exercises -> rest
* **Type:** Integer

The number of seconds of rest after the respective exercise. Rest time will not appear at the end of the last cycle.