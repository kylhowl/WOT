// Connect to DB
const { Client } = require('pg');
const DB_NAME = 'kylho:Kory78@localhost:5432/exercise-tracker'
const DB_URL = process.env.DATABASE_URL || `postgres://${ DB_NAME }`;
const client = new Client(DB_URL);

// database methods

const _getUser = async (username) => {

  try {
      const { rows : [ user ] } = await client.query(`
          SELECT * FROM users
          WHERE username=$1;
          `, [username]);

      if (!user) {
          throw 'User does not exist'
      };

      return user;

  } catch (err) {
      throw err
  }
};

const getHint = async (username) => {

  try {
      const user = await _getUser(username);

      if (!user) {
          throw 'User does not exist' 
      }

      return user.hint;       

  } catch (err) {
      throw err
  }
}

const userLogin = async ( { username, password } ) => {

  try {
      var user  = await _getUser(username);
      
      if (!user) {
          throw 'User does not exist'
      };

      if (user.password != password) {
          throw 'Incorrect password, do you need your hint?'
      }
      
      user = await _getWorkouts(user)

      delete user.password;
      delete user.hint;

      return user; 

  } catch (err) {
      throw err
  }

}

const _getWorkouts = async (user) => {

    let userId = user.userId;

  try { 
    const { rows : workouts } = await client.query(`
    SELECT * FROM exercise
    NATURAL JOIN workout
    WHERE exercise."userId"=$1;
    `,[userId]);

    const { rows : routines } = await client.query(`
      SELECT "routineId", "routineName"
      FROM routine
      WHERE "userId"=$1;
    `,[userId]);

    const routineIds = routines.map((routine)=> routine.routineId);
    const selectValues = routineIds.map((_,index)=> `$${index+1}`).join(`, `);

    if (selectValues) {

    const { rows : exerciseIds } = await client.query(`
      SELECT exercise_id, "routineId"
      FROM routine_exer
      WHERE "routineId" IN (${selectValues});
    `, routineIds);
    
    for (let routine of routines) {
      routine.exerciseIds = []
      for (let x of exerciseIds) {
        if (x.routineId == routine.routineId) {
          routine.exerciseIds.push(x.exercise_id)
        }
      }
    }
    }

    const { rows : exercises } = await client.query(`
      SELECT * FROM exercise
      WHERE "userId"=$1;
    `, [userId]);
    
    
    user.workouts = workouts;
    user.routines = routines;
    user.exercises = exercises;
    
    return user;
  
  } catch (err) {
      throw err
  }
}

const createExercise = async ( userId, exercise ) => {
    
  try {
      const { rows : [newEx] } = await client.query(`
        INSERT INTO exercise("exerciseName", "userId")
        VALUES ($1, $2)
        ON CONFLICT ("exerciseName", "userId") DO NOTHING
        RETURNING *;
      `,[ exercise, userId ]);

      if (newEx) {
      return { message: 'Exercise created successfully',
        exercise : newEx }
      } else { return { error: 'ERROR! DUPLICATE EXERCISE NAME!'}};
  } catch (err) {
      throw err     
  }
}

const createRoutine = async ( userId, routineName, exerciseIds) => {

  try {
    const { rows : [routineId]} = await client.query(`
      INSERT INTO routine("routineName", "userId")
      VALUES ($1, $2)
      RETURNING "routineId";
    `,[routineName, userId]);

    const insertValues = exerciseIds.map(( _, index ) => `$1, $${index+2}`).join(`), (`);
    await client.query(`
      INSERT INTO routine_exer("routineId", exercise_id)
      VALUES (${insertValues});
    `,[routineId.routineId,...exerciseIds]);

    return { routineName, routineId: routineId.routineId, exerciseIds, message : 'Routine created succesfully!'};

  } catch (err) {
    throw err
  }
}

const addWorkout = async (userId, fields = {}) => {
  
  const insertColumns = Object.keys(fields).join(`, `);
  const insertValues = Object.values(fields);
  const insertString = insertValues.map((_,index)=>`$${index+1}`).join(`, `);
    
  try {
      const { rows: [workout] } = await client.query(`
        INSERT INTO workout(${insertColumns})
        VALUES (${insertString})
        RETURNING *;
      `,insertValues);      

      workout.userId = userId;
      workout.message = 'Workout updated successfully';
  return workout    
  } catch (err) {
      throw err
  }
}

const workoutEdit = async (workoutId, userId, fields) => {

  const updateString = Object.keys(fields).map((key, index)=> `${key} = $${index+1}`).join(`, `);
  
  try {
    const { rows : [workout] } = await client.query(`
      UPDATE workout
        SET ${updateString}
        WHERE "workoutId"=${workoutId}
        RETURNING *;
    `,Object.values(fields));

    const { rows : workouts } = await client.query(`
    SELECT * FROM exercise
    NATURAL JOIN workout
    WHERE exercise."userId"=$1;
    `,[userId]);

    return workouts

  } catch (err) {
    throw err
  }
}

const deleteWorkout = async (userId, workoutId) => {
  console.log('userId', userId, ' workoutId', workoutId)
  try {
    await client.query(`
      DELETE FROM workout
      WHERE "workoutId"=${workoutId};
    `)
  
    const { rows : workouts } = await client.query(`
    SELECT * FROM exercise
    NATURAL JOIN workout
    WHERE exercise."userId"=$1;
    `,[userId]);

    return workouts

  } catch (err) {
    throw err
  }
}

// build this dynamically so password and hint can be ommitted;
const createUser = async (fields = {}) => {
  const { username, password, hint } = fields
  try {
      const {rows : user } = await client.query(`
          INSERT INTO users(username, password, hint)
          VALUE ($1,$2,$3)
          RETURNING username, id;
      `,[username, password, hint])

      return user;
  } catch (err) {
      throw err
  }
}

module.exports = {
  client,
  addWorkout,
  createExercise,
  createRoutine,
  deleteWorkout,
  getHint,
  userLogin,
  createUser,
  workoutEdit
}