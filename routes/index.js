const apiRouter = require('express').Router();

const { 
  userLogin,
  createUser,
  createExercise,
  updateWorkout
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

apiRouter.get("/", (req, res, next) => {
  res.send({
    message: "API is under construction!"
  });
});

module.exports = apiRouter;
