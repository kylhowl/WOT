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
      
      const workouts = await _getWorkouts(user.userId)

      user.workouts=workouts

      const exercises = await _getExercises(user.userId)

      user.exercises = exercises

      const routines = await _getRoutines(user.userId)

      user.routines = routines
      
      const sessions = await _getSessions(user.userId)

      for (let routine of user.routines ) {
        routine.sessions = []
        for ( let session of sessions) {
          if (routine.routineId === session.routineId) {
            routine.sessions.push(session.session_id)
          }
        }
      }


      delete user.password;
      delete user.hint;

      return user; 

  } catch (err) {
      throw err
  }

}

const _getRoutines = async (userId) => {

  try {
    const { rows : routines } = await client.query(`
      SELECT "routineId", "routineName"
      FROM routine
      WHERE "userId"=$1;
    `,[userId]);

    const { rows : routineExer } = await client.query(`
    SELECT * FROM exercise
    NATURAL INNER JOIN routine_exer
    INNER JOIN routine ON routine."routineId" = routine_exer."routineId"
    WHERE routine."userId"=$1;
    `, [userId]);
    
    const routinesArr = [];
    for (let routine of routines) {
      routine.exercises =[];
      for (let exer of routineExer) {
        if ( routine.routineName === exer.routineName) {
          routine.exercises.push({exerciseName : exer.exerciseName, exercise_id : exer.exercise_id})
        }
      }
      routinesArr.push(routine);
    }
    return routinesArr
  } catch (err) {
    throw (err)
  }
}

const _getWorkouts = async (userId) => {

  try { 
    const { rows : workouts } = await client.query(`
    SELECT * FROM exercise
    NATURAL JOIN workout
    LEFT JOIN routine ON routine."routineId" = workout."routineId"
    WHERE exercise."userId"=$1;
    `,[userId]);
      
    return workouts;
  
  } catch (err) {
      throw err
  }
}

const _getExercises = async (userId) => {
  try {
    const { rows : exercises } = await client.query(`
    SELECT * FROM exercise
    WHERE "userId"=$1;
  `, [userId]);

  return exercises;
  } catch (err) {
    throw (err)
  }
}

const _getSessions = async (userId) => {

  try {
    const { rows : sessions } = await client.query(`
    SELECT session_id, "routineId" FROM session
    NATURAL JOIN routine
    WHERE routine."userId" = $1
    `,[userId])

    return sessions
  } catch (err) {
    throw (err)
  };
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

    return { routineId, message : 'Routine created succesfully!'};

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

const createSessionDB = async (userId, routineId, fields) => {
  
  try {
    const { rows :  [ {session_id} = x ]  } = await client.query(`
      INSERT INTO session("routineId")
      VALUES ($1)
      RETURNING session_id;
    `,[routineId]);
    
    const workoutIdsObjArr = await _addSessionWorkouts( fields, routineId, session_id);
    
    const workoutIds = workoutIdsObjArr.map((obj)=> obj.workoutId);
    const results = await _getWorkoutsById(workoutIds);

    return {session_id, results};

  } catch (err) {
    throw(err)
  }
}

const _addSessionWorkouts = async (fields, routineId, session_id) => {
  const keyArray = ["routineId", "exercise_id", "workout_date", "reps", "total_sets", "duration", "distance", "weight", "notes", "session_id"]
  const valueArray = [];
  fields.forEach((wo)=> {
    wo.routineId = routineId;
    wo.session_id = session_id;
    keyArray.forEach((key)=> {
      valueArray.push(wo[key])
    });
  });

  const valueString = fields.map((__,x)=> keyArray.map((_,index)=>`$${(x * keyArray.length)+(index+1)}` ).join(`, `)).join(`), (`)
  
  try {
    const { rows : workoutIds } = await client.query(`
      INSERT INTO workout("routineId", exercise_id, workout_date, reps, total_sets, duration, distance, weight, notes, session_id)
      VALUES (${valueString})
      RETURNING "workoutId";
    `,valueArray)

    
    return workoutIds;

  } catch (err) {
    throw (err);
  }
}

const _getWorkoutsById = async (workoutIds) => {

  const selectValues = workoutIds.map((_,index)=> `$${index+1}`).join(`, `);
  console.log(selectValues)
  
  try {
    const { rows : addWorkouts } = await client.query(`
      SELECT * FROM workout
      NATURAL JOIN exercise
      LEFT JOIN routine ON routine."routineId" = workout."routineId"
      WHERE "workoutId" IN (${selectValues});
    `,workoutIds);

    console.log('addWorkouts', addWorkouts);

    return addWorkouts;
  } catch (err) {
    throw (err) };
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

const updateSessionDB = async (userId, exercises) => {
  const updateColumns = [ 'workout_date', 'reps', 'total_sets', 'duration', 'distance', 'weight', 'notes'];
  const columnString = updateColumns.map((x, index)=> `${x} = $${index+1}`).join(`, `);
  try {
    for ( let exer of exercises ) {
      
      const valueArray = updateColumns.map((str)=> exer[str])
      try {
      await client.query(`
        UPDATE workout
        SET ${columnString}
        WHERE "workoutId" = ${exer.workoutId};
      `, valueArray)
      } catch (err) {
        throw (err)
      }};
  
    const workouts = await _getWorkouts(userId)

    return {workouts , message : 'SESSION UPDATED'};
  } catch (err) {
    throw (err)
  }
}

const deleteSessionDB = async (userId, session_id) => {
  console.log('session', session_id);
  try {
    await client.query(`
      DELETE FROM workout
        WHERE session_id = ${session_id};
      DELETE FROM session
        WHERE session_id = ${session_id};
    `)
  
  const routines = await _getRoutines(userId)
  const sessions = await _getSessions(userId)

  for (let routine of routines ) {
    routine.sessions = []
    for ( let session of sessions) {
      if (routine.routineId === session.routineId) {
        routine.sessions.push(session.session_id)
      }
    }
  }

  return { routines , message : 'SESSION DELETED!'};

  } catch (err) {
    throw (err)
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
  workoutEdit,
  createSessionDB,
  updateSessionDB,
  deleteSessionDB
}