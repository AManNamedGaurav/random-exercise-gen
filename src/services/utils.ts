import Difficulty from "../models/Difficulty";
import ExerciseRecord from "../models/Exercise";
import { retrieveLocalExerciseRecord } from "./LocalRecordStorageService";

export function extractExerciseRecord(randExObj: any): ExerciseRecord {
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
}

export const calculateNextRepGoal = (
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
