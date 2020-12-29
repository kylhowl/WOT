import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Fragment } from 'react-bootstrap';
import AddExercise from './AddExer';
import AddRoutine from './AddRoutine';


const Exercise = ( { workout, setFeatureEx } ) => {

return (
    <div>
    <Button variant='link' onClick={ (event) => {
        event.preventDefault()
        setFeatureEx(workout)
        console.log(workout)
        } 
    }>{workout.toUpperCase()}</Button>
    <br/>
    </div>
)
}

const Routine = ( { routine, setFeatureRoutine } ) => {
    return (
    <div>
    <Button variant='link' onClick={ (event) => {
        event.preventDefault()
        setFeatureRoutine(routine)
        console.log(routine)
        } 
    }>{routine.toUpperCase()}</Button>
    <br/>
    </div>
    )
}



const Exercises = ( { user, setFeatureEx, setFeatureRoutine, setBulletin } ) => {

    const [ exercises , setExercises ] = useState([]);
    const [ routines, setRoutines ] = useState([]);
    

    useEffect(()=>{
        if (user) {
            setExercises(user.exercises);
            setRoutines(user.routines)
        }
    },[user])
    
    if (user) {
        
    return (
        <>
        <Row>
            <Col className='exercises'>
                <h2>EXERCISES</h2>  
                {exercises.map((exer) => <Exercise key={exer.exerciseId} workout={exer.exerciseName} setFeatureEx={setFeatureEx}/>)}
                <AddExercise userId={user.userId} setExercises={setExercises} exercises={exercises} setBulletin={setBulletin}/>
            </Col>
        </Row>
        <Row>
            <Col className='routines'>
                <h2>ROUTINES</h2>
                {routines.map((r)=> <Routine key={r.routineId} routine={r.routineName} setFeatureRoutine={setFeatureRoutine}/>)}
                <AddRoutine userId={user.userId} setRoutines={setRoutines} routines={routines} exercises={exercises} setBulletin={setBulletin}/>
            </Col>
        </Row>
        </>
    )
    } else {
        return <div className='default-user'>PLEASE LOGIN TO SEE EXERCISES</div>
    }
}

export default Exercises 
      