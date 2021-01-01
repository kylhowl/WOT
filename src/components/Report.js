import React, { useEffect, useState } from 'react';
import { AddWO, History} from './index';


const Report = ( { exercise, workouts, setWorkouts, setUser, user, setBulletin } ) => {

    const [ sortedWorkouts, setSortedWorkouts ] = useState([]);

    useEffect(()=>{
        if (!exercise.routineId) {
            const filterArr = workouts.filter((wo)=>{
                if (wo.exercise_id === exercise.exercise_id) {
                    return wo;
                }; 
            })
            const sortArr = filterArr.sort((a,b)=> new Date(a.workout_date).getTime() - new Date(b.workout_date).getTime() );
            setSortedWorkouts(sortArr)
            }
        },[exercise, workouts]
    );

    return (
    <>
    <h3>{exercise.exerciseName.toUpperCase()}</h3>
    <AddWO exercise={exercise} workouts={workouts} setWorkouts={setWorkouts}/>
    <br/>
    <br/>
    {sortedWorkouts.length ? <History workouts={sortedWorkouts} setUser={setUser} setWorkouts={setWorkouts} user={user} setBulletin={setBulletin}/> : <div>No workouts yet. Time to sweat.</div> }
    </>
    )
}

export default Report