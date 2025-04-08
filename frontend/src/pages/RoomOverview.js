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
    const { rooms, roomLoading, users, userLoading, status, statusLoading, assets, assetsLoading, typeAssets, typeAssetsLoading } = useContext(RoomContext);
    const { id } = useParams();
    const [bookDialogClosed, setBookDialogClosed] = useState(true)
    const [actions, setActions] = useState(null)
    const { formatDate, formatTime } = useDate();
    const navigate = useNavigate()
    const { deleteBooking } = useModify(id);
    const { c_userId } = useContext(AuthContext);


    useEffect(() => {
        setActions(
            <div>
                <button onClick={() => navigate(`/overview/${id}`)}>Raum buchen</button>
            </div>
        );

        return () => setActions(null);
    }, [id]);

    if (typeAssetsLoading || roomLoading || userLoading || assetsLoading || statusLoading) {
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
               if(row.userId === c_userId){
                    return <button onClick={() => deleteBooking(row.bookingId)}>Löschen</button>
               }else{
                    return <button disabled={true}>Löschen</button>
               }
            }
        }
    ];

    const equipmentData = [
        ...rooms[id].roomAsset.map(data => ({
            name: !assetsLoading && assets[data.assetId] ? assets[data.assetId].name : 'Loading...',
            count: data.assetCount
        })),
        ...Object.values(typeAssets)
            .filter(data => data.typeId === rooms[id].typeId)
            .map(data => ({
                name: assets[data.assetId].name,
                count: data.assetCount
            }))
    ];

    const bookingData = rooms[id].bookings.map(booking => ({
        date: formatDate(booking.start),
        startTime: formatTime(booking.start),
        endTime: formatTime(booking.end),
        userId: booking.userId,
        bookingId: booking.id
    }));

    


    const content = (
        <div className="overview">
            <div className={!statusLoading ? `status-msg status-${status[id]?.type}` : 'status-msg'}>
                {statusLoading ? (
                    <></>
                ) : (
                    <>{status[id].text}</>
                )}
            </div>
            <div className="overview-container">

                <div>
                {!roomLoading ? (
                    <>
                    <h1>Ausstattung {rooms[id].name}</h1>
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
                    </>
                    ) : (
                        <h1>Loading...</h1>
                    )}
                </div>
                <div>
                    <h1>Buchungen</h1>
                    {!roomLoading ? (
                        <Table
                            head={
                                <tr>
                                    <th>Datum</th>
                                    <th>Von</th>
                                    <th>Bis</th>
                                    <th>User</th>
                                    <th></th>
                                </tr>
                            }
                            data={bookingData}
                            columns={bookingColumns}
                        />
                    ) : (
                        <h1>Loading...</h1>
                    )}

                </div>
            </div>
        </div>
    )
    return (
        <BaseLayout 
            title="Overview" 
            content={content}
            actions={actions}
        />
    )
}
export default RoomOverview;