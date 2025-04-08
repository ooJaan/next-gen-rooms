import '../css/App.css';
import '../css/classes.css';
import { Link, useLocation } from "react-router-dom";
import React, { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";
import NavBar from './NavBar';


const BaseLayout = ({ content, title, actions }) => {
    return (
        <div className="wrapper">
            <NavBar title={title} actions={actions}/>
            <div className="content">
                { content }
            </div>
        </div>
    );
}

export default BaseLayout;