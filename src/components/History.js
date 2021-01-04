import React from 'react';
import { Table, OverlayTrigger, Button, Tooltip } from 'react-bootstrap'
import { EditEx } from './index';

var dateFormat = require('dateformat');


function History ({ workouts, setUser, setWorkouts, user, setBulletin }) {
  

    return (
        <>
        <Table striped bordered hover className='text-center' size='sm'>
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
                        <tr key={wo.workoutId} style={{backgroundColor : 'lightskyblue'}}>
                            <td><EditEx workout={wo} setUser={setUser} setWorkouts={setWorkouts} user={user} setBulletin={setBulletin}/></td>
                            <td>{dateFormat(wo.workout_date,"shortDate")}</td>
                            <td>{wo.reps}</td>
                            <td>{wo.total_sets}</td>
                            <td>{wo.duration} </td>
                            <td>{wo.distance} </td>
                            <td>{wo.weight}</td>
                            <td><OverlayTrigger placement='left' delay={{show:125 , hide: 400 }} overlay={<Tooltip>{wo.notes}</Tooltip>}><Button size='sm' variant={wo.notes ? 'primary' : 'secondary'}>Notes</Button></OverlayTrigger></td>
                        </tr>
                    )
                })}
            </tbody>
        </Table>

        </>
    )

}

export default History