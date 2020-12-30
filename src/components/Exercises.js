import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Fragment } from 'react-bootstrap';
import AddExercise from './AddExer';
import AddRoutine from './AddRoutine';


const Exercise = ( { exercise, setFeatureEx, setFeatureRoutine } ) => {

return (
    <div>
    <Button variant='link' onClick={ (event) => {
        event.preventDefault()
        setFeatureEx(exercise);
        setFeatureRoutine('');
        console.log(exercise)
        } 
    }>{exercise.exerciseName.toUpperCase()}</Button>
    <br/>
    </div>
)
}

const Routine = ( { routine, setFeatureRoutine, setFeatureEx } ) => {
    return (
    <div>
    <Button variant='link' onClick={ (event) => {
        event.preventDefault()
        setFeatureRoutine(routine)
        setFeatureEx('')
        console.log(routine)
        } 
    }>{routine.routineName.toUpperCase()}</Button>
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
                {exercises.map((exer) => <Exercise key={exer.exercise_id} exercise={exer} setFeatureEx={setFeatureEx} setFeatureRoutine={setFeatureRoutine}/>)}
                <AddExercise userId={user.userId} setExercises={setExercises} exercises={exercises} setBulletin={setBulletin}/>
            </Col>
        </Row>
        <Row>
            <Col className='routines'>
                <h2>ROUTINES</h2>
                {routines.map((r)=> <Routine key={r.routineId} routine={r} setFeatureRoutine={setFeatureRoutine} setFeatureEx={setFeatureEx}/>)}
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
      