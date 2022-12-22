type Props = {
  message: string;
};

export default ({ message }: Props) => {
  return (
    <article>
      <h1>Oh no! :(</h1>
      <p>{message}</p>
    </article>
  );
};
