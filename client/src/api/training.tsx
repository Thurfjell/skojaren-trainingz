import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { filterWithDefaultsToUrlQuery } from "./utils";

export const trainingApi = createApi({
  reducerPath: "trainingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:1337/api/v1",
    credentials: "include",
    mode: "cors",
  }),
  endpoints: (builder) => ({
    exercises: builder.query<Exercise[], Partial<Filter>>({
      query: (filter) => ({
        url: `/exercises?${filterWithDefaultsToUrlQuery(filter)}`,
        method: "GET",
      }),
    }),
    createExercise: builder.mutation<number, Exercise>({
      query: (exercise) => ({
        url: "/exercises",
        body: exercise,
        method: "POST",
      }),
    }),
    updateExercise: builder.mutation<number, Exercise>({
      query: (exercise) => ({
        url: "/exercises",
        body: exercise,
        method: "PUT",
      }),
    }),
    createSession: builder.mutation<number, Date>({
      query: (sessionAt) => ({
        url: "/sessions",
        body: { sessionAt: sessionAt.toISOString() },
        method: "POST",
      }),
    }),
    session: builder.query<ExerciseSession & { sets: ExerciseSet[] }, number>({
      query: (id) => ({
        url: `/sessions/${id}`,
        method: "GET",
      }),
    }),
    sessions: builder.query<ExerciseSession[], Partial<Filter>>({
      query: (filter) => ({
        url: `/sessions?${filterWithDefaultsToUrlQuery(filter)}`,
        method: "GET",
      }),
    }),
    createSet: builder.mutation<number, ExerciseSet>({
      query: (set) => ({
        url: "/sets",
        body: set,
        method: "POST",
      }),
    }),
    sets: builder.query<ExerciseSet[], Filter>({
      query: (filter) => ({
        url: `/sets?${filterWithDefaultsToUrlQuery(filter)}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLazyExercisesQuery,
  useExercisesQuery,
  useCreateExerciseMutation,
  useUpdateExerciseMutation,
  useCreateSessionMutation,
  useSessionsQuery,
  useSessionQuery,
  useLazySessionQuery,
} = trainingApi;
