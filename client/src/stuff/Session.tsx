import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLazySessionQuery } from "../api/training";
import Error from "./Error";
import SetForm from "./SetForm";

export default () => {
  const { sessionId } = useParams();
  const [getSession, { data, isError }] = useLazySessionQuery();

  useEffect(() => {
    if (sessionId) {
      getSession(parseInt(sessionId), true);
    }
  }, [sessionId]);

  const [showNewSetForm, setShowNewSetForm] = useState(false);

  let content = null;

  if (showNewSetForm) {
    content = <SetForm />;
  }

  if (isError) {
    content = (
      <Error message="Couldn't get the session. Server where did you go?" />
    );
  }

  if (data) {
    content = (
      <>
        {data.sets.map((set) => (
          <>Exercise id :D {set.exerciseId}</>
        ))}
      </>
    );
  }

  return (
    <>
      <button>Add Set</button>
      {content}
    </>
  );
};
