package btserver

import (
	"context"
	"time"
)

type Excercise struct {
	Id          int
	Name        string
	Description string
}

type User struct {
	Id    int
	Email string
}

type WorkoutSession struct {
	Id          int
	CreatedAt   time.Time
	Excercises  []SessionExerciseSet
	CompletedAt time.Time
}

type SessionExerciseSet struct {
	Weight     int
	WeightUnit string
	Reps       int
	Time       int
	TimeUnit   string
	Excercise  *Excercise
	Session    *WorkoutSession
}

type Filter struct {
	Skip   int
	Take   int
	Search string
	Order  string
}

type TrainingService interface {
	CreateExercise(ctx context.Context, name, description string) (int, error)
	UpdateExercise(ctx context.Context, e *Excercise) error
	Exercises(ctx context.Context, filter *Filter) ([]Excercise, error)
	CreateSession(ctx context.Context, sessionAt time.Time) (int, error)
	CreateSet(ctx context.Context, set *SessionExerciseSet) (int, error)
}
