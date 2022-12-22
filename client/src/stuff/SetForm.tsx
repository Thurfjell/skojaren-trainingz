import React from "react";
import { useExercisesQuery } from "../api/training";

export default () => {
  const { data: exercises } = useExercisesQuery({});
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };
  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Weight" />
      <input placeholder="Reps" />
      <input placeholder="Time" />
    </form>
  );
};
