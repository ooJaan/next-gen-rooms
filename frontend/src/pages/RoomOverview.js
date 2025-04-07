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
    if (rooms[id] === undefined) {
        console.log("room not found --> redirecting to home")
        navigate("/")
        return <></>
    }

    return (
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
                            body={[
                                ...rooms[id].roomAsset.map((data, index) => (
                                    <tr key={data.id}>
                                        {!assetLoading && assets[data.assetId] ? (
                                            <td>{assets[data.assetId].name}</td>
                                        ) : (
                                            <td>Loading...</td>
                                        )}
                                        <td>{data.assetCount}</td>
                                    </tr>
                                )),
                                ...Object.values(typeAssets).map((data, index) => 
                                    data.typeId === rooms[id].typeId ? (
                                        <tr key={index}>
                                            <td>{assets[data.assetId].name}</td>    
                                            <td>{data.assetCount}</td>
                                        </tr>
                                    ) : null
                                )
                            ]}
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
                            body={rooms[id].bookings.map((data, index) => (
                                <tr key={data.id}>
                                    <td>{formatDate(data.start)}</td>
                                    <td>{formatTime(data.start)}</td>
                                    <td>{formatTime(data.end)}</td>
                                    {!userLoading && users[data.userId] ? (
                                        <td>{users[data.userId].username}</td>
                                    ) : (
                                        <td>Loading...</td>
                                    )}
                                </tr>
                            ))}
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