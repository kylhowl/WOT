import React, { useEffect, useState } from 'react';
import { Table, OverlayTrigger, Button, Tooltip} from 'react-bootstrap'
import { AddWO } from './index';

var dateFormat = require('dateformat');

const History = ( { workouts }  ) => {


    return (
        <>
        <Table striped bordered hover className='text-center'>
            <thead>
                <tr>
                    <th>DATE</th>
                    <th>REPS</th>
                    <th>SETS</th>
                    <th>DURATION</th>
                    <th>DISTANCE</th>
                    <th>WEIGHT</th>
                    <th>NOTES</th>
                </tr>
            </thead>
            <tbody>
                {workouts.map((wo)=>{
                    return (
                        <tr key={wo.workoutId}>
                            <td>{dateFormat(wo.workout_date,"shortDate")}</td>
                            <td>{wo.reps}</td>
                            <td>{wo.total_sets}</td>
                            <td>{wo.duration} </td>
                            <td>{wo.distance} </td>
                            <td>{wo.weight}</td>
                            <td><OverlayTrigger placement='left' delay={{show:125 , hide: 400 }} overlay={<Tooltip>{wo.notes}</Tooltip>}><Button>Notes</Button></OverlayTrigger></td>
                        </tr>
                    )
                })}
            </tbody>
        </Table>
        </>
    )
}

const Report = ( { exercise, workouts } ) => {

    const [ sortedWorkouts, setSortedWorkouts ] = useState([]);

    useEffect(()=>{
        if (!exercise.routineId) {
            const filterArr = workouts.filter((wo)=>{
                if (wo.exercise_id == exercise.exercise_id) {
                    return wo;
                };
            })
            const sortArr = filterArr.sort((a,b)=> new Date(a.workout_date).getTime() - new Date(b.workout_date).getTime() );
            console.log(sortArr);
            setSortedWorkouts(sortArr)
            }
        },[exercise, workouts]
    );

    return (
    <>
    <h3>{exercise.exerciseName.toUpperCase()}</h3>
    <AddWO exercise={exercise} />
    <br/>
    <br/>
    {sortedWorkouts.length ? <History  workouts={sortedWorkouts}/> : <div>No {exercise.exerciseName} yet. Click ADD WORKOUT to get started.</div> }
    </>
    )
}

export default Report