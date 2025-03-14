import '../css/App.css';
import '../css/Table.css';

import data from '../data/rooms.json'

import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';

import Modal from '../comps/Modal';
import Table from '../comps/Table';


const BuchungsButton = ({ openModal, raumnr }) => {
    return (
        <div className="buchung">
            <button onClick={() => openModal(raumnr)} className="BuchenButton">Raum Buchen</button>
        </div>
    )
}

const ModalContent = ({ modalData }) => {
    return (
        <div>
            <h2>Raum Buchen</h2>
            <p><strong>Data:</strong> {modalData}</p>
            <form>
                <label>Email:</label>
                <input type="email" placeholder="Enter email" required />
                <label>Password:</label>
                <input type="password" placeholder="Enter password" required />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}



const RoomList = () => {
    const [modalData, setModalData] = useState(null);
    const openModal = (data) => {
        setModalData(data); // Store passed data in state
    };

    const closeModal = () => {
        setModalData(null); // Clear modal data to close
    };
    const navigate = useNavigate();
    const handleClick = ( { id } ) => {
        // This will navigate to the "/about" page
        navigate('/overview/'+ id);
    };
    return (
        <div>
            <Table
                head={
                    <tr>
                        <th>Status</th>
                        <th>Name</th>
                        <th>RaumNr</th>
                        <th>Kapazität</th>
                        <th className="grow">Austattung</th>
                        <th></th>
                    </tr>
                }
                body={data.map((row) => (
                    <tr key={row.RaumNr}>
                        <td className={row.status}><div>●</div></td>
                        <td><Link to={`/overview/${row.roomId}`}>{row.name}</Link></td>
                        <td>{row.number}</td>
                        <td>{row.capacity}</td>
                        <td>{row.Auststattung}</td>
                        <td><BuchungsButton openModal={openModal} raumnr={row.roomId}></BuchungsButton></td>
                    </tr>
                ))}
            />
            <Modal content={<ModalContent  modalData={modalData}/>} modalData={modalData} onClose={closeModal} />
        </div>
    )
};


export default RoomList;
