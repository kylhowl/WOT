import React, { useEffect, useState } from 'react';
import { AddWO, History, AddSession} from './index';
import { Button } from 'react-bootstrap';


const Report = ( { exercise, workouts, setWorkouts, setUser, user, setBulletin, setFeatureEx, setFeatureRoutine } ) => {

    const [ sortedWorkouts, setSortedWorkouts ] = useState([]);

    useEffect(()=>{
        console.log('passed to report', exercise);
        if (!exercise.routineId) {
            const filterArr = workouts.filter((wo)=>{
                if (wo.exercise_id === exercise.exercise_id) {
                    return wo;
                };
            })
            const sortArr = filterArr.sort((a,b)=> new Date(a.workout_date).getTime() - new Date(b.workout_date).getTime() );
            setSortedWorkouts(sortArr)
            } else {
                console.log('working on it');
            }
        },[exercise, workouts]
    );

    const handleClick = () => {
        setWorkouts(user.workouts)
        setFeatureEx('');
        setFeatureRoutine('');  
            }

    return (
    <>
    <h3>{(exercise.exerciseName || exercise.routineName).toUpperCase()}</h3>
    <Button onClick={handleClick} variant='secondary' >ALL WORKOUTS</Button>
    {'  '}
    {exercise.exerciseName ? <AddWO exercise={exercise} workouts={workouts} user={user} setUser={setUser} setWorkouts={setWorkouts}/> : <AddSession exercise={exercise} workouts={workouts} setWorkouts={setWorkouts} user={user} setUser={setUser} setBulletin={setBulletin}/>}
    <br/>
    <br/>
    {sortedWorkouts.length ? <History workouts={sortedWorkouts} setUser={setUser} setWorkouts={setWorkouts} user={user} setBulletin={setBulletin}/> : <div>No workouts yet. Time to sweat.</div> }
    </>
    )
}

export default Report