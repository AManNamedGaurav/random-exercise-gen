import { Button, Grid, makeStyles, Typography } from "@material-ui/core";
import Difficulty from "../models/Difficulty";
import Exercise from "../models/Exercise";
import ExerciseRecord from "../models/ExerciseRecord";
import HistoryDeletionDialog from "./HistoryDeletionDialog";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";

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

const theme = createMuiTheme({
  typography: {
    button: {},
  },
});

const NewExercisePromptComponent: React.FC<NewExercisePromptProps> = ({
  exercise,
  exerciseRecord,
  exerciseAttemptedHandler,
  newExerciseHandler,
}) => {
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
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
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>How to Perform</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{exercise.description}</Typography>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid item xs={12} className={classes.reps}>
          <Typography variant="h5">
            Reps/Seconds: {exerciseRecord?.repGoal}
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          container
          spacing={2}
          direction="row"
          alignContent="center"
          alignItems="center"
          justify="center"
        >
          <Grid item xs={4}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={() => exerciseAttemptedHandler(Difficulty.IMPOSSIBLE)}
            >
              Too Hard
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="contained"
              color="default"
              fullWidth
              onClick={() => exerciseAttemptedHandler(Difficulty.CHALLENGING)}
            >
              Challenging
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => exerciseAttemptedHandler(Difficulty.EASY)}
            >
              Too Easy
            </Button>
          </Grid>
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
    </ThemeProvider>
  );
};

export default NewExercisePromptComponent;
