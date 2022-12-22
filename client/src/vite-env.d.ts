/// <reference types="vite/client" />

type Filter = {
  skip: number;
  take: number;
  search: string;
  order: "asc" | "desc";
};

type ExerciseSession = {
  id: number;
  sessionAt: Date;
};

type Exercise = {
  id?: number;
  name: string;
  description: string;
};

type ExerciseSet = {
  id: number;
  sessionId: number;
  exerciseId: number;
  weight: number;
  weightUnit: "kg" | "lb";
  reps: number;
  time: number;
  timeUnit: "second" | "minute" | "hour";
};
