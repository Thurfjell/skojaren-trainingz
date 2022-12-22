import { useState } from "react";
import { useSessionQuery } from "../api/training";
import Error from "./Error";
import SetForm from "./SetForm";

type Props = {
  sessionId: number;
};

export default ({ sessionId }: Props) => {
  const { isError, data } = useSessionQuery(sessionId);

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
    content = <></>;
  }

  return (
    <>
      <button>Add Set</button>
      {content}
    </>
  );
};
