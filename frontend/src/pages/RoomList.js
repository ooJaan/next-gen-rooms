import '../css/App.css';
import '../css/Table.css';


import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';


import Modal from '../comps/Modal';
import Table from '../comps/Table';

import { useApi } from "../helpers/api";


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



const RoomList =  () => {
    const [ rooms, setRooms] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { fetchWithAuth } = useApi();

    const [modalData, setModalData] = useState(null);
    const openModal = (data) => {
        setModalData(data); // Store passed data in state
    };
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await fetchWithAuth("room"); // Replace with actual endpoint
                console.log(response)
                setRooms(response); // Store the response in state
                setLoading(false);
            } catch (err) {
                console.error("Error fetching rooms:", err);
                setError("Failed to load rooms.");
                setLoading(false);
            }
        };

        fetchRooms();
    },[]);

    const closeModal = () => {
        setModalData(null); // Clear modal data to close
    };
    const navigate = useNavigate();
    const handleClick = ( { id } ) => {
        // This will navigate to the "/about" page
        navigate('/overview/'+ id);
    };
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    return (
        <div>
            <Table
                head={
                    <tr>
                        <th>Status</th>
                        <th>Name</th>
                        <th>RaumNr</th>
                        <th>Kapazität</th>
                        <th>Max Buchungsdauer</th>
                        <th className="grow">Austattung</th>
                        <th></th>
                    </tr>
                }
                body={Object.entries(rooms).map(([key, row]) => (
                    <tr key={key} name={key}>
                        <td className={row.status}><div>●</div></td>
                        <td><Link to={`/overview/${row.roomId}`}>{row.name}</Link></td>
                        <td>{row.number}</td>
                        <td>{row.capacity}</td>
                        <td>{row.maxDuration}</td>
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
