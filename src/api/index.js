import axios from 'axios';

export async function getSomething() {
  try {
    const { data } = await axios.get('/api');
    return data;
  } catch (error) {
    throw error;
  }
}


// export functions that are used in app for specific calls to routes;
export async function loginUser(info) {
    
    try {
        const { data } = await axios.post(`/api/login`, info);
        
        return data
    } catch (err)
    { throw err}
}

export async function newUser(data) {
    try {
        const  results  = await axios.post('/api/register', data );

        return results; 
    } catch (err) { 
        throw err 
    }
}

export async function workoutUpdate(data) {
    try {
        const results = await axios.patch(`/api/user/${data}/workout/${data}`)
        return results
    } catch (err) {
        throw err
    }
}

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

    try {
        const { data } = await axios.patch(`/api/user/${workout.userId}/workout/${workout.workoutId}`, fields);
        return data
    } catch (err) {
        throw err
    }
}

export async function deleteWorkout(workout) {

    try {
        const { data } = await axios.delete(`/api/user/${workout.userId}/workout/${workout.workoutId}`)
        return data
    } catch (err) {
        throw err
}
}

// try {

// } catch (err) {
//     throw err
// }      <------copy paste try catch