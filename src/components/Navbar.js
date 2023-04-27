import React from 'react'
import { Link } from 'react-router-dom';
import "./Navbar.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFlask } from '@fortawesome/free-solid-svg-icons'

import { useIsAuthenticated } from "@azure/msal-react";
import Profile from './Profile';
import Login from './Login';

const Navbar = (props) => {
    const isAuthenticated = useIsAuthenticated();
    return (
        <nav>
            <Link className="logo" to="/"><FontAwesomeIcon icon={faFlask} />MockSite !</Link>
            <div className="loginstate">
                {!isAuthenticated ? <Login /> : <Profile />}
            </div>
        </nav>
    );
}

export default Navbar