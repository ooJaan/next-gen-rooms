import '../css/App.css';
import '../css/Table.css';

import data from '../data/rooms.json'

import React, { useState } from "react";
import Modal from '../comps/Modal';


const RoomList = () => {
    return (
        <div className="RoomList">
            <RoomListHeader></RoomListHeader>
            <RoomListElem></RoomListElem>
            <RoomListElem></RoomListElem>
        </div>

    )
}
const BuchungsButton = ({ openModal, raumnr }) => {

    return (
        <div className="buchung">
            <button onClick={() => openModal(raumnr)} className="BuchenButton">Raum Buchen</button>
        </div>
    )
}

const RoomTableElem = () => {
    return (
        <tr>
            <td><div>●</div></td>
            <td><div>namee</div></td>
            <td><div>1334</div></td>
            <td><div>Lehrsaal</div></td>
            <td><div>32</div></td>
            <td className="aus"><div>Beamer, Laptop</div></td>
        </tr>
    )
}

const RoomListHeader = () => {
    return (
        <div>
            <div>Status</div>
            <div className="Name">Name</div>
            <div>Raumnr</div>
            <div>Kapazität</div>
            <div className="Austattung">Ausstattung</div>
        </div>
    )
}

const RoomListElem = () => {
    return (
        <div>
            <div>●</div>
            <div className="Name">Name</div>
            <div>Raumnr</div>
            <div>Kapazität</div>
            <div className="Austattung">Ausstattung</div>
            <BuchungsButton></BuchungsButton>
        </div>
    )
}
const ModalContent = ( {modalData} ) => {
    return (
        <div>
            <h2>Login</h2>
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


const Table = () => {
    const [modalData, setModalData] = useState(null);
    const openModal = (data) => {
        setModalData(data); // Store passed data in state
    };

    const closeModal = () => {
        setModalData(null); // Clear modal data to close
    };
    /*
    const data = [
        { status: "booked", name: "oberer ganeg", RaumNr: "c32", capacity: "13", Auststattung: ["Beamer", "Computer"] },
        { status: "free", name: "oberer ganeg", RaumNr: "c31", capacity: "13", Auststattung: ["Beamer", "Computer"] },
    ];
    */


    return (
        <div>
            <table className="custom-table">
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Name</th>
                        <th>RaumNr</th>
                        <th>Kapazität</th>
                        <th className="grow">Austattung</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr key={row.RaumNr}>
                            <td className={row.status}><div>●</div></td>
                            <td>{row.name}</td>
                            <td>{row.number}</td>
                            <td>{row.capacity}</td>
                            <td>{row.Auststattung}</td>
                            <td><BuchungsButton openModal={openModal} raumnr={row.roomId}></BuchungsButton></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Modal content={<ModalContent  modalData={modalData}/>} modalData={modalData} onClose={closeModal} />
        </div>
    );
};


export default Table;
