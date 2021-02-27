import ExerciseRecord from "../models/Exercise";

export const storeExerciseRecord = (exercise: ExerciseRecord) => {
  localStorage.setItem(exercise.id, JSON.stringify(exercise));
};
export const retrieveLocalExerciseRecord = (id: string): ExerciseRecord => {
  return JSON.parse(localStorage.getItem(id) || "");
};
