-- Write your migrate up statements here

create table achievements(
    id bigint generated always as identity primary key,
    created_at timestamp with time zone default now(),
    exercise_id bigint,
    set_count int,
    set_reps int,
    set_weight int,
    weight_unit text,
    completed_at timestamp with time zone,
    constraint fk_exr foreign key(exercise_id) references exercises(id)
);

alter table workout_sessions add column session_at timestamp with time zone;

---- create above / drop below ----

drop table achievements;

-- Write your migrate down statements here. If this migration is irreversible
-- Then delete the separator line above.
