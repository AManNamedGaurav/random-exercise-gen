import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import Difficulty from "../models/Difficulty";
import Exercise from "../models/Exercise";
import ExerciseRecord from "../models/ExerciseRecord";
import HistoryDeletionDialog from "./HistoryDeletionDialog";

interface NewExercisePromptProps {
  exercise: Exercise;
  exerciseRecord: ExerciseRecord;
  exerciseAttemptedHandler: (difficulty: Difficulty) => void;
  newExerciseHandler: () => void;
}

const useStyles = makeStyles((theme) => ({
  exerciseTitle: {
    textAlign: "center",
  },
  exerciseDesc: {},
  reps: { textAlign: "center" },
  image: {
    width: "100%",
    height: "auto",
  },
}));

const NewExercisePromptComponent: React.FC<NewExercisePromptProps> = ({
  exercise,
  exerciseRecord,
  exerciseAttemptedHandler,
  newExerciseHandler,
}) => {
  const classes = useStyles();
  return (
    <Grid
      container
      spacing={3}
      direction="column"
      alignContent="center"
      alignItems="center"
      justify="center"
    >
      <Grid item xs={12}>
        <Typography className={classes.exerciseTitle} variant="h5">
          {exercise.name}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <img src={exercise.images[0]} alt="" className={classes.image} />
      </Grid>
      <Grid item xs={12}>
        <Typography className={classes.exerciseDesc}>
          {exercise.description}
        </Typography>
      </Grid>
      <Grid item xs={12} className={classes.reps}>
        <Typography variant="h6">
          Reps/Seconds: {exerciseRecord?.repGoal}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => exerciseAttemptedHandler(Difficulty.IMPOSSIBLE)}
        >
          I couldn't complete the set
        </Button>
      </Grid>
      <Grid item xs={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => exerciseAttemptedHandler(Difficulty.CHALLENGING)}
        >
          That was a challenging set!
        </Button>
      </Grid>
      <Grid item xs={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => exerciseAttemptedHandler(Difficulty.EASY)}
        >
          That was too easy!
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          onClick={newExerciseHandler}
        >
          Give me a different exercise!
        </Button>
      </Grid>
      <Grid item xs={12}>
        <HistoryDeletionDialog />
      </Grid>
    </Grid>
  );
};

export default NewExercisePromptComponent;
