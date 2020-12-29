import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { loginUser } from '../api'

// require('dotenv').config();
// const { BASE_URL } = process.env;

const Login = ({ setUser, setBulletin }) => {

    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = document.getElementById('username-input').value;
        const pwd = document.getElementById('password-input').value;
        
        const results = await loginUser({ username: username, password: pwd });
        
        console.log('results from login', results);
        setUser(results.user)
        setBulletin(`Welcome ${results.user.username.toUpperCase()}!`)

    }

    return (
    <Form onSubmit={handleSubmit}>
        <Form.Row>
            <Form.Group>
                <Form.Label>Username</Form.Label>
                <Form.Control id='username-input' type='text' placeholder='Enter username' autoComplete='no'/>
            </Form.Group>
            
            <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control id='password-input' type='password' defaultValue={1234} />
            </Form.Group>
            
            <Button className='h-50 align-bottom' type='submit' variant='primary'>SUBMIT</Button>
        </Form.Row>
    </Form>
    )
}

export default Login