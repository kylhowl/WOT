// code to build and initialize DB goes here
const {
  client
  // other db methods 
} = require('./index');

async function buildTables() {
  try {
    client.connect();
      console.log('DROPPING TABLES!')
    // drop tables in correct order
      await client.query(`
      DROP TABLE IF EXISTS weight_tracker;
      DROP TABLE IF EXISTS workout;
      DROP TABLE IF EXISTS session;
      DROP TABLE IF EXISTS routine_exer;
      DROP TABLE IF EXISTS routine;
      DROP TABLE IF EXISTS exercise;
      DROP TABLE IF EXISTS users;
      `)
      console.log('TABLES DROPPED');
      console.log('CREATING TABLES')
    // build tables in correct order
    await client.query(`
      CREATE TABLE users(
         "userId" SERIAL PRIMARY KEY,
         username VARCHAR UNIQUE NOT NULL,
         password VARCHAR NOT NULL DEFAULT '1234',
         hint VARCHAR DEFAULT '1234'
         );
      CREATE TABLE exercise(
          exercise_id SERIAL PRIMARY KEY,
          "exerciseName" VARCHAR(255) NOT NULL,
          "userId" INTEGER,
          UNIQUE ( "userId", "exerciseName" ),
          CONSTRAINT fk_user FOREIGN KEY("userId")
          REFERENCES users("userId") 
          );
      CREATE TABLE routine(
          "routineId" SERIAL PRIMARY KEY,
          "routineName" VARCHAR(255) NOT NULL,
          "userId" INTEGER,
          CONSTRAINT fk_user
          FOREIGN KEY("userId")
          REFERENCES users("userId")
          );
      CREATE TABLE routine_exer(
          "routineId" INTEGER NOT NULL,
          exercise_id INTEGER NOT NULL,
          UNIQUE ("routineId", exercise_id),
          CONSTRAINT fk_routine_exer1
          FOREIGN KEY("routineId")
          REFERENCES routine("routineId"),
          CONSTRAINT fk_routine_exer2
          FOREIGN KEY(exercise_id)
          REFERENCES exercise(exercise_id) 
          );
      CREATE TABLE workout(
          "workoutId" SERIAL PRIMARY KEY,
          "routineId" INTEGER,
          exercise_id INTEGER NOT NULL,
          workout_date DATE NOT NULL DEFAULT CURRENT_DATE,
          reps NUMERIC(4,0) DEFAULT 0,
          total_sets NUMERIC(4,0) DEFAULT 0,
          duration NUMERIC(5,2) DEFAULT 0,
          distance NUMERIC(5,1) DEFAULT 0,
          weight NUMERIC(5,2) DEFAULT 0,
          notes VARCHAR(255),
          session_id INTEGER
          );
      CREATE TABLE weight_tracker(
          "userId" INTEGER,
          weigh_date DATE NOT NULL,
          user_weight NUMERIC(5,2) NOT NULL,
          CONSTRAINT fk_user
          FOREIGN KEY("userId")
          REFERENCES users("userId")
          );
      CREATE TABLE session(
          session_id SERIAL PRIMARY KEY,
          "routineId" INTEGER,
          CONSTRAINT fk_routine_exer1
          FOREIGN KEY("routineId")
          REFERENCES routine("routineId")
          );
    `)
    console.log('TABLES CREATED')
  } catch (error) {
    throw error;
  }
}

async function populateInitialData() {
  try {
      // create useful starting data
      console.log('populating tables');
      await client.query(`
          INSERT INTO users
          (username, password, hint)
          VALUES 
          ('kyle', 'Kory78', 'he is your brother'),
          ('kim', 'kyle924', 'just check the db');
          INSERT INTO users(username)
          VALUES ('test_account');
          INSERT INTO exercise
          ("exerciseName", "userId")
          VALUES
          ('PUSHUPS', 1),
          ('SITUPS', 1),
          ('LUNGES', 1),
          ('PUSHUPS',2),
          ('SITUPS', 2);
          INSERT INTO workout
          (exercise_id, workout_date, reps, total_sets, notes)
          VALUES
          (1, '2020-12-22', 25, 3, 'This is a test' );
          INSERT INTO routine
          ("routineName" , "userId")
          VALUES ('CORE', 1), ('CORE DAY', 2), ('LEG DAY', 1);
          INSERT INTO routine_exer
          ("routineId", exercise_id)
          VALUES
          (1 , 1), (1 , 2),(1 , 3), (2, 4), (2 ,5), (3 , 3);
      `)

  } catch (error) {
    throw error;
  }
}

buildTables()
  .then(populateInitialData)
  .catch(console.error)
  .finally(() => client.end());