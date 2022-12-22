type Props = {
  sessions: ExerciseSession[];
};

export default ({ sessions }: Props) => {
  return (
    <ol>
      {sessions.map((session) => (
        <li>{session.sessionAt.toDateString()}</li>
      ))}
    </ol>
  );
};
