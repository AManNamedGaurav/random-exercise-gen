interface ExerciseRecord {
  id: string;
  name: string;
  description: string;
  personalBest: number;
  repGoal: number;
  attemptCount: number;
  difficultyCurveScale: number;
}

export default ExerciseRecord;
