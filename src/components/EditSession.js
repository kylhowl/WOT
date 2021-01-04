import React, { useState } from 'react';
import { Button, Modal, Form, Col, Row } from 'react-bootstrap';
import { SessionForm } from './index';
import { updateSession, deleteSession } from '../api';

var dateFormat = require('dateformat');
var now = new Date();

function EditSession ({ sessions , routine , user, setUser, setBulletin, setFeatureRoutine }) {

    const [ workout_date , setworkout_date ] = useState(dateFormat(sessions[0].workout_date, 'isoDate'));
    const [ show, setShow ] = useState(false);
    const [ confirm , setConfirm ] = useState(true);

    const session_id = sessions[0].session_id;

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const handleSubmit = async (e) => {
        e.persist();
        e.preventDefault();
        const exerArr = [];
        sessions.map((exer)=> {
            const data = JSON.parse(document.getElementById(`${exer.exerciseName}-routineform`).getAttribute('data'));
            data.workout_date = workout_date;
            exerArr.push(data);
            return exer;
        })
        console.log('submit clicked, exerArr:', exerArr);

        const { workouts , message } = await updateSession(exerArr, session_id, user.userId);
        
        if ( message ) {
            const userCopy = {...user};
            userCopy.workouts = workouts;
            
            setUser(userCopy);
            setBulletin(message);
            handleClose();
        } else {
            setBulletin('UPDATE FAILED, PLEASE TRY AGAIN!');
            handleClose();
        }
    }

    const handleDelete = async () => {
        const results = await deleteSession(user.userId, session_id);
        const { message, routines } = results;

        if ( message ) {
            const userCopy = {...user};
            userCopy.routines = routines;
            const routineCopy = {...routine}
            routineCopy.sessions.forEach((session, index) => {
                if (session === session_id) {
                    routineCopy.sessions.splice(index, 1);    
                }
            })
            
            setBulletin(message);
            setFeatureRoutine(routineCopy);
            setUser(userCopy);
            handleClose();
        } else {
            setBulletin('DELETE FAILED, PLEASE TRY AGAIN!');
            handleClose();
        }
        

    }

    const handleConfirm = (e) => {
        setConfirm(!e.target.checked);
    }

    return (
        <>
        <Button onClick={handleShow}>EDIT SESSION</Button>

        <Modal show={show} centered={true} backdrop='static' onHide={handleClose} size='lg'>
                <Modal.Header closeButton >
                    <Modal.Title >{sessions[0].routineName.toUpperCase()} SESSION </Modal.Title>
                </Modal.Header>
                <Modal.Body className='m-2 p-2'>
                    <p>Leave unused fields blank.</p>
                    <Form >
                        <Form.Group as={Row} className='p-2'>
                            <Form.Label column sm={3}>Session Date</Form.Label>
                            <Col sm={9}>
                            <Form.Control type='date' required defaultValue={workout_date} max={dateFormat(now, 'isoDate')} onChange={(e)=>setworkout_date(e.target.value)} />
                            </Col>
                        </Form.Group>
                    {sessions.map((wo)=> <SessionForm key={wo.exerciseName} exercise={wo}/>)}
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
                {/* <Modal.Footer>
                    <Button type='submit' onClick={handleSubmit} >UPDATE SESSION </Button>{'  '}
                    <Button variant='secondary' onClick={handleClose} > CANCEL </Button>
                </Modal.Footer> */}
            </Modal>
        </>
    )

}

export default EditSession;