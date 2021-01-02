import React, { useState, useEffect } from 'react';
import { Form, Col } from 'react-bootstrap';


function SessionForm ({ exercise : exer }) {

    const [ reps, setreps ] = useState(null);
    const [ total_sets, settotal_sets ] = useState(null);
    const [ duration, setduration ] = useState(null);
    const [ distance, setdistance ] = useState(null);
    const [ weight, setweight ] = useState(null);
    const [ notes, setnotes ] = useState(null);
    const [ formData, setFormData ] = useState(null)

    useEffect(() => {
        let data = { reps, total_sets, duration, distance, weight, notes, exercise_id: exer.exercise_id, exerciseName : exer.exerciseName};
        setFormData(data);
    },[reps, total_sets, duration, distance, weight, notes, exer.exercise_id, exer.exerciseName ])

    return (
    <div className='border rounded border-primary m-2 p-2' id={`${exer.exerciseName}-routineform`} data={JSON.stringify(formData)}>
    <h5>{exer.exerciseName.toUpperCase()}</h5>
        <Form.Group >
            <Form.Row>
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
                <Form.Label>Exercise Notes</Form.Label>
                <Form.Control type='text' maxLength='255' onChange={(e)=>setnotes(e.target.value)}/>
                </Col>
            </Form.Row>
        </Form.Group>
    </div>
    )
}

export default SessionForm