import React, { useEffect, useState } from 'react';
import { Button, Modal, Form} from 'react-bootstrap';
import { newUser } from '../api';

const Register = ({setUser, setBulletin}) => {

    const [ show, setShow ] = useState(false)
    const [ bgColor, setBGColor ] = useState({backgroundColor : 'lightgreen'})
    const [ pwd, setPwd ] = useState('');
    const [ confirm, setConfirm ] = useState('');
    const [ username, setUsername ] = useState('');
    const [ hint, setHint ] = useState('');
    const [ disable, setDisable ] = useState(false);
    const [ message, setMessage ] = useState('');
    const [ bgError, setbgError ] = useState({backgroundColor : 'initial'})

    useEffect(()=>{
        checkPwd()
    },[pwd, confirm])

    const handleShow = () => setShow(true);
    const handleClose = () => {
        setPwd('');
        setConfirm('');
        setUsername('');
        setHint('');
        setShow(false);
    }


    const checkPwd = () => {      
        if (pwd === confirm) {
            setBGColor({backgroundColor : 'lightgreen'})
            setDisable(false);
        } else {
            setBGColor({backgroundColor : 'rgba(255, 0, 0, .3)'})
            setDisable(true)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('clicked submit');
        console.log(username, pwd, hint);
        const user = await newUser({username, pwd, hint});
        console.log(user)
        if (user) {
            setUser(user)
            setBulletin(`WELCOME ${user.username.toUpperCase()}!`)
            handleClose();
        } else { 
            setMessage('Username already exists');
            setbgError({backgroundColor : 'rgba(255, 0, 0, .3)'})
        }
    }

    return (
        <>
        <Button onClick={handleShow}>REGISTER</Button>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                New User Registration
            </Modal.Header>
            <Modal.Body>
                <Form>
                   <Form.Group >
                       <Form.Label>Username</Form.Label>
                       <Form.Control type='text' id='username' value={username} style={bgError} onChange={(e)=>setUsername(e.target.value)} autoComplete='off' required/>
                       <Form.Text>Username must be unique but is case sensitive. If the name is taken consider using a capital letter here and there.</Form.Text>
                    </Form.Group> 
                    <Form.Group >
                        <Form.Label>Password</Form.Label>
                        <Form.Control type='password' id="pwd" placeholder='optional' value={pwd} style={bgColor} onChange={(e)=>setPwd(e.target.value)}/>
                        <Form.Text>Password is optional, default will be 1234 which is prefilled on login form.</Form.Text>
                    </Form.Group>
                    <Form.Group >
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type='password' id='confirmPwd' placeholder='optional' value={confirm} style={bgColor} onChange={(e)=>setConfirm(e.target.value)}/>
                        <Form.Text>Password is optional, default is 1234.</Form.Text>
                    </Form.Group>
                    <Form.Group >
                        <Form.Label>Password Hint</Form.Label>
                        <Form.Control type='text' id='hint' value={hint} placeholder='Something to help you remember your password.' autoComplete='off' onChange={(e)=>setHint(e.target.value)}/>
                        <Form.Text>If you created a password and omit a hint, your hint will be 1234, so please create a hint.</Form.Text>
                    </Form.Group>
                    <Button type='submit' onClick={handleSubmit} disabled={disable} >Submit and Login</Button>
                    {' '}
                    <Button variant='secondary' type='reset' onClick={handleClose}>Cancel</Button>
                    <h3>{message}</h3>
                </Form>
            </Modal.Body>
        </Modal>
        </>
    )
}

export default Register;