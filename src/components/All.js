import React, { useState, useEffect } from 'react';
import { Table, OverlayTrigger, Button, Tooltip } from 'react-bootstrap';
import { EditEx } from './index';

var dateFormat = require('dateformat');

function All ({ workouts, setWorkouts, setUser, user, setBulletin}) {

    const [ sortedWorkouts, setSortedWorkouts ] = useState([]);

    useEffect(()=>{
        const sortArr = sortedWorkouts.sort((a,b)=> new Date(a.workout_date).getTime() - new Date(b.workout_date).getTime() );
        setSortedWorkouts(sortArr);
            
        },[ workouts]
    );

    return (
        <>
        <h3>ALL WORKOUTS</h3>
        <br/>
        <Table striped bordered hover className='text-center'>
            <thead>
                <tr>
                <th></th>
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
                        <tr key={wo.workoutId} style={ wo.routineID ? { backgroundColor : 'lightgray'} : {backgroundColor : 'lightskyblue'} }>
                            <td><EditEx workout={wo} setUser={setUser} setWorkouts={setWorkouts} user={user} setBulletin={setBulletin}/></td>
                            <td>{dateFormat(wo.workout_date,"shortDate")}</td>
                            <td>{wo.reps}</td>
                            <td>{wo.total_sets}</td>
                            <td>{wo.duration} </td>
                            <td>{wo.distance} </td>
                            <td>{wo.weight}</td>
                            <td><OverlayTrigger placement='left' delay={{show:125 , hide: 400 }} overlay={<Tooltip>{wo.notes}</Tooltip>}><Button size='sm'>Notes</Button></OverlayTrigger></td>
                        </tr>
                    )
                })}
            </tbody>
        </Table>
        </>
    )
}

export default All