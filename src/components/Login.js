import React from 'react';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons'
import Button from 'react-bootstrap/Button';

const Login = () => {
    const { instance } = useMsal();

    const navigate = useNavigate();
    const loginWithAzureAD = () => {
        instance.loginPopup(loginRequest).catch((e) => {
            console.log(e);
        });
        navigate("/");
    };
    return (
        <Button onClick={loginWithAzureAD}>
            <FontAwesomeIcon icon={faArrowRightToBracket} /> Azure ADでログイン
        </Button>
    )
}

export default Login