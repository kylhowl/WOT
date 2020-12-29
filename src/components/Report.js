import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap'
import Addworkout, {AddWorkout} from './Update'

const History = ( { exercise, workouts }  ) => {

    useEffect( () => {

    }, [])

    return (
        <Row>

        </Row>
    )
}

const Report = ( { exercise } ) =>

{
    return <>
    <History exercise={exercise}/>
    </>
}

export default Report