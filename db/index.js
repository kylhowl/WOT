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
      console.log('getting workouts');
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
      const { rows : single_workouts } = await client.query(`
      SELECT * FROM exercise
      NATURAL JOIN workout
      WHERE "routineId" is null AND exercise."userId"=$1;
      `,[userId]);

      const { rows : routine_workouts } = await client.query(`
      SELECT * FROM exercise
      NATURAL JOIN workout
      WHERE "routineId" IS NOT NULL AND exercise."userId"=$1;
      `,[userId]);

      const { rows : routines } = await client.query(`
        SELECT "routineId", "routineName"
        FROM routine
        WHERE "routineId"=$1;
      `,[userId]);

      const { rows : exercises } = await client.query(`
        SELECT * FROM exercise
        WHERE "userId"=$1;
      `, [userId]);

    user.single_workouts = single_workouts;
    user.routine_workouts = routine_workouts;
    user.routines = routines;
    user.exercises = exercises;
    
    return user;
  
  } catch (err) {
      throw err
  }
}

const createExercise = async ( userId, exercise ) => {
    
  try {
      const { rows : [newEx] } =await client.query(`
        INSERT INTO exercise("exerciseName", "userId")
        VALUES ($1, $2)
        RETURNING *;
      `,[ exercise, userId ]);

      return { message: 'Exercise created successfully',
        exercise : newEx };
  } catch (err) {
      throw err     
  }
}

const updateWorkout = async (userId, id, history) => {

  try {
      await client.query(`
          UPDATE workouts
          SET history=$1
          WHERE "userId"=${userId} AND id=${id};
      `,[history]);      

  return {
      message: 'Workout updated successfully'
  }        
  } catch (err) {
      throw err
  }
}

const deleteWorkout = async (id) => {

  try {
      await client.query(`
          DELETE FROM workouts
          WHERE id=${id};
      `)

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
  updateWorkout,
  createExercise,
  deleteWorkout,
  getHint,
  userLogin,
  createUser
}