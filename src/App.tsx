import React, { useState, useEffect } from "react";
import ExerciseRecord from "./models/ExerciseRecord";
import Difficulty from "./models/Difficulty";
import { calculateNextRepGoal } from "./services/utils";
import {
  retrieveLocalExerciseRecord,
  storeExerciseRecord,
} from "./services/LocalRecordStorageService";
import HistoryDeletionDialog from "./components/HistoryDeletionDialog";
import useExerciseService from "./services/useExerciseService";
import Exercise from "./models/Exercise";

function App() {
  const [exerciseRecord, setExerciseRecord] = useState<ExerciseRecord | null>(
    null
  );
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isExerciseAttempted, setExerciseAttempted] = useState<boolean>(false);
  const [isError, setError] = useState<boolean>(false);

  const exerciseService = useExerciseService();

  useEffect(() => {
    if (exerciseService.status === "loaded") {
      handleNewExerciseRequest();
      setLoading(false);
    } else if (exerciseService.status === "error") {
      console.log(exerciseService.error);
    }
  }, [exerciseService.status]);

  const handleNewExerciseRequest = () => {
    if (exerciseService.status === "loaded") {
      setExerciseAttempted(false);
      console.log(exerciseService.payload.length);
      console.log(exerciseService.payload);
      let randomExercise: Exercise =
        exerciseService.payload[
          Math.floor(Math.random() * exerciseService.payload.length)
        ];
      console.log("Random exercise object: \n" + randomExercise.name);
      setExercise(randomExercise);
      let record: ExerciseRecord;
      try {
        record = retrieveLocalExerciseRecord(randomExercise.id);
      } catch (e) {
        console.log(
          "Could not find local exercise for id: " + randomExercise.id
        );
        record = {
          id: randomExercise.id,
          personalBest: 0,
          repGoal: 5,
          attemptCount: 0,
          difficultyCurveScale: 1,
        };
      }
      setExerciseRecord(record);
    } else if (exerciseService.status === "error") {
      setError(true);
      console.log(exerciseService.error);
    }
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
          <HistoryDeletionDialog />
        </>
      );
    }
    return (
      <div>
        <div>{exercise?.name}</div>
        <div>{exercise?.description}</div>
        {exercise?.images.map((img) => {
          return (
            <img
              src={img}
              alt="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png"
            />
          );
        })}
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
        <HistoryDeletionDialog />
      </div>
    );
  } else {
    return <div>Something went wrong</div>;
  }
}

export default App;
