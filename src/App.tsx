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
import Button from "@material-ui/core/Button";
import LoadingPage from "./components/LoadingPage";
import ExerciseCompletedPage from "./components/ExerciseCompletedPage";
import NewExercisePromptComponent from "./components/NewExercisePromptComponent";
import { Container, makeStyles } from "@material-ui/core";

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
        console.log(e);
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
      console.log(
        "Exercise record after updating rep goal: " +
          retrieveLocalExerciseRecord(updatedExRecord.id).repGoal
      );
    } else {
      console.error(
        "Trying to handle exercise attempted with no exercise in state"
      );
      setError(true);
    }
  };

  //*****************************************VIEW*********************************************** */
  const classes = useStyles();
  if (isLoading) {
    return (
      <div className={classes.paper}>
        <LoadingPage />
      </div>
    );
  } else if (!isError) {
    if (isExerciseAttempted) {
      return (
        <div className={classes.paper}>
          <ExerciseCompletedPage onClick={handleNewExerciseRequest} />
        </div>
      );
    }
    if (exercise && exerciseRecord) {
      return (
        <div className={classes.paper}>
          <NewExercisePromptComponent
            exercise={exercise}
            exerciseRecord={exerciseRecord}
            exerciseAttemptedHandler={handleExerciseAttempted}
            newExerciseHandler={handleNewExerciseRequest}
          />
        </div>
      );
    } else {
      return (
        <div className={classes.paper}>
          <div>Something went wrong</div>
        </div>
      );
    }
  } else {
    return (
      <div className={classes.paper}>
        <div>Something went wrong</div>
      </div>
    );
  }
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

export default App;
