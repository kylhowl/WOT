import React, { useState, useEffect } from 'react';
import { Form, Col } from 'react-bootstrap';


function SessionForm ({ exercise : exer  }) {

    const [ reps, setreps ] = useState(exer.reps);
    const [ total_sets, settotal_sets ] = useState(exer.total_sets);
    const [ duration, setduration ] = useState(exer.duration);
    const [ distance, setdistance ] = useState(exer.distance);
    const [ weight, setweight ] = useState(exer.weight);
    const [ notes, setnotes ] = useState(exer.notes);
    const [ formData, setFormData ] = useState();

    useEffect(() => {
        let data = { reps, total_sets, duration, distance, weight, notes, exercise_id: exer.exercise_id, exerciseName : exer.exerciseName, workoutId: exer.workoutId };
        setFormData(data);
    },[reps, total_sets, duration, distance, weight, notes, exer.exercise_id, exer.exerciseName, exer.workoutId ])

    return (
    <div className='border rounded border-primary m-2 p-2' id={`${exer.exerciseName}-routineform`} data={JSON.stringify(formData)}>
    <h5>{exer.exerciseName.toUpperCase()}</h5>
        <Form.Group >
            <Form.Row>
                <Col>
                <Form.Label>Repetitions</Form.Label>
                <Form.Control type='number' min='0' defaultValue={reps || 0} onChange={(e)=>setreps(parseInt(e.target.value))}/>
                </Col>
                <Col>
                <Form.Label>Sets</Form.Label>
                <Form.Control type='number' min='0' defaultValue={total_sets || 0} onChange={(e)=>settotal_sets(parseInt(e.target.value))}/>
                </Col>
                <Col>
                <Form.Label>Duration</Form.Label>
                <Form.Control type='number' min='0' defaultValue={duration || 0} step={0.01} onChange={(e)=>setduration(parseInt(e.target.value))}/>
                </Col>
                <Col>
                <Form.Label>Distance</Form.Label>
                <Form.Control type='number' min='0' defaultValue={distance || 0} step={0.1} onChange={(e)=>setdistance(parseInt(e.target.value))}/>
                </Col>
                <Col>
                <Form.Label>Weight</Form.Label>
                <Form.Control type='number' min='0' defaultValue={weight || 0} step={0.25} onChange={(e)=>setweight(parseInt(e.target.value))}/>
                </Col>
            </Form.Row>
            <Form.Row>
                <Col>
                <Form.Label>Exercise Notes</Form.Label>
                <Form.Control type='text' maxLength='255' defaultValue={notes} onChange={(e)=>setnotes(e.target.value)}/>
                </Col>
            </Form.Row>
        </Form.Group>
    </div>
    )
}

export default SessionForm