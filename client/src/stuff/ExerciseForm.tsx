import React, { useEffect, useState } from "react";
import {
  useCreateExerciseMutation,
  useUpdateExerciseMutation,
} from "../api/training";

export default ({
  id,
  description,
  name,
  onSubmitted,
}: Partial<Exercise> & { onSubmitted?: () => void }) => {
  const [createExercise, {}] = useCreateExerciseMutation();
  const [updateExercise, {}] = useUpdateExerciseMutation();
  const isUpdate = Boolean(id);
  const [data, setData] = useState<Exercise>({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (id) {
      setData({
        id,
        name: name ?? "",
        description: description ?? "",
      });
    }
  }, [id, description, name]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isUpdate) {
      updateExercise(data);
      return;
    }

    createExercise(data)
      .unwrap()
      .then(() => {
        onSubmitted?.();
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Name" />
      <input placeholder="Description" />
      <button type="submit">{isUpdate ? "Update" : "Create"}</button>
    </form>
  );
};
