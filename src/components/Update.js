import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

// require('dotenv').config();

// const { BASE_URL } = process.env;

const Addworkout = ( { workout : { userId, workout, metrics , history, id } } ) => {

    const [ show, setShow ] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const setToday = () => {
        const date = new Date();
        var dd = date.getDate();
        var mm = date.getMonth() + 1;
        var yyyy = date.getFullYear();
        if ( dd < 10 ) { dd = '0' + dd };
        if ( mm < 10 ) { mm = '0' + mm };
        return (yyyy + '-'+ mm +'-'+dd);
    }

    const updateHistory = async (e) => {
        e.preventDefault();
        // console.log("submit clicked");
        const updateObj = { };
        // console.log('metrics:', metrics);
        metrics.map((met)=> {
            // console.log(document.getElementById(met).value)
            updateObj[met] = document.getElementById(met).value;
            return met;
        })
        
        if (!history) { history = []}
        history.push(updateObj);
        const update = { [workout]: { history } };
        const data = {
            method : 'PATCH',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(update)
        }
        console.log(JSON.stringify(update))
        try {
            const res = await fetch(`http://localhost:3000/api/user/${userId}/workout/${id}`, data)
            const results = await res.json();
            console.log(results)
        } catch (err) {
            console.log(err);
            throw (err)
        }

    }

    return (
        <>
        <Button variant='primary' onClick={ handleShow }>Add Workout</Button>

        <Modal show={ show } onHide={ handleClose } 
        aria-labelledby="contained-modal-title-vcenter"
        centered={true} backdrop='static'>
            <Modal.Header closeButton>
                <Modal.Title>Update {workout.toUpperCase()}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={ updateHistory }>
                    <Form.Group id='updateForm'>
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="date" required id='date' defaultValue={setToday()} max={setToday()}/>
                        <Form.Text className="text-muted">
                        Select date of workout.
                        </Form.Text>
                   
                        {metrics.map((met, index) => {
                            if (index === 0) { return ''}
                            return (
                            <div key={met}>
                                <Form.Label>{met.toUpperCase()}</Form.Label>
                                <Form.Control type="text" id={met} required/> 
                            </div>
                            )
                        })}  
                    </Form.Group>
                    <Button variant='primary' type='submit' >Update {workout.toUpperCase()}</Button>
                    <Button variant='secondary' onClick={ handleClose }>Cancel</Button>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                
            </Modal.Footer>
        </Modal>
        </>

    )

}

export default Addworkout