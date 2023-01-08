import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  useCreateSessionMutation,
  useExercisesQuery,
  useSessionsQuery,
} from "../api/training";
import Empty from "./Empty";
import Error from "./Error";
import ExerciseForm from "./ExerciseForm";
import Modal from "./Modal";
import SessionList from "./SessionList";

export default () => {
  const [newExerciseForm, setNewExerciseForm] = useState(false);
  const { isError, data } = useSessionsQuery({ order: "desc" });
  const { isError: exerciseError, data: exercises } = useExercisesQuery({
    order: "asc",
  });
  const [createSession, { isLoading: isCreating }] = useCreateSessionMutation();

  let content = useMemo(() => {
    if (isError || exerciseError) {
      const e = exerciseError ? "exercises" : "";
      const s = isError ? "sessions" : "";
      const issue = [e, s].filter(Boolean).join(" and ");
      return <Error message={`Something went wrong fetching ${issue}.`} />;
    } else if (data && data.length) {
      return <SessionList sessions={data} />;
    } else {
      return <Empty message="session" />;
    }
  }, [isError, data, exerciseError]);

  const handleCreateSession = () => {
    createSession(new Date());
  };

  return (
    <article>
      <h1>Workout Sessions</h1>
      {!exercises?.length && <p>No exercises set up!</p>}
      {newExerciseForm && (
        <Modal>
          <ExerciseForm onCancel={() => setNewExerciseForm(false)} />
        </Modal>
      )}
      <button onClick={handleCreateSession} disabled={isCreating}>
        Create Session
      </button>
      <button onClick={() => setNewExerciseForm(true)}>Create Exercise</button>
      {content}
    </article>
  );
};
