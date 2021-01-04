import React , { useState, useEffect, useContext } from 'react';
import { Accordion, Card, Table, OverlayTrigger, Button, Tooltip } from 'react-bootstrap';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import AccordionContext from "react-bootstrap/AccordionContext";
import { EditSession } from './index';

var dateFormat = require('dateformat');

function ContextAwareToggle({ children, eventKey, callback }) {
    const currentEventKey = useContext(AccordionContext);

    const decoratedOnClick = useAccordionToggle( eventKey, () => callback && callback(eventKey));

    const isCurrentEventKey = currentEventKey === eventKey;

    return (
        <button type='button' style={{backgroundColor : isCurrentEventKey ? 'skyblue' : 'grey' , width : '100%'}} onClick={decoratedOnClick} >
            {children}
        </button>
    )

}

function RoutineHistory ({exercise : ex, user , setUser, setBulletin, setFeatureRoutine}) {
    const { workouts } = user;
    const { sessions } = ex;

    const [ sortedSessions, setSortedSessions ] = useState([]);


useEffect(() => {
    console.log('ex?', ex)
    if (sessions.length) {
        const sortArr = [];
        sessions.forEach((id) => {
            const array = workouts.filter((wo)=>{
             return wo.session_id === id
            })
        sortArr.push(array)
        })
        sortArr.sort((a,b)=> new Date(a[0].workout_date).getTime() - new Date(b[0].workout_date).getTime());      
        setSortedSessions(sortArr)
    } else { setSortedSessions([])}

},[ user , sessions, workouts, ex]);

    return (<>
        {sortedSessions.length ? <p>Click date to expand/collapse session.</p> : <p>No sessions to report. Click "ADD {ex.routineName} SESSION" to get started.</p> }
        <Accordion className='bg-warning'>
            {sortedSessions.map((wo, index)=>{
                return (
                    <Card key={wo[0].session_id} className='bg-warning'>
                        <Card.Header>
                            <ContextAwareToggle wo={wo} eventKey={`${index}`} >{`${dateFormat(wo[0].workout_date, 'fullDate')} `}</ContextAwareToggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey={`${index}`}>
                            <Card.Body>
                                <Table striped bordered hover className='text-center'>
                                    <thead>
                                        <tr>
                                            <th><EditSession sessions={wo} user={user} routine={ex} setUser={setUser} setBulletin={setBulletin} setFeatureRoutine={setFeatureRoutine} /></th>
                                            <th>REPS</th>
                                            <th>SETS</th>
                                            <th>DURATION</th>
                                            <th>DISTANCE</th>
                                            <th>WEIGHT</th>
                                            <th>NOTES</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {wo.map((exer)=>{
                                            return (
                                                <tr key={exer.workoutId} style={{backgroundColor : 'lightgray'}}>
                                                    <td>{exer.exerciseName.toUpperCase()}</td>
                                                    <td>{exer.reps}</td>
                                                    <td>{exer.total_sets}</td>
                                                    <td>{exer.duration} </td>
                                                    <td>{exer.distance} </td>
                                                    <td>{exer.weight}</td>
                                                    <td><OverlayTrigger placement='left' delay={{show:125 , hide: 400 }} overlay={<Tooltip>{exer.notes}</Tooltip>}><Button size='sm' variant={exer.notes ? 'primary' : 'secondary'} >Notes</Button></OverlayTrigger></td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                )
            })}
        </Accordion>
    </>)

};

export default RoutineHistory;