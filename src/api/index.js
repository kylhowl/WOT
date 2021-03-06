import axios from 'axios';

// export async function getSomething() {
//   try {
//     const { data } = await axios.get('/api');
//     return data;
//   } catch (error) {
//     throw error;
//   }
// }


// export functions that are used in app for specific calls to routes;
export async function loginUser(info) {
    
    try {
        const { data } = await axios.post(`/api/login`, info);
        
        return data
    } catch (err)
    { throw err}
}

export async function newUser(userFields) {
    try {
        const  { data }  = await axios.post('/api/register', userFields );

        return data; 
    } catch (err) { 
        throw err 
    }
}

// export async function workoutUpdate(data) {
//     try {
//         const results = await axios.patch(`/api/user/${data}/workout/${data}`)
//         return results
//     } catch (err) {
//         throw err
//     }
// }

export async function createExercise(userId, exercise) {

    try {
        const { data } = await axios.post(`/api/user/${userId}/exercise`, { exercise })
        return data;
    } catch (err) {
        throw err
    }
}

export async function createRoutine(userId, routineName, exerciseIds) {
    
    try {
        const { data } = await axios.post(`/api/user/${userId}/routine`, {routineName , exerciseIds});
        return data;
    } catch (err) {
        throw err
    }
}

export async function addWorkout(userId, fields = {}) {
    
    try {
        const { data } = await axios.post(`/api/user/${userId}/workout`, fields);
        return data;
    } catch (err) {
        throw err
    }
}

export async function workoutEdit(workout, fields) {
    console.log('workout', workout)

    try {
        const { data } = await axios.patch(`/api/user/${workout.userId}/workout/${workout.workoutId}`, fields);
        return data
    } catch (err) {
        throw err
    }
}

export async function deleteWorkout(workout, userId) {

    try {
        const { data } = await axios.delete(`/api/user/${userId}/workout/${workout.workoutId}`)
        return data
    } catch (err) {
        throw err
    }
}

export async function createSession(userId, routineId, fields) {
   
    try {
        const { data } = await axios.post(`/api/user/${userId}/routine/${routineId}`, fields)
        return data;
    } catch (err) {
        throw err
    }
}   

export async function updateSession(exerArr, sessionId, userId) {
 
    try {
        const { data } = await axios.patch(`/api/user/${userId}/session/${sessionId}`, exerArr);
        return data
    } catch (err) {
        throw err
    }
}

export async function deleteSession(userId, sessionId) {

    try {
        const { data } = await axios.delete(`/api/user/${userId}/session/${sessionId}`)
        console.log('data?', data)
        return data;
    } catch (err) {
        throw err
    }
}

// try {

// } catch (err) {
//     throw err
// }      <------copy paste try catch