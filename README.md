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

### Name (Required) 

* Type: String

The name of the workout as you would like it to appear in the application.