import { useSessionsQuery } from "../api/training";
import Empty from "./Empty";
import Error from "./Error";
import SessionList from "./SessionList";

export default () => {
  const { isError, data } = useSessionsQuery({ order: "desc" });

  let content = <Empty message="session" />;

  if (isError) {
    content = <Error message="Something went wrong fetching sessions." />;
  }

  if (data && data.length) {
    content = <SessionList sessions={data} />;
  }

  return (
    <article className="">
      <h1>Workout Sessions</h1>
      {content}
    </article>
  );
};
