import '../css/App.css';
import '../css/Table.css';


import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';


import Modal from '../comps/Modal';
import Table from '../comps/Table';
import BookingDialog from '../comps/BookDialog';

import { useApi } from "../helpers/api";


const BuchungsButton = ({ openModal, raumData, raumnr, raumName }) => {
    const data={"nr": raumnr, "name": raumName}
    return (
        <div className="buchung">
            <button onClick={() => openModal(raumData)} className="BuchenButton">Raum Buchen</button>
        </div>
    )
}

const ModalContent = ({ modalData }) => {
    return (
        <BookingDialog roomData={modalData}/>
    )
}



const RoomList =  () => {
    const [ rooms, setRooms] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { fetchWithAuth } = useApi();

    const [modalData, setModalData] = useState(null);
    const [modalClosed, setClosed] = useState(true);
    const openModal = (data) => {
        setClosed(false)
        setModalData(data); // Store passed data in state
        console.log(`setting modal data: ${data}`)
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
        setClosed(true)
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
                        <td><BuchungsButton openModal={openModal} raumData={row} raumnr={row.roomId} raumName={row.name}></BuchungsButton></td>
                    </tr>
                ))}
            />
            <Modal 
                content={<ModalContent  modalData={modalData}/>} 
                modalData={modalData} 
                onClose={closeModal} 
                closed={modalClosed}
            />
        </div>
    )
};


export default RoomList;
