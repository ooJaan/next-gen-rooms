import '../css/App.css';
import '../css/Table.css';
import '../css/responsive.css';

import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from 'react-router-dom';


import Table from '../comps/Table';
import BookingDialog from '../comps/BookDialog';
import NewRoom from '../comps/newRoom';
import { useApi } from "../helpers/api";
import { AuthContext } from '../provider/AuthProvider';
import { RoomContext } from '../provider/RoomStatus.tsx';

const BuchungsButton = ({ openModal, raumData, raumnr, raumName }) => {
    const data={"nr": raumnr, "name": raumName}
    return (
        <div className="buchung">
            <button onClick={() => openModal(raumData)} className="BuchenButton">Raum Buchen</button>
        </div>
    )
}





const RoomList =  ({}) => {
    const { rooms, roomLoading, status, statusLoading, types, typesLoading } = useContext(RoomContext)
    const [ modalClosed, setModalClosed] = useState(true)
    const [ roomDialogClosed, setRoomDialogClosed] = useState(true)
    const [ modalData, setModalData] = useState(true)
    const [error, setError] = useState(null);
    const { fetchWithAuth } = useApi();
    const navigate = useNavigate();
    const {c_role} = useContext(AuthContext);



    const openModal = (data) => {
        setModalClosed(false)
        setModalData(data);
        console.log(`setting modal data: ${JSON.stringify(data)}`)
    };

    const openRoomDialog = () => {
        setRoomDialogClosed(false)
    }


    if (roomLoading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    return (
        <div>
            {c_role === "Administrator" ? (
                <button onClick={openRoomDialog}>New Room</button>
            ) : null}
            <Table
                head={
                    <tr>
                        <th></th>
                        <th className='t-name'>Name</th>
                        <th className='t-nr'>RaumNr</th>
                        <th className='t-cap'>Kapazität</th>
                        <th className='t-type'>Typ</th>
                        <th className="grow t-assets">Austattung</th>

                    </tr>
                }
                body={Object.entries(rooms).map(([key, row]) => (
                    <tr key={key} name={key}>
                        <td className={!statusLoading ? `status-${status[key]?.type}` : ''}><div>●</div></td>
                        <td className='t-name'><Link to={`/overview/${row.roomId}`}>{row.name}</Link></td>
                        <td className='t-nr'>{row.number}</td>
                        <td className='t-cap'>{row.capacity}</td>
                        <td className='t-type'>
                            {!typesLoading ? (
                                <>{types[row.typeId].name}</>
                            ): null }
                        </td>
                        <td className='t-assets'>{row.Auststattung}</td>
                        <td>
                            <BuchungsButton openModal={openModal} raumData={row} raumnr={row.roomId} raumName={row.name}/>
                        </td>
                        <td>
                            {c_role === "Administrator" ? (
                                <button onClick={() => navigate(`/edit/${row.roomId}`)}>⚙</button>
                            ):null}
                        </td>
                    </tr>
                ))}
            />

            <BookingDialog
                roomData={modalData}
                setClosed={setModalClosed}
                modalClosed={modalClosed}
            />
            <NewRoom
                setClosed={setRoomDialogClosed}
                modalClosed={roomDialogClosed}
            />

        </div>
    )
};


export default RoomList;
