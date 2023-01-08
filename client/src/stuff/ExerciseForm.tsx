import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  useCreateExerciseMutation,
  useUpdateExerciseMutation,
} from "../api/training";
import { formClassName } from "../layout/form.style";

export default ({
  id,
  description,
  name,
  onSubmitted,
  onCancel,
}: Partial<Exercise> & { onSubmitted?: () => void; onCancel: () => void }) => {
  const [createExercise, { isLoading: isCreateLoading }] =
    useCreateExerciseMutation();
  const [updateExercise, { isLoading: isUpdateLoading }] =
    useUpdateExerciseMutation();
  const isUpdate = Boolean(id);
  const [data, setData] = useState<Exercise>({
    name: "",
    description: "",
  });

  const firstInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstInput.current?.focus();
  }, []);

  useEffect(() => {
    if (id) {
      setData({
        id,
        name: name ?? "",
        description: description ?? "",
      });
    }
  }, [id, description, name]);

  const submitMap = useMemo(() => {
    return {
      update: updateExercise,
      create: createExercise,
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fn = isUpdate ? submitMap.update : submitMap.create;

    fn(data)
      .unwrap()
      .then(() => {
        onSubmitted?.();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault();
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className={formClassName.form}>
      <h1 className="text-2xl">
        {isUpdate ? `Update ${data.name}` : "Create Exerercise"}
      </h1>
      <input
        placeholder="Name"
        ref={firstInput}
        className={formClassName.input}
      />
      <input placeholder="Description" className={formClassName.input} />
      <button
        tabIndex={1}
        type="button"
        className={formClassName.buttonLeft}
        disabled={isUpdateLoading || isCreateLoading}
        onClick={handleCancel}
      >
        Cancel
      </button>
      <button
        tabIndex={0}
        type="submit"
        className={formClassName.buttonRight}
        disabled={isUpdateLoading || isCreateLoading}
      >
        {isUpdate ? "Update" : "Create"}
      </button>
    </form>
  );
};
