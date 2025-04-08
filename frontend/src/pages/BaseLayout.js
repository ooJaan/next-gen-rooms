import '../css/App.css';
import '../css/classes.css';
import { Link, useLocation } from "react-router-dom";
import React, { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";
import NavBar from './NavBar';


const BaseLayout = ({ content, title }) => {
    const { c_user } = useContext(AuthContext);
    const { loggedIn } = useContext(AuthContext);
    const location = useLocation();

    return (
        <div className="wrapper">
            <NavBar title={title}/>
            <div className="content">
                { content }
            </div>
        </div>

    );
}

export default BaseLayout;