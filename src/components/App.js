import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap'
import {Title, Login, Exercises, Report, Bulletin, All} from './index';



import {
  getSomething
} from '../api';

const App = () => {
  const [message, setMessage] = useState('');

  const [ user, setUser ] = useState('');
  const [ featureEx , setFeatureEx ] = useState('');
  const [ featureRoutine, setFeatureRoutine ] = useState('');
  const [ workouts, setWorkouts ] = useState([]);
  const [ bulletin, setBulletin ] = useState('PLEASE LOGIN OR REGISTER TO GET STARTED');

  useEffect(() => {
    getSomething()
      .then(response => {
        setMessage(response.message);
      })
      .catch(error => {
        setMessage(error.message);
      });
  }, []);

  useEffect( ()=> {
    const workoutArray = [];
    if (featureEx) {
      for ( let workout of user.workouts ) {
        if (featureEx.exerciseId === workout.exerciseId) {
          workoutArray.push(workout)
        }
      }
    } else if (featureRoutine) {
      for ( let workout of user.workouts) {
        if (featureRoutine.routineId === workout.routineId) {
          workoutArray.push(workout)
        }
      }
    } else if (user.workouts) { setWorkouts(user.workouts)}
    if (workoutArray.length) {
    setWorkouts(workoutArray)
    }
  }
  , [featureEx, featureRoutine, user.workouts])

  useEffect(()=>{
    localStorage.setItem('user', user);
    
  },[user])

  const checkUser = () => {
    if (!user) { return (<div>LOGIN OR REGISTER TO GET STARTED</div>) } 
          else { return  featureEx || featureRoutine 
          ? <Report exercise={featureEx ? featureEx : featureRoutine} setBulletin={setBulletin} workouts={workouts} setUser={setUser} setWorkouts={setWorkouts} user={user} setFeatureEx={setFeatureEx} setFeatureRoutine={setFeatureRoutine}/>
          :
          <All workouts={workouts} setBulletin={setBulletin} setUser={setUser} setWorkouts={setWorkouts} user={user} />}
  }

  return (
    <>
    <div className="App">
      <h1>Hello, World!</h1>
      <h2>{ message }</h2>
    </div>
    <Container className='vh-100' fluid>
    <Row className='bg-primary'>
      <Col>  <Title />  </Col>
      <Col>  <Login setUser={setUser} setBulletin={setBulletin} />  </Col>
    </Row>
    <Row>
      <Col className='vw-100'>
        <Bulletin bulletin={bulletin}/>
      </Col>
    </Row>   
    <Row className='exercise-info bg-warning'>
      <Col >
        <Exercises user={user} setFeatureEx={setFeatureEx} setFeatureRoutine={setFeatureRoutine} setBulletin={setBulletin} setUser={setUser}/>
      </Col>
      <Col >
        {checkUser()}
      </Col>
    </Row>
    <Row>
      <Col>Footer area</Col>
    </Row>
  </Container>
  </>
  );
}

export default App;