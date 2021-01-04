import React, {useEffect } from 'react';
import { Table, OverlayTrigger, Button, Tooltip } from 'react-bootstrap';
import { EditEx } from './index';

var dateFormat = require('dateformat');

function All ({ workouts, setWorkouts, setUser, user, setBulletin}) {

    // const [ sortedWorkouts, setSortedWorkouts ] = useState([]);

    useEffect(()=>{
        workouts.sort((a,b)=>  new Date(b.workout_date).getTime() - new Date(a.workout_date).getTime() );
        // setSortedWorkouts(sortArr);
            
        },[workouts]
    );

    return (
        <>
        <h3>WORKOUT HISTORY</h3>
        <Button style={{backgroundColor: 'lightskyblue', color : 'black', border : 'none'}}>SOLO EXERCISES</Button>
        <Button style={{backgroundColor: 'lightgray', color : 'black', border : 'none'}}>ROUTINE EXERCISES</Button>
        {/* { workouts.length ? ( */}
        <Table striped bordered hover className='text-center'>
            <thead>
                <tr>
                <th></th>
                <th>EXERCISE/ROUTINE</th>
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
                        <tr key={wo.workoutId} style={ wo.routineId ? { backgroundColor : 'lightgray'} : {backgroundColor : 'lightskyblue'} }>
                            <td>{wo.routineId ? '' : <EditEx workout={wo} setUser={setUser} setWorkouts={setWorkouts} user={user} setBulletin={setBulletin}/>}</td>
                            <td>{wo.routineId ? `${wo.exerciseName} / ${wo.routineName}`: wo.exerciseName}</td>
                            <td>{dateFormat(wo.workout_date,"shortDate")}</td>
                            <td>{wo.reps}</td>
                            <td>{wo.total_sets}</td>
                            <td>{wo.duration} </td>
                            <td>{wo.distance} </td>
                            <td>{wo.weight}</td>
                            <td><OverlayTrigger placement='left' delay={{show:125 , hide: 400 }} overlay={<Tooltip>{wo.notes}</Tooltip>}><Button size='sm' variant={wo.notes ? 'primary' : 'secondary'} >Notes</Button></OverlayTrigger></td>
                        </tr>
                    )
                })}
            </tbody>
        </Table> 
        {/* : (<div>No workouts yet. Time to sweat.</div> ) }  expand this to have a quick how to. */}
        </>
    )
}

export default All