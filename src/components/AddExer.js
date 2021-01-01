import React, { useState } from 'react';
import { FormControl, InputGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { createExercise } from '../api'

// require('dotenv').config();
// const { BASE_URL } = process.env;

const AddExercise = ( { userId, setExercises, exercises, setBulletin} ) => {

    const [ newExercise, setNewExercise ] = useState('');

    const handleClick = async () => {
        if (newExercise) {
            var results = await createExercise(userId, newExercise.toUpperCase());
            console.log(results);
            if (results.message) {
                const copyArray = [...exercises];
                copyArray.push(results.exercise);
                setBulletin(results.message);
                setExercises(copyArray);
                setNewExercise('');
                document.getElementById('newexercise_input').value = '';
            } else {
                setBulletin(`${results.error} ${newExercise.toUpperCase()} ALREADY EXISTS!`)
                setNewExercise('');
                document.getElementById('newexercise_input').value = '';
            }
        }

    }

    return (
        <InputGroup size='sm'>
        <FormControl placeholder='EXERCISE NAME' type='text' id='newexercise_input' onChange={(e)=>setNewExercise(e.target.value)}/>
        <InputGroup.Append>
        <Button onClick={handleClick} active={newExercise ? true : false}>ADD {newExercise.toUpperCase()} EXERCISE</Button>
        </InputGroup.Append>
        </InputGroup>
    )

}

export default AddExercise;