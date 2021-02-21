import React, { useState, useEffect } from "react";
import Exercise from "./models/Exercise";
import PersonalRecord from "./models/PersonalRecord";

const exerciseUrl =
  "https://wger.de/api/v2/exercise/?equipment=7&language=2&limit=50";

function App() {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isExerciseComplete, setExerciseComplete] = useState<boolean>(false);
  const [isError, setError] = useState<boolean>(false);

  const getExercise = async () => {
    let response = await fetch(exerciseUrl);
    let data = await response.json();
    let exerciseCount = data["count"];
    //get a random object from the array, results
    let randExObj = data["results"][Math.floor(Math.random() * exerciseCount)];
    console.log(randExObj);

    //get relevant data from the exercise object and set state
    let id: string = randExObj["id"];
    let name: string = randExObj["name"];
    let description: string = randExObj["description"];
    var pr: PersonalRecord;
    try {
      pr = JSON.parse(localStorage.getItem(id) || "");
    } catch (SyntaxError) {
      pr = {
        personalBest: 0,
        nextRepGoal: 5,
        numOfSetsCompleted: 0,
        currentDifficultyScale: 1,
      };
    }

    setExercise({
      id: id,
      name: name,
      description: description,
      personalRecord: pr,
    });
  };

  //user has exercised
  const handleSetComplete = (difficulty: number) => {
    incrementNumOfSetsCompleted();
    //calculate next repGoal based on difficulty of this set
    updateNextRepGoal(difficulty);
    setExerciseComplete(true);
  };

  const updateNextRepGoal = (difficultyScale: number) => {
    let newRepGoal: number | null = getNextRepGoal(difficultyScale);

    if (newRepGoal) {
      setExercise((prev) => {
        if (!prev) {
          console.error("Trying to set personalRecord.newRepGoal of null");
          setError(true);
          return null;
        } else if (newRepGoal) {
          //prev state does exist. can set new Rep Goal
          return {
            ...prev,
            personalRecord: {
              ...prev.personalRecord,
              nextRepGoal: newRepGoal,
            },
          };
        }
        return null;
      });
      exercise &&
        localStorage.setItem(
          exercise.id,
          JSON.stringify(exercise.personalRecord)
        );
      setExerciseComplete(true);
    } else {
      console.error("could not set nextRepGoal");
      setError(true);
    }
  };
  const getNextRepGoal = (difficultyScale: number): number | null => {
    let numOfSetsCompleted: number | undefined =
      exercise?.personalRecord?.numOfSetsCompleted;
    let currentDifficultyScale: number | undefined =
      exercise?.personalRecord?.currentDifficultyScale;
    if (
      !(
        numOfSetsCompleted === undefined || currentDifficultyScale === undefined
      )
    ) {
      return Math.ceil(
        (Math.log(numOfSetsCompleted + 1) + 5) *
          currentDifficultyScale *
          difficultyScale
      );
    } else {
      return null;
    }
  };

  const incrementNumOfSetsCompleted = () => {
    setExercise((prev) => {
      if (!prev) {
        console.error(
          "Trying to increment Number of Attempts for a null Exercise"
        );
        setError(true);
        return null;
      } else {
        //prev state does exist. can increment numOfAttempts
        let newNumOfAttempts = prev.personalRecord.numOfSetsCompleted + 1;
        return {
          ...prev,
          personalRecord: {
            ...prev.personalRecord,
            numOfSetsCompleted: newNumOfAttempts,
          },
        };
      }
    });
  };

  const handleNextExercise = () => {
    setLoading(true);
    getExercise().then(() => setLoading(false));
  };

  //fetch data on initial render
  useEffect(() => {
    getExercise().then(() => setLoading(false));
  }, []);

  if (isLoading) {
    return <div>Loading</div>;
  } else if (!isError) {
    if (isExerciseComplete) {
      return (
        <>
          <div>GOOD JOB</div>
          <button
            onClick={() => {
              handleNextExercise();
            }}
          >
            New Exercise
          </button>
        </>
      );
    }
    return (
      <div>
        <div>{exercise?.name}</div>
        <div>{exercise?.description}</div>
        <div>
          Personal Best Reps/Seconds: {exercise?.personalRecord.personalBest}
        </div>
        <div>Push For: {exercise?.personalRecord.nextRepGoal}</div>
        <div>
          <button id="0" onClick={() => handleSetComplete(0.75)}>
            I couldn't complete the set :(
          </button>
          <button id="1" onClick={() => handleSetComplete(1)}>
            That was a challenging set!
          </button>
          <button id="2" onClick={() => handleSetComplete(2)}>
            That was too easy!
          </button>
        </div>
      </div>
    );
  } else {
    return <div>Something went wrong. Check your console</div>;
  }
}

export default App;
