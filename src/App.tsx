import React, { useState, useEffect } from "react";
import ExerciseRecord from "./models/Exercise";
import Difficulty from "./models/Difficulty";

const exerciseUrl =
  "https://wger.de/api/v2/exercise/?equipment=7&language=2&limit=50";

function App() {
  const [exerciseRecord, setExerciseRecord] = useState<ExerciseRecord | null>(
    null
  );
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isExerciseAttempted, setExerciseAttempted] = useState<boolean>(false);
  const [isError, setError] = useState<boolean>(false);

  useEffect(() => {
    handleNewExerciseRequest();
  }, []);

  const handleNewExerciseRequest = async () => {
    setLoading(true);
    setExerciseAttempted(false);
    let response: Response = await fetch(exerciseUrl);
    let data: any = await response.json();
    let exerciseCount: number = data["count"];
    //get a random object from the results array
    let randExObj: object =
      data["results"][Math.floor(Math.random() * exerciseCount)];
    console.log("Random exercise object: \n" + randExObj);
    //get relevant data from the exercise object and set state
    let randomExerciseRecord: ExerciseRecord = extractExerciseRecord(randExObj);
    setExerciseRecord(randomExerciseRecord);
    setLoading(false);
  };

  const handleExerciseAttempted = (difficulty: Difficulty) => {
    setExerciseAttempted(true);
    if (exerciseRecord) {
      //increment attempt count
      let updatedExRecord = {
        ...exerciseRecord,
        attemptCount: exerciseRecord.attemptCount + 1,
      };

      //update personalBest if user completed
      switch (difficulty) {
        case Difficulty.CHALLENGING:
        case Difficulty.EASY:
          //update record's new personal best
          updatedExRecord = {
            ...updatedExRecord,
            personalBest: updatedExRecord.repGoal,
          };
          break;
      }
      let newRepGoal: number = calculateNextRepGoal(
        updatedExRecord,
        difficulty
      );
      updatedExRecord = { ...updatedExRecord, repGoal: newRepGoal };
      storeExerciseRecord(updatedExRecord);
    } else {
      console.error(
        "Trying to handle exercise attempted with no exercise in state"
      );
      setError(true);
    }
  };

  const extractExerciseRecord = (randExObj: any): ExerciseRecord => {
    let id: string = randExObj["id"];
    let name: string = randExObj["name"];
    let description: string = randExObj["description"];
    let localExercise: ExerciseRecord;
    let item = localStorage.getItem(id);
    console.log(
      "item: " + item + "\nfound at key: " + id + "\n in local storage"
    );
    try {
      localExercise = retrieveLocalExerciseRecord(id);
      let remoteExercise = {
        ...localExercise,
        name: name,
        description: description,
      };
      console.log("Remote and local exercises for the same id");
      console.log("Local Exercise with id: " + localExercise.id);
      console.log(localExercise);
      console.log("Remote exercise with id: " + remoteExercise.id);
      console.log(remoteExercise);
    } catch (e) {
      console.log("Could not find local exercise for id: " + id);
      localExercise = {
        id: id,
        name: name,
        description: description,
        personalBest: 0,
        repGoal: 5,
        attemptCount: 0,
        difficultyCurveScale: 1,
      };
    }

    //TODO: create a local back up of all exercises in remote api endpoint
    return localExercise;
  };

  const calculateNextRepGoal = (
    record: ExerciseRecord,
    difficulty: Difficulty
  ): number => {
    let attempts: number = record.attemptCount;
    let currentDifficultyScale: number = record.difficultyCurveScale;
    let newDifficultyScale: number;
    switch (difficulty) {
      case Difficulty.CHALLENGING:
        newDifficultyScale = currentDifficultyScale * 1;
        break;
      case Difficulty.EASY:
        newDifficultyScale = currentDifficultyScale * 2;
        break;
      default:
        newDifficultyScale = currentDifficultyScale * 0.75;
    }
    return Math.ceil(
      (Math.log(attempts + 1) + 5) * currentDifficultyScale * newDifficultyScale
    );
  };

  const storeExerciseRecord = (exercise: ExerciseRecord) => {
    localStorage.setItem(exercise.id, JSON.stringify(exercise));
  };
  const retrieveLocalExerciseRecord = (id: string): ExerciseRecord => {
    return JSON.parse(localStorage.getItem(id) || "");
  };

  //*****************************************VIEW*********************************************** */
  if (isLoading) {
    return <div>Loading</div>;
  } else if (!isError) {
    if (isExerciseAttempted) {
      return (
        <>
          <div>GOOD JOB</div>
          <button
            onClick={() => {
              handleNewExerciseRequest();
            }}
          >
            New Exercise
          </button>
          <button
            onClick={() => {
              localStorage.clear();
            }}
          >
            Clear My History
          </button>
        </>
      );
    }
    return (
      <div>
        <div>{exerciseRecord?.name}</div>
        <div>{exerciseRecord?.description}</div>
        <div>Personal Best Reps/Seconds: {exerciseRecord?.personalBest}</div>
        <div>Reps: {exerciseRecord?.repGoal}</div>
        <div>
          <button
            id="0"
            onClick={() => handleExerciseAttempted(Difficulty.IMPOSSIBLE)}
          >
            I couldn't complete the set :(
          </button>
          <button
            id="1"
            onClick={() => handleExerciseAttempted(Difficulty.CHALLENGING)}
          >
            That was a challenging set!
          </button>
          <button
            id="2"
            onClick={() => handleExerciseAttempted(Difficulty.EASY)}
          >
            That was too easy!
          </button>
          <button onClick={() => handleNewExerciseRequest()}>
            Give me a different exercise!
          </button>
        </div>
        <button
          onClick={() => {
            localStorage.clear();
          }}
        >
          Clear My History
        </button>
      </div>
    );
  } else {
    return <div>Something went wrong</div>;
  }
}

export default App;
