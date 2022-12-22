-- Write your migrate up statements here
create table exercises(
    id bigint generated always as identity primary key,
    created_at timestamp with time zone default now(),
    exercise_name text not null,
    exercise_desc text
);

create table users(
    id bigint generated always as identity primary key,
    created_at timestamp with time zone default now(),
    email text not null,
    password text
);

create table workout_sessions(
    id bigint generated always as identity primary key,
    created_at timestamp with time zone default now()
);

create table session_exercise_sets(
    id bigint generated always as identity primary key,
    exercise_id bigint,
    session_id bigint,
    set_weight int,
    set_reps int,
    set_time int,
    set_time_unit text,
    constraint fk_exr foreign key(exercise_id) references exercises(id),
    constraint fk_ses foreign key(session_id) references workout_sessions(id) on delete cascade
);
---- create above / drop below ----

drop table users;
drop table session_exercise_sets;
drop table workout_sessions;
drop table exercises;

-- Write your migrate down statements here. If this migration is irreversible
-- Then delete the separator line above.
