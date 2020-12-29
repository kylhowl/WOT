import React, { useState } from 'react';
import { Form, FormControl, InputGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { createExercise } from '../api'

// require('dotenv').config();
// const { BASE_URL } = process.env;

const AddExercise = ( { userId, setExercises, exercises, setBulletin} ) => {

    const [ newExercise, setNewExercise ] = useState('');

    const handleClick = async () => {
        
        const results = await createExercise(userId, newExercise);
        console.log(results);
        if (results.message) {
            const copyArray = [...exercises];
            copyArray.push(results.exercise);
            setBulletin(results.message);
            setExercises(copyArray);
            document.getElementById('newexercise_input').value = '';
        }

    }

    return (
        <InputGroup size='sm'>
        <FormControl placeholder='EXERCISE NAME' type='text' id='newexercise_input' onChange={(e)=>setNewExercise(e.target.value)}/>
        <InputGroup.Append>
        <Button onClick={handleClick}>ADD {newExercise.toUpperCase()} EXERCISE</Button>
        </InputGroup.Append>
        </InputGroup>
    )

}

export default AddExercise;