import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from 'react-router-dom';

import { RoomContext } from "../provider/RoomStatus.tsx";
import { AuthContext } from "../provider/AuthProvider.js";
import { useModify } from '../helpers/Modify.ts';


import { useApi } from '../helpers/api';
import useDate from '../helpers/Date';
import Table from "../comps/Table";
import Loading from "../comps/Loading";
import BookingDialog from '../comps/BookDialog';
import BaseLayout from './BaseLayout';

import '../css/RoomOverview.css'

const RoomOverview = () => {
    const { rooms, roomLoading, users, userLoading, status, statusLoading, assets, assetsLoading, typeAssets, typeAssetsLoading, types, typesLoading } = useContext(RoomContext);
    const { id } = useParams();
    const [bookDialogClosed, setBookDialogClosed] = useState(true)
    const [actions, setActions] = useState(null)
    const { formatDate, formatTime } = useDate();
    const navigate = useNavigate()
    const { deleteBooking } = useModify(id);
    const { c_userId, c_role } = useContext(AuthContext);

    useEffect(() => {
        if (c_role !== "Viewer") {
            setActions(
                <>
                    <button onClick={() => setBookDialogClosed(false)}>Raum buchen</button>
                </>
            );
        }

        return () => setActions(null);
    }, [id, c_role]);

    if (typeAssetsLoading || roomLoading || userLoading || assetsLoading || statusLoading || typesLoading) {
        return <Loading />
    }
    if (rooms[id] === undefined) {
        console.log("room not found --> redirecting to home")
        navigate("/")
        return <></>
    }

    const equipmentColumns = [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'count', label: 'Stück', sortable: true }
    ];

    const bookingColumns = [
        { key: 'date', label: 'Datum', sortable: true },
        { key: 'startTime', label: 'Von', sortable: true },
        { key: 'endTime', label: 'Bis', sortable: true },
        { 
            key: 'username', 
            label: 'User',
            sortable: true,
            render: (row) => users[row.userId]?.username || 'Loading...'
        },
        {   
            key: 'action',
            label: 'Action',
            sortable: false,
            render: (row) => {
                if(c_role !== "Viewer"){
                    if(row.userId === c_userId){
                        return <button className="delete-button" onClick={() => deleteBooking(row.bookingId)}>Löschen</button>
                    }else{
                        return <button disabled={true}>Löschen</button>
                    }
                }
                return null
            }
        }
    ];

    const equipmentData = [
        ...rooms[id].roomAsset.map(data => ({
            name: !assetsLoading && assets[data.assetId] ? assets[data.assetId].name : 'Loading...',
            count: data.assetCount
        }))
    ];

    const additionalEquipmentData = [
        ...Object.values(typeAssets)
        .filter(data => data.typeId === rooms[id].typeId)
        .map(data => ({
            name: assets[data.assetId].name,
            count: data.assetCount
        }))
    ]

    const bookingData = rooms[id].bookings.map(booking => ({
        date: formatDate(booking.start),
        startTime: formatTime(booking.start),
        endTime: formatTime(booking.end),
        userId: booking.userId,
        bookingId: booking.id
    }));

    


    const content = (
        <div className="overview">
            <div className={`status-msg surface status-${status[id]?.type}`}>
                {status[id].text}
            </div>
            <div className="overview-container">

                <div className="surface">
                    <h1>Ausstattung-{rooms[id].name} {rooms[id].number}</h1>
                        <Table
                            head={
                                <tr>
                                    <th>Name</th>
                                    <th>Stück</th>
                                </tr>
                            }
                            data={equipmentData}
                            columns={equipmentColumns}
                        />
                        <h1>Ausstattung - {types[rooms[id].typeId]?.name}</h1>
                        <Table
                            head={
                                <tr>
                                    <th>Name</th>
                                    <th>Stück</th>
                                </tr>
                            }
                            data={additionalEquipmentData}
                            columns={equipmentColumns}
                        />
                </div>
                <div className="surface">
                    <h1>Buchungen</h1>
                    <Table
                        head={
                            <tr>
                                <th>Datum</th>
                                <th>Von</th>
                                <th>Bis</th>
                                <th>Benutzer</th>
                                <th></th>
                            </tr>
                        }
                        data={bookingData}
                        columns={bookingColumns}
                    />

                </div>
            </div>
            <BookingDialog
                roomData={rooms[id]}
                modalClosed={bookDialogClosed}
                setClosed={setBookDialogClosed}
            />
        </div>
    )
    return (
        <BaseLayout 
            title="Raum Übersicht" 
            content={content}
            actions={actions}
        />
    )
}
export default RoomOverview;