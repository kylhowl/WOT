import React, { useState } from 'react';
import { Modal, Button, Form, Col, Row } from 'react-bootstrap';
import { SessionForm } from './index';
import { createSession } from '../api'

var dateFormat = require('dateformat');
var now = new Date();

function AddSession ({exercise , workouts, setWorkouts, setBulletin, user, setUser}) {

    const [ workout_date , setworkout_date ] = useState(dateFormat(now, 'isoDate'));
    const [ show, setShow ] = useState(false);

    const handleShow = () => { console.log(exercise);setShow(true)}
    const handleClose = () => setShow(false);

    const handleSubmit = async (e) => {
        e.persist();
        e.preventDefault();
        console.log('clicked submit');
        const exerArr = [];
        exercise.exercises.map((exer)=> {
            const data = JSON.parse(document.getElementById(`${exer.exerciseName}-routineform`).getAttribute('data'));
            data.workout_date = workout_date;
            exerArr.push(data);
            return exer;
        })
                
        const results =  await createSession(user.userId , exercise.routineId, exerArr);

        console.log('results from createSession' ,results);

        if (Array.isArray(results)) {
        //     const copyWorkouts = [...workouts];
        //     copyWorkouts.push(results);
        //     setWorkouts(copyWorkouts);
            setBulletin(`${exercise.routineName.toUpperCase()} SESSION ADDED SUCCESSFULLY`);
            const copyUser = {...user}
            copyUser.workouts.push(...results)
            setUser(copyUser)
            handleClose();
        } else {
            setBulletin(`SOMETHING WENT WRONG, PLEASE TRY AGAIN`);
            handleClose();
        }

    }


    return (
        <>
        <Button onClick={handleShow}>ADD {exercise.routineName.toUpperCase() } SESSION</Button>

        <Modal show={show} centered={true} backdrop='static' onHide={handleClose} size='lg'>
            <Modal.Header closeButton >
                <Modal.Title >{exercise.routineName.toUpperCase()} Session </Modal.Title>
            </Modal.Header>
            <Modal.Body className='m-2 p-2'>
                <p>Leave unused fields blank.</p>
                <Form >
                    <Form.Group as={Row} className='p-2'>
                        <Form.Label column sm={3}>Workout Date</Form.Label>
                        <Col sm={9}>
                        <Form.Control type='date' required defaultValue={dateFormat(now, 'isoDate')} max={dateFormat(now, 'isoDate')} onChange={(e)=>setworkout_date(e.target.value)} />
                        </Col>
                    </Form.Group>
                {exercise.exercises.map((exer)=> <SessionForm key={exer.exerciseName} exercise={exer}/>)}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button type='submit' onClick={handleSubmit} >ADD WORKOUT </Button>{'  '}
                <Button variant='secondary' onClick={handleClose} > CANCEL </Button>
            </Modal.Footer>
        </Modal>
         </>
    )

};

export default AddSession;