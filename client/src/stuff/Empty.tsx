type Props = {
  message: string;
};

export default ({ message }: Props) => (
  <article>
    <h1>Empty</h1>
    <p>There's no {message} data</p>
  </article>
);
