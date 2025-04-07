import '../css/NavBar.css';
import '../css/classes.css';
import { Link, useLocation } from "react-router-dom";
import React, { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";

const UserSection = ({loggedIn, user}) => {
    const {c_logout} = useContext(AuthContext)
    if (loggedIn ){
        return (
            <div className='nav-user'>
                <p>{user}</p> 
                <button className='logout-button' onClick={c_logout}>Logout</button>
            </div>
        )
    }
}

const NavBar = ({ content, title }) => {
    const { c_user } = useContext(AuthContext);
    const { loggedIn } = useContext(AuthContext);
    const location = useLocation();


    return (
        <div class="nav-container">
            {location.pathname !== "/" && (
                <Link className='back' to="/">
                    <img src="/back.svg" alt="logo" style={{width: '40px', height: '40px'}} />
                </Link>
            )}
            <div class="room-container">
            <h1>{title}</h1>
            <img src="/logo.svg" className="nav-logo"/>
            </div>
            <UserSection loggedIn={loggedIn} user={c_user}/>
        </div>
    );
}

export default NavBar;