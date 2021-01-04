import React, { useState } from 'react';
import { Button, Modal, Form, Col, Row} from 'react-bootstrap';

const Register = (props) => {

    const [ show, setShow ] = useState(false)

    const handleShow = () => setShow(true)

    return (
        <>
        <Button onClick={handleShow}>REGISTER</Button>

        <Modal show={show}></Modal>
        </>
    )
}

export default Register;