import React, { useState, useEffect } from "react";
import ExerciseRecord from "./models/ExerciseRecord";
import Difficulty from "./models/Difficulty";
import { extractExerciseRecord, calculateNextRepGoal } from "./services/utils";
import { storeExerciseRecord } from "./services/LocalRecordStorageService";
import HistoryDeletionDialog from "./components/HistoryDeletionDialog";

const exerciseUrl =
  "https://wger.de/api/v2/exerciseinfo/?equipment=7&language=2&limit=50";

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
        <div>{exerciseRecord?.name}</div>
        <div>{exerciseRecord?.description}</div>
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
