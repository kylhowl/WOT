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
          "exerciseId" SERIAL PRIMARY KEY,
          "exerciseName" VARCHAR(255) NOT NULL,
          "userId" INTEGER,
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
          "exerciseId" INTEGER NOT NULL,
          UNIQUE ("routineId", "exerciseId"),
          CONSTRAINT fk_routine_exer1
          FOREIGN KEY("routineId")
          REFERENCES routine("routineId"),
          CONSTRAINT fk_routine_exer2
          FOREIGN KEY("exerciseId")
          REFERENCES exercise("exerciseId") 
          );
      CREATE TABLE workout(
          "workoutId" SERIAL PRIMARY KEY,
          "routineId" INTEGER,
          "exerciseId" INTEGER NOT NULL,
          workout_date DATE NOT NULL DEFAULT CURRENT_DATE,
          reps NUMERIC(4,0),
          total_sets NUMERIC(3,0),
          duration SMALLINT,
          distance NUMERIC(5,2),
          weight NUMERIC(5,2),
          CONSTRAINT fk_workout
          FOREIGN KEY("routineId")
          REFERENCES routine("routineId"),
          CONSTRAINT fk_workout1
          FOREIGN KEY("exerciseId")
          REFERENCES exercise("exerciseId")
          );
      CREATE TABLE weight_tracker(
          "userId" INTEGER,
          weigh_date DATE NOT NULL,
          user_weight NUMERIC(5,2) NOT NULL,
          CONSTRAINT fk_user
          FOREIGN KEY("userId")
          REFERENCES users("userId")
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
          ('pushups', 1),
          ('situps', 1),
          ('lunges', 1),
          ('pushups',2),
          ('situps', 2);
          INSERT INTO workout
          ("exerciseId", workout_date, reps, total_sets)
          VALUES
          (1, '2020-12-22', 25, 3 );
      `)

  } catch (error) {
    throw error;
  }
}

buildTables()
  .then(populateInitialData)
  .catch(console.error)
  .finally(() => client.end());