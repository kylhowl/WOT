import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap'
import {Title, Login, Exercises, Report, Bulletin, All, Logout } from './index';


// import {  getSomething} from '../api';

const App = () => {
  // const [message, setMessage] = useState('');

  const [ user, setUser ] = useState(JSON.parse(localStorage.getItem('WOT')));
  const [ featureEx , setFeatureEx ] = useState('');
  const [ featureRoutine, setFeatureRoutine ] = useState('');
  const [ workouts, setWorkouts ] = useState([]);
  const [ bulletin, setBulletin ] = useState();

  useEffect(() => {
    if (user) {
      setBulletin(`WELCOME ${user.username.toUpperCase()}!`)
    } else {setBulletin(`PLEASE LOGIN OR REGISTER TO GET STARTED`)}
  }, [user]);

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
    localStorage.setItem('WOT', JSON.stringify(user));
    
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
    <Container className='vh-100 bg-secondary vw-100' fluid >
    <Row className='bg-primary align-items-center appHeader'>
      <Col className='text-center'>  <Title />  </Col>
      <Col xs={5} className='justify-content-end'> {user ? <Logout user={user} setUser={setUser} /> :<Login setUser={setUser} setBulletin={setBulletin} />}  </Col>
    </Row>
    <Row className='appBulletin'>
      <Col className='vw-100'>
        <Bulletin bulletin={bulletin}/>
      </Col>
    </Row>   
    <Row className='exercise-info bg-warning appBody'>
      <Col xs={3}>
        <Exercises user={user} setFeatureEx={setFeatureEx} setFeatureRoutine={setFeatureRoutine} setBulletin={setBulletin} setUser={setUser}/>
      </Col>
      <Col xs={9}>
        {checkUser()}
      </Col>
    </Row>
    <Row className='appFooter'>
      <Col>Footer area</Col>
    </Row>
  </Container>
  </>
  );
}

export default App;