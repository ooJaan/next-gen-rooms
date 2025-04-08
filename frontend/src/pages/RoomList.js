import '../css/App.css';
import '../css/Table.css';
import '../css/responsive.css';

import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from 'react-router-dom';


import Table from '../comps/Table';
import BookingDialog from '../comps/BookDialog';
import NewRoom from '../comps/newRoom';
import Loading from '../comps/Loading';
import { useApi } from "../helpers/api";
import { AuthContext } from '../provider/AuthProvider';
import { RoomContext } from '../provider/RoomStatus.tsx';
import BaseLayout from './BaseLayout';

const BuchungsButton = ({ openModal, raumData, raumnr, raumName }) => {
    const data={"nr": raumnr, "name": raumName}
    return (
        <div className="buchung">
            <button onClick={() => openModal(raumData)} className="BuchenButton">Raum buchen</button>
        </div>
    )
}





const RoomList = () => {
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

    const actions = c_role === "Administrator" ? (
        <button onClick={openRoomDialog}>Neuer Raum</button>
    ) : null;

    if (roomLoading || typesLoading || statusLoading) {
        return <Loading />
    }

    const columns = [
        { 
            key: 'status', 
            label: 'Status',
            sortable: true,
            render: (row) => (
                <div className={`status-${status[row.roomId]?.type} t-status`} style={{display: 'flex', alignItems: 'center', height: '100%', margin: 'auto'}}>
                    <svg height="20" width="20">
                        <circle cx="10" cy="10" r="10" fill="currentColor" />
                    </svg>
                </div>
            )
        },
        { 
            key: 'name', 
            label: 'Name',
            sortable: true,
            render: (row) => <Link className="table-data-name" to={`/overview/${row.roomId}`}>{row.name}</Link>
        },
        { key: 'number', label: 'RaumNr', sortable: true },
        { key: 'capacity', label: 'Kapazität', sortable: true },
        { 
            key: 'type', 
            label: 'Typ',
            sortable: false,
            render: (row) => types[row.typeId]?.name || 'Loading...'
        },
        { key: 'equipment', label: 'Austattung', sortable: false },
        { 
            key: 'booking', 
            label: 'Booking',
            sortable: false,
            render: (row) => (
                <BuchungsButton 
                    openModal={openModal} 
                    raumData={row} 
                    raumnr={row.roomId} 
                    raumName={row.name}
                />
            )
        },
        { 
            key: 'settings', 
            label: 'Settings',
            sortable: false,
            render: (row) => (
                c_role === "Administrator" ? (
                    <div 
                        style={{
                            display: 'flex', 
                            alignItems: 'center', 
                            height: '100%', 
                            cursor: 'pointer', 
                            color: '#ffddaa'
                        }} 
                        onClick={() => navigate(`/edit/${row.roomId}`)}
                    >
                        <img src="/settings.svg" alt="Settings" style={{width: '40px', height: '40px'}} />
                    </div>
                ) : null
            )
        }
    ];

    const tableData = Object.entries(rooms).map(([key, row]) => ({
        roomId: row.roomId,
        status: status[key]?.type,
        name: row.name,
        number: row.number,
        capacity: row.capacity,
        typeId: row.typeId,
        equipment: row.Auststattung
    }));

    console.log("tableData: ", tableData)


    if (error) return <p>{error}</p>;
    
    const content = (
        <div>
            <Table
                head={
                    <tr>
                        <th className='t-status'></th>
                        <th className='t-name'>Name</th>
                        <th className='t-nr'>Raumnummer</th>
                        <th className='t-cap'>Kapazität</th>
                        <th className='t-type'>Typ</th>
                        <th className="grow t-assets">Austattung</th>
                        <th></th>
                        <th></th>
                    </tr>
                }
                data={tableData}
                columns={columns}
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
    );

    return (
        <BaseLayout 
            title="Räume" 
            content={content}
            actions={actions}
        />
    );
};


export default RoomList;
