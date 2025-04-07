import '../css/App.css';
import '../css/classes.css';
import { Link, useLocation } from "react-router-dom";
import React, { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";


const UserSection = ({loggedIn, user}) => {
    const {c_logout} = useContext(AuthContext)
    if (loggedIn ){
        return (
            <div>
                {user} 
                <button onClick={c_logout}>Logout</button>
            </div>
        )
    }
}


const BaseLayout = ({ content, title }) => {
    const { c_user } = useContext(AuthContext);
    const { loggedIn } = useContext(AuthContext);
    const location = useLocation();

    return (
        <div className="wrapper">
            <div className="navbar flex-horizontal">
                {location.pathname !== "/" && (
                    <Link to="/">
                        <img src="/back.svg" alt="logo" style={{width: '40px', height: '40px'}} />
                    </Link>
                )}
                {location.pathname === "/" && <div style={{width: '40px'}}></div>}
                <div className="title">
                    { title }
                </div>
                <div></div>
                <UserSection loggedIn={loggedIn} user={c_user}/>
            </div>
            <div className="content">
                { content }
            </div>
        </div>

    );
}

export default BaseLayout;