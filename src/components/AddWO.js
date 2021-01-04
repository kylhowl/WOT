import React, { useState } from 'react';
import { Modal, Button, Form, Col } from 'react-bootstrap';
import { addWorkout } from '../api';

var dateFormat = require('dateformat');
var now = new Date();

const AddWO = ({exercise, workouts, setWorkouts, user, setUser}) => {

    const [ show, setShow ] = useState(false);
    const [ workout_date, setworkout_date ] = useState(dateFormat(now, 'isoDate'));
    const [ reps, setreps ] = useState();
    const [ total_sets, settotal_sets ] = useState();
    const [ duration, setduration ] = useState();
    const [ distance, setdistance ] = useState();
    const [ weight, setweight ] = useState();
    const [ notes, setnotes ] = useState();
    
    const handleShow = () => setShow(true)
    const handleClose = () => setShow(false)

    const handleSubmit = async (e) => {
        console.log('pressed submit')
        e.persist();
        e.preventDefault();
        const fields = {exercise_id: exercise.exercise_id, workout_date , reps, total_sets, duration, distance, weight, notes}

        const results = await addWorkout(exercise.userId, fields)
        console.log('results from addWO', results);
        if (results.message) {
            delete results.message
            results.exerciseName = exercise.exerciseName;
            const copy = [...workouts];
            copy.push(results);
            setWorkouts(copy);
            const userCopy = {...user};
            userCopy.workouts = copy;
            setUser(userCopy);           
            handleClose() };
    }

    return (
        <>
        <Button onClick={handleShow}>ADD WORKOUT</Button>

        <Modal show={show} centered={true} backdrop='static' onHide={handleClose} size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>{exercise.exerciseName.toUpperCase()} Workout</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Leave unused fields blank.</p>
                <Form >
                    <Form.Row>
                        <Col>
                        <Form.Label>Workout Date</Form.Label>
                        <Form.Control type='date' required defaultValue={dateFormat(now, 'isoDate')} max={dateFormat(now, 'isoDate')} onChange={(e)=>setworkout_date(e.target.value)} />
                        </Col>
                        <Col>
                        <Form.Label>Repetitions</Form.Label>
                        <Form.Control type='number' min='0' onChange={(e)=>setreps(parseInt(e.target.value))}/>
                        </Col>
                        <Col>
                        <Form.Label>Sets</Form.Label>
                        <Form.Control type='number' min='0' onChange={(e)=>settotal_sets(parseInt(e.target.value))}/>
                        </Col>
                        <Col>
                        <Form.Label>Duration</Form.Label>
                        <Form.Control type='number' min='0' onChange={(e)=>setduration(parseInt(e.target.value))}/>
                        </Col>
                        <Col>
                        <Form.Label>Distance</Form.Label>
                        <Form.Control type='number' min='0' onChange={(e)=>setdistance(parseInt(e.target.value))}/>
                        </Col>
                        <Col>
                        <Form.Label>Weight</Form.Label>
                        <Form.Control type='number' min='0' onChange={(e)=>setweight(parseInt(e.target.value))}/>
                        </Col>
                    </Form.Row>
                    <Form.Row>
                        <Col>
                        <Form.Label>Workout Notes</Form.Label>
                        <Form.Control type='text' maxLength='255' onChange={(e)=>setnotes(e.target.value)}/>
                        </Col>
                    </Form.Row>
                </Form> 
            </Modal.Body>
            <Modal.Footer>
                <Button type='submit' onClick={handleSubmit} >ADD WORKOUT </Button>{'  '}
                <Button variant='secondary' onClick={handleClose} > CANCEL </Button>
            </Modal.Footer>
        </Modal>
        </>
    )

}

export default AddWO