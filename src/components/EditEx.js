import React, { useState } from 'react';
import { Row, Col, Modal, Button, Form} from 'react-bootstrap';
import { workoutEdit, deleteWorkout} from '../api';

var dateFormat = require('dateformat');
var now = new Date();

const EditEx = ({ workout, setWorkouts, user, setUser, setBulletin }) => {

    const [ show, setShow ] = useState(false);
    const [ workout_date, setworkout_date ] = useState(dateFormat(workout.workout_date, 'isoDate'));
    const [ reps, setreps ] = useState(workout.reps);
    const [ total_sets, settotal_sets ] = useState(workout.total_sets);
    const [ duration, setduration ] = useState(workout.duration);
    const [ distance, setdistance ] = useState(workout.distance);
    const [ weight, setweight ] = useState(workout.weight);
    const [ notes, setnotes ] = useState(workout.notes);
    const [ confirm, setConfirm ] = useState(true);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const handleSubmit = async (e) => {
        e.persist();
        e.preventDefault();
        const editWO = { workout_date, reps, total_sets, duration, distance, weight, notes }
        const results = await workoutEdit(workout, editWO)

        if (results) {
            setWorkouts(results);
            const copyUser = user;
            copyUser.workouts = results;
            setUser(copyUser);
            setBulletin(`${workout.exerciseName} WORKOUT UPDATED SUCCESSFULLY!`);
            handleClose();
        } else {
            setBulletin(`UPDATE FAILED, PLEASE TRY AGAIN!`);
            handleClose();
        }

    }

    const handleConfirm = (e) => {
        setConfirm(!e.target.checked);
    }

    const handleDelete = async () => {
        const results = await deleteWorkout(workout);
        if (results) {
            setWorkouts(results);
            handleClose();
            const copyUser = user;
            copyUser.workouts = results;
            setUser(copyUser);
            setBulletin(`${workout.exerciseName} WORKOUT DELETED SUCCESSFULLY!`);
            
        } else {
            setBulletin(`DELETE FAILED, PLEASE TRY AGAIN!`);
            handleClose();
        }
    }

    return (
        <>
        <Button size='sm' onClick={handleShow}>Edit</Button>

        <Modal show={show} centered={true} backdrop='static' onHide={handleClose} size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>EDIT {workout.exerciseName} WORKOUT</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form >
                    <Form.Row>
                        <Col>
                        <Form.Label>Workout Date</Form.Label>
                        <Form.Control type='date' required value={workout_date} max={dateFormat(now, 'isoDate')} onChange={(e)=>setworkout_date(e.target.value)} />
                        </Col>
                        <Col>
                        <Form.Label>Repetitions</Form.Label>
                        <Form.Control type='number' min='0' value={reps|| 0} onChange={(e)=>setreps(parseInt(e.target.value))}/>
                        </Col>
                        <Col>
                        <Form.Label>Sets</Form.Label>
                        <Form.Control type='number' min='0' value={total_sets || 0} onChange={(e)=>settotal_sets(parseInt(e.target.value))}/>
                        </Col>
                        <Col>
                        <Form.Label>Duration</Form.Label>
                        <Form.Control type='number' min='0' value={duration || 0} onChange={(e)=>setduration(parseInt(e.target.value))}/>
                        </Col>
                        <Col>
                        <Form.Label>Distance</Form.Label>
                        <Form.Control type='number' min='0' value={distance || 0} onChange={(e)=>setdistance(parseInt(e.target.value))}/>
                        </Col>
                        <Col>
                        <Form.Label>Weight</Form.Label>
                        <Form.Control type='number' min='0' value={weight || 0} onChange={(e)=>setweight(parseInt(e.target.value))}/>
                        </Col>
                    </Form.Row>
                    <Form.Row>
                        <Col>
                        <Form.Label>Workout Notes</Form.Label>
                        <Form.Control type='text' maxLength='255' value={notes || ''} onChange={(e)=>setnotes(e.target.value)}/>
                        </Col>
                    </Form.Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Row className='w-100 justify-content-around'>
                    <Col style={{display: 'flex', justifyContent : 'space-around'}}>
                        <Button type='submit' onClick={handleSubmit}>SAVE CHANGES</Button>
                        <Button variant='secondary' onClick={handleClose}>CANCEL</Button>
                    </Col>
                    <Col style={{display: 'flex', justifyContent : 'space-around'}}>
                        <Form.Group controlId='confirmDelete'>
                            <Form.Check type='checkbox' id='confirm_deleteCB' label='Confirm Delete' onChange={handleConfirm}/>
                        </Form.Group>
                        <Button variant='danger' disabled={confirm} onClick={handleDelete} >DELETE RECORD</Button>
                    </Col>
                </Row>
            </Modal.Footer>
        </Modal>
        </>
    )

}

export default EditEx