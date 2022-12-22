package postgres

import (
	"btserver/cmd/btserver"
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type exercise struct {
	Id          int    `db:"id"`
	Name        string `db:"exercise_name"`
	Description string `db:"exercise_desc"`
}

func (e *exercise) toDomain() *btserver.Excercise {
	return &btserver.Excercise{
		Id:          e.Id,
		Name:        e.Name,
		Description: e.Description,
	}
}

func Pool(connectionString string) (*pgxpool.Pool, error) {
	return pgxpool.New(context.Background(), connectionString)
}

func BuildTrainingService(pool *pgxpool.Pool) *TrainingService {
	return &TrainingService{
		db: pool,
	}
}

func sqlFilter(orderField string, f *btserver.Filter) string {
	order := ""
	if len(orderField) > 0 && (f.Order == "asc" || f.Order == "desc") {
		order = fmt.Sprintf("order by %s %s", orderField, f.Order)
	}

	return fmt.Sprintf("%s limit %d offset %d", order, f.Take, f.Skip*f.Take)

}

type TrainingService struct {
	db *pgxpool.Pool
}

func (s *TrainingService) CreateExercise(ctx context.Context, name, description string) (int, error) {
	q := fmt.Sprintf(`
		insert into exercises(exercise_name, exercise_desc) values('%s','%s') returning id;
	`, name, description)

	var id int
	err := s.db.QueryRow(ctx, q).Scan(&id)
	return id, err
}

func (s *TrainingService) UpdateExercise(ctx context.Context, e *btserver.Excercise) error {
	q := fmt.Sprintf("update exercises set exercise_name='%s', exercise_desc='%s' where id=%d", e.Name, e.Description, e.Id)
	return s.db.QueryRow(ctx, q).Scan()
}

func (s *TrainingService) Exercises(ctx context.Context, filter *btserver.Filter) ([]btserver.Excercise, error) {
	fmt.Println(sqlFilter("exercise_name", filter))
	q := fmt.Sprintf(`
		select id, exercise_name, exercise_desc  from exercises %s
	`, sqlFilter("exercise_name", filter))

	rows, err := s.db.Query(ctx, q)
	if err != nil {
		return nil, err
	}

	exercises := make([]btserver.Excercise, 0)

	for rows.Next() {
		var id int
		var exercise_name string
		var exercise_desc string
		err = rows.Scan(&id, &exercise_name, &exercise_desc)
		if err != nil {
			return nil, err
		}
		exercises = append(exercises, btserver.Excercise{
			Id:          id,
			Name:        exercise_name,
			Description: exercise_desc,
		})
	}

	return exercises, nil
}

func (s *TrainingService) CreateSession(ctx context.Context, sessionAt time.Time) (int, error) {
	q := fmt.Sprintf(`
		insert into workout_sessions(session_at) values('%s') returning id;
	`, sessionAt.Local().Format(time.RFC3339))

	var id int
	err := s.db.QueryRow(ctx, q).Scan(&id)

	return id, err
}

func (s *TrainingService) CreateSet(ctx context.Context, set *btserver.SessionExerciseSet) (int, error) {
	q := fmt.Sprintf(`
	 insert into session_exercise_sets(
		exercise_id, 
		session_id, 
		set_weight,
		set_reps,
		set_time,
		set_time_unit) values(
			'%d',
			'%d',
			'%d',
			'%d',
			'%d',
			'%s'
		) returning id;
	 `, set.Excercise.Id, set.Session.Id, set.Weight, set.Reps, set.Time, set.TimeUnit)

	var id int
	err := s.db.QueryRow(ctx, q).Scan(&id)
	return id, err
}
