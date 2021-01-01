import React, { useState, useEffect } from 'react';

function All ({ workouts, setWorkouts, setUser, user, setBulletin }) {

    const [ sortedWorkouts, setSortedWorkouts ] = useState([]);

    useEffect(()=>{
        const sortArr = sortedWorkouts.sort((a,b)=> new Date(a.workout_date).getTime() - new Date(b.workout_date).getTime() );
        setSortedWorkouts(sortArr);
            
        },[ workouts]
    );

    return (
        <>ALL HISTORY</>
    )
}

export default All