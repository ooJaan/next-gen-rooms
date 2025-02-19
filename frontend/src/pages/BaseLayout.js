import '../css/App.css';
import { Link } from "react-router-dom";
import React, { useState } from "react";
import Modal from '../comps/Modal';




const BaseLayout = ({ content, title }) => {
    const [modalData, setModalData] = useState(null);

    const openModal = (data) => {
        setModalData(data); // Store passed data in state
    };

    const closeModal = () => {
        setModalData(null); // Clear modal data to close
    };
    return (
        <div className="wrapper">
            <div className="flex-horizontal">
                <div className="title">
                    { title }
                </div>
                <div></div>
                <div>
                    BUTTON
                    <Link to="/">Home</Link>
                </div>
            </div>
            <div className="content">
                { content }
            </div>
        </div>

    );
}

export default BaseLayout;