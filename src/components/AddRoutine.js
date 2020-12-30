import React, { useState } from 'react';
import { Form, InputGroup, FormControl } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { createRoutine } from '../api'

function AddRoutine ( { userId, setRoutines, exercises, routines, setBulletin } ) {

    const [ show, setShow ] = useState(false);
    const [ newRoutine, setNewRoutine ] = useState('');
    const [ formMessage , setFormMessage ] = useState('')

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.persist();
        for (let routine of routines) {
            console.log('routine ',routine.routineName.toUpperCase(), ' newRoutine', newRoutine.toUpperCase() )
            if (routine.routineName.toUpperCase() === newRoutine.toUpperCase()) {
                setBulletin(`Routine ${newRoutine} Already Exists`);
                handleClose();
                return;
            }
        }
        // run through all the checkboxes to find at least one checked before preceeding
        const checkboxes = document.getElementById('routine_exer_form').getElementsByClassName('form-check-input'); // grabs all the checkboxes in form
        console.log(checkboxes);
        var isChecked = false;
        for (let cb of checkboxes) {
            if (cb.checked) {
                isChecked = true
                break // ends loop on one checked
            }   
        }
        if (!isChecked) { 
            setFormMessage('Must check at least 1 measure!');
            return
            };
        setFormMessage(''); // clears message if it was triggered.

        const exerciseIdArray = [];
        Array.from(checkboxes).map((box) => {
            if (box.checked) { exerciseIdArray.push(parseInt(box.value)) }   
        })
        console.log('exerId array', exerciseIdArray)

        const results = await createRoutine(userId, newRoutine, exerciseIdArray)

        if (results.message) {
            setBulletin(`${newRoutine.toUpperCase()} Routine Created Succesfully!`)
            
            handleClose();
        }
    }
    

    return (
        <>
        <InputGroup size='sm'>
        <FormControl placeholder='ROUTINE NAME' type='text' id='newroutine_input' onChange={(e)=>setNewRoutine(e.target.value)}/>
        <InputGroup.Append>
        <Button onClick={handleShow}>CREATE {newRoutine.toUpperCase()} ROUTINE</Button>
        </InputGroup.Append>
        </InputGroup>

        <Modal show={show} onHide={handleClose} centered={true} backdrop='static'>
            <Modal.Header closeButton>
                <Modal.Title>{newRoutine} ROUTINE CREATION</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Create your {newRoutine} routine by choosing which exercises to include.</p>
                <Form onSubmit={handleSubmit}>
                    <Form.Group id='routine_exer_form' required>
                        <Form.Label>EXERCISES</Form.Label>
                        {exercises.map((exer)=>
                            <Form.Check key={exer.exerciseName} type='checkbox' label={exer.exerciseName.toUpperCase()} className='formCheckboxes' value={exer.exerciseId} />
                        )}
                    </Form.Group>
                    <Button variant='primary' type='submit'>CREATE {newRoutine.toUpperCase()}</Button>
                    <Button variant='secondary' onClick={ handleClose } >CANCEL </Button>
                </Form>
            </Modal.Body>
            <Modal.Footer> {formMessage} </Modal.Footer>
        </Modal>
        </>
    )
}

export default AddRoutine