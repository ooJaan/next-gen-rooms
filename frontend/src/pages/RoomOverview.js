import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from 'react-router-dom';

import { RoomContext } from "../provider/RoomStatus.tsx";

import { useApi } from '../helpers/api';
import useDate from '../helpers/Date';
import Table from "../comps/Table";
import Loading from "../comps/Loading";
import '../css/RoomOverview.css'

const RoomOverview = () => {
    const { rooms, roomLoading, users, userLoading, status, statusLoading, assets, assetLoading, typeAssets, typeAssetsLoading } = useContext(RoomContext);
    const { id } = useParams();
    const { formatDate, formatTime } = useDate();
    const navigate = useNavigate()

    if (typeAssetsLoading || roomLoading || userLoading || assetLoading || statusLoading) {
        return <Loading />
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
        }
    ];

    const equipmentData = [
        ...rooms[id].roomAsset.map(data => ({
            name: !assetLoading && assets[data.assetId] ? assets[data.assetId].name : 'Loading...',
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
        userId: booking.userId
    }));


    if (rooms[id] === undefined) {
        console.log("room not found --> redirecting to home")
        navigate("/")
        return <></>
    }

    return (
        <div className="overview">
            <div className={`status-msg status-${status[id]?.type}`}>
                    <>{status[id].text}</>
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
}
export default RoomOverview;