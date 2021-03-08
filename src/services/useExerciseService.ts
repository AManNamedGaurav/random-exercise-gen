import { useEffect, useState } from "react";
import Exercise from "../models/Exercise";
import { Service } from "../types/Service";

const exerciseUrl =
  "https://xl6d8c3cod.execute-api.us-east-2.amazonaws.com/Dev";

const useExerciseService = (): Service<Exercise[]> => {
  const [result, setResult] = useState<Service<Exercise[]>>({
    status: "loading",
  });

  useEffect(() => {
    fetch(exerciseUrl)
      .then((response) => response.json())
      .then((response) => {
        if (Array.isArray(response)) {
          const exercises: Exercise[] = [];
          response.forEach((exercise) => {
            let id: string = exercise["Id"];
            let name: string = exercise["Name"];
            let description: string = exercise["Description"];
            let images: string[] = exercise["Images"];
            exercises.push({
              id: id,
              name: name,
              description: description,
              images: images,
            });
          });
          setResult({ status: "loaded", payload: exercises });
        } else {
          let errorString: string =
            "'results' key in json response " +
            response +
            " does not contain an array";
          setResult({ status: "error", error: new Error(errorString) });
        }
      })
      .catch((error) => setResult({ status: "error", error }));
  }, []);

  return result;
};

export default useExerciseService;
