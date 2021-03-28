import { Button, Typography } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import HistoryDeletionDialog from "./HistoryDeletionDialog";
interface ExerciseCompleteProps {
  onClick: () => void;
}
const ExerciseComplete: React.FC<ExerciseCompleteProps> = (props) => {
  return (
    <>
      <Typography>GOOD JOB</Typography>
      <Button variant="contained" color="primary" onClick={props.onClick}>
        New Exercise
      </Button>
      <HistoryDeletionDialog />
    </>
  );
};

export default ExerciseComplete;
