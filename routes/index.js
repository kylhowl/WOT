const apiRouter = require('express').Router();

const { 
  userLogin,
  createUser,
  createExercise,
  createRoutine,
  addWorkout,
  workoutEdit,
  deleteWorkout,
  createSessionDB
} = require('../db');



apiRouter.post('/login', async (req, res, next) => {
  
  const userFields = req.body
  console.log('submission: ', userFields);
  try {
      const user = await userLogin(userFields);
      console.log(user);
      res.send( { user } )
  } catch (err) {
      next(err);
  }
});

apiRouter.post('/register', async (req, res, next) => {

  const userFields = req.body;
  console.log('submission: ', userFields);
  try {
      const user = await createUser(userFields);

     res.send(user);
  } catch (err) {
      next(err);
  }

})

apiRouter.post('/user/:userId/exercise', async (req, res, next) => {
  const { userId } = req.params;
  const { exercise } = req.body;
  
  try {
      const results = await createExercise(userId, exercise)

      res.send(results)
  } catch (err) {
      next(err);
  }
});

apiRouter.post(`/user/:userId/routine`, async (req, res, next) => {
  const { userId } = req.params;
  const { routineName , exerciseIds } = req.body;

  try {
    const results = await createRoutine(userId, routineName, exerciseIds);
    res.send(results);
  } catch (err) {
    next(err)
  }

})

apiRouter.post(`/user/:userId/workout`, async (req, res, next) => {
  const { userId } = req.params;
  const fields = req.body;
  
  try {
    const results = await addWorkout(userId, fields);
    res.send(results);
  } catch (err) {
    next(err)
  }
})

apiRouter.patch(`/user/:userId/workout/:workoutId`, async (req, res, next) => {
  const { userId, workoutId } = req.params;
  const fields = req.body;

  try {
    const results = await workoutEdit(workoutId, userId, fields);
    res.send(results)
  } catch (err) {
    next(err)
  }
})

apiRouter.delete(`/user/:userId/workout/:workoutId`, async (req, res, next) => {
  const { userId, workoutId} = req.params;

  try {
    const results = await deleteWorkout(userId, workoutId);
    res.send(results);
  } catch (err) {
    next(err)
  }
})

apiRouter.post(`/user/:userId/routine/:routineId`, async (req, res, next) => {
  const { userId, routineId } = req.params
  const fields = req.body;
    
  try {
    const results = await createSessionDB(userId, routineId, fields)

    res.send(results)
  } catch (err) {
    next(err)
  }

})

apiRouter.get("/", (req, res, next) => {
  res.send({
    message: "API is under construction!"
  });
});

module.exports = apiRouter;
