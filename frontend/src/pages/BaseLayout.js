import '../css/App.css';
import { Link } from "react-router-dom";
import React, { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";


const UserSection = ({loggedIn, user}) => {
    console.log("usersection, ", loggedIn)
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
    console.log(c_user, loggedIn)
    return (
        <div className="wrapper">
            <div className="flex-horizontal">
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