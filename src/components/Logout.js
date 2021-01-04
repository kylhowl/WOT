import React from 'react'
import { Button, Row, Col } from 'react-bootstrap';

const Logout = ({user, setUser}) => {

    const handleLogout = () => {
        localStorage.removeItem('WOT');
        setUser('');
    }

    return (
        <Row>
            <Col>
                {user.username.toUpperCase()}
                <br/>
                <p>More info to come at a later time!</p>
            </Col>
            <Col className='d-flex justify-content-end'>
                <Button onClick={handleLogout}>LOGOUT</Button>
            </Col>
        </Row>  
    )
}

export default Logout