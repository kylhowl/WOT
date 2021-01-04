import React from 'react';
import { Form, Button , Col } from 'react-bootstrap';
import { loginUser } from '../api';
import { Register } from './index';


const Login = ({ setUser, setBulletin }) => {

    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = document.getElementById('username-input').value;
        const pwd = document.getElementById('password-input').value;
        
        const results = await loginUser({ username: username, password: pwd });
        
        console.log('results from login', results);
        setUser(results.user)
        setBulletin(`WELCOME ${results.user.username.toUpperCase()}!`)

    }

    return (
    <>
        <Form onSubmit={handleSubmit}>
            <Form.Row className='align-items-center'>
                <Col>
                    <Form.Group className='align-content-end'>
                        <Form.Label style={{color: 'white'}}>Username</Form.Label>
                        <Form.Control id='username-input' type='text' placeholder='Enter username' autoComplete='no'/>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group>
                        <Form.Label style={{color: 'white'}}>Password</Form.Label>
                        <Form.Control id='password-input' type='password' defaultValue={1234} />
                    </Form.Group>
                </Col > 
                <Col xs={2}>
                    <Button className='align-center' type='submit' variant='primary'>LOGIN</Button> 
                </Col>
                <Col xs={2}>
                    <Register setUser={setUser} setBulletin={setBulletin}/>
                </Col>
            </Form.Row>
        </Form>    
    </>
    )
}

export default Login