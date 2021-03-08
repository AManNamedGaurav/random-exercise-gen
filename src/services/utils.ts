import Difficulty from "../models/Difficulty";
import ExerciseRecord from "../models/ExerciseRecord";

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
