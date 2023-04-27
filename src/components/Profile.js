import React, { useEffect } from 'react';
import { useState } from 'react';
import { useMsal } from "@azure/msal-react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { loginRequest } from '../authConfig';
import { callMsGraph } from '../graph';
//import Button from 'react-bootstrap/Button';

const Profile = () => {
    const { instance, accounts } = useMsal();
    const [prof, setProf] = useState("loading...");
    const [graphData, setGraphData] = useState(null);
    const [token, setToken] = useState();

    useEffect(() => {
        if (accounts && accounts[0]) {
            // Silently acquires an access token which is then attached to a request for MS Graph data
            instance
                .acquireTokenSilent({
                    ...loginRequest,
                    account: accounts[0],
                })
                .then((response) => {
                    setToken(response.accessToken);
                    callMsGraph(response.accessToken).then((response) => setGraphData(response));
                })
                .then(setProf(accounts[0].name));
        }
    }, [accounts, instance]);

    const logout = () => {
        instance.logoutPopup({
            postLogoutRedirectUri: "/",
            mainWindowRedirectUri: "/",
        });
    };

    return (
        <>
            <DropdownButton id="dropdown-basic-button" title={
                <span className='profile-box'>
                    <FontAwesomeIcon icon={faUser} />{" " + prof}
                </span>
            }>
                <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
            </DropdownButton>
        </>
    );
}

export default Profile