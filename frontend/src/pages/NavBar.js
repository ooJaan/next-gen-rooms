import '../css/NavBar.css';
import '../css/classes.css';
import { Link, useLocation } from "react-router-dom";
import React, { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";

const UserSection = ({loggedIn, user}) => {
    const {c_logout, c_role} = useContext(AuthContext)
    if (loggedIn ){
        return (
            <div className='nav-user'>
                <button className='user-button'>
                    {user}
                </button>
                <div className='user-dropdown'>
                    <Link to="/change-pw">Passwort ändern</Link>
                    <Link to="/my-bookings">Meine Buchungen</Link>
                    <Link to="/logout">Logout</Link>
                    {c_role === "Administrator" && <Link to="/users">Benutzer verwalten</Link>}
                </div>
            </div>
        )
    }
}

const BackButton = () => {
    return (
        <Link className='back' to="/">
            <svg className="back" height="40px" width="40px" version="1.1" viewBox="0 0 26.676 26.676">
                <g>
                    <path d="M26.105,21.891c-0.229,0-0.439-0.131-0.529-0.346l0,0c-0.066-0.156-1.716-3.857-7.885-4.59
                        c-1.285-0.156-2.824-0.236-4.693-0.25v4.613c0,0.213-0.115,0.406-0.304,0.508c-0.188,0.098-0.413,0.084-0.588-0.033L0.254,13.815
                        C0.094,13.708,0,13.528,0,13.339c0-0.191,0.094-0.365,0.254-0.477l11.857-7.979c0.175-0.121,0.398-0.129,0.588-0.029
                        c0.19,0.102,0.303,0.295,0.303,0.502v4.293c2.578,0.336,13.674,2.33,13.674,11.674c0,0.271-0.191,0.508-0.459,0.562
                        C26.18,21.891,26.141,21.891,26.105,21.891z"/>
                </g>
            </svg>
        </Link>
    )
}

const NavBar = ({ content, title, actions }) => {
    const { c_user } = useContext(AuthContext);
    const { loggedIn } = useContext(AuthContext);
    const location = useLocation();


    return (
        <div className="nav-container">
            <div className="nav-left">
                {location.pathname !== "/" && (
                    <BackButton />
                )}
                <div className="room-container">
                <h1>{title}</h1>
                    <img src="/logo.svg" className="nav-logo"/>
                </div>
            </div>
            
            <div className="actions">
                {actions}
            </div>
            <UserSection loggedIn={loggedIn} user={c_user}/>
        </div>
    );
}

export default NavBar;