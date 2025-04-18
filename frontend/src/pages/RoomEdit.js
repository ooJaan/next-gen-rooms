import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';

import useDate from '../helpers/Date';
import { useApi } from '../helpers/api';
import { useModify } from '../helpers/Modify.ts';

import RoomAssets from '../comps/RoomAssets.js';
import { RoomContext } from '../provider/RoomStatus.tsx';
import Table from "../comps/Table";
import Loading from "../comps/Loading";
import BaseLayout from "./BaseLayout.js";
import BookingDialog from '../comps/BookDialog';

import "../css/RoomEdit.css"
import "../css/classes.css"
import "../css/responsive.css"

const CustomInput = ({ name, content }) => {
    return (
        <tr>
            <td>{name}: </td>
            <td>{content}</td>
        </tr>
    )
}


const RoomEdit = () => {
    const { rooms, roomLoading, types, typesLoading, users, userLoading, update, assets, assetsLoading, typeAssets, typeAssetsLoading } = useContext(RoomContext);
    const { id } = useParams();
    const [typeOptions, setTypeOptions] = useState({});
    const [typeOptionsLoading, setTypeOptionsLoading] = useState(true);
    const [bookDialogClosed, setBookDialogClosed] = useState(true)
    const { formatDate, formatTime } = useDate();
    const { deleteWithAuth } = useApi();
    const { changeRoomMetadata, deleteBooking, deleteRoom, changeTypeAsset, changeRoomAsset } = useModify(id);
    const [actions, setActions] = useState(null);

    const navigate = useNavigate()

    useEffect(() => {
        const createOptions = async () => {
            if (roomLoading || typesLoading || rooms[id] === undefined){
                return
            }
            var options = [];
            for (let key in types) {
                if (key !== rooms[id].roomId) {
                    options.push({
                        "label": types[key]["name"],
                        "value": key
                    })
                }
            }
            await setTypeOptions(options)
            setTypeOptionsLoading(false);
        }
        createOptions()
    }, [types, rooms[id]])

    const delRoom = async () => {
        await deleteRoom(id)
        navigate("/")
    }

    useEffect(() => {
        // Set the actions when the component mounts
        setActions(
            <>
                <button onClick={() => delRoom()}>Raum löschen</button>
                <button onClick={() => setBookDialogClosed(false)}>Raum buchen</button>
            </>
        );

        // Cleanup when component unmounts
        return () => setActions(null);
    }, [id]); // Add other dependencies as needed

    if (roomLoading || typeAssetsLoading || typesLoading || typeOptionsLoading || userLoading || assetsLoading) {
        return <Loading />
    }

    const setType = async (newTypeId) => {
        console.log(newTypeId)
        await changeRoomMetadata("typeId", newTypeId.value, id)
    }


    if (rooms[id] === undefined && !roomLoading) {
        console.log("room not found --> redirecting to home")
        navigate("/")
        return
    }

    const columns = [
        { key: 'date', label: 'Datum', sortable: true },
        { key: 'startTime', label: 'Von', sortable: true },
        { key: 'endTime', label: 'Bis', sortable: true },
        { key: 'username', label: 'User', sortable: true },
        { 
            key: 'actions', 
            label: 'Actions',
            sortable: false,
            render: (row) => (
                <button className="delete-button" onClick={() => deleteBooking(row.bookingId)}>Löschen</button>
            )
        }
    ];

    const content = (
        <div className="room-edit-container flex-horizontal">
            <div className="room-edit flex-vertical  surface">
                <div className="metadata">
                    <div>
                        <h3>{rooms[id].name}</h3>
                        <table>
                            <tbody>
                                <CustomInput
                                    name="Raumname"
                                    content={
                                        <input 
                                            placeholder="Raumname" 
                                            defaultValue={rooms[id].name}
                                            onBlur={(e) => changeRoomMetadata("name", e.target.value, id)}
                                        />
                                    }
                                />
                                <CustomInput
                                    name="Raumnummer"
                                    content={
                                        <input 
                                            type="text" 
                                            placeholder="Raumnummer" 
                                            defaultValue={rooms[id].number}
                                            onBlur={(e) => changeRoomMetadata("roomNumber", e.target.value, id)}
                                        />
                                    }
                                />
                                <CustomInput
                                    name="Raumtyp"
                                    content={
                                        <Select
                                            classNamePrefix="select"
                                            options={typeOptions}
                                            defaultValue={typeOptions.find(option => option.value === rooms[id].typeId) || null}
                                            onChange={(newType) => setType(newType)}
                                        />
                                    }
                                />
                                <CustomInput
                                    name="Max Buchungsdauer"
                                    content={
                                        <input 
                                            type="number" 
                                            min="0" 
                                            placeholder="Maximale Buchungsdauer" 
                                            defaultValue={rooms[id].maxDuration}
                                            onBlur={(e) => changeRoomMetadata("maxDuration", e.target.value, id)}
                                        />
                                    }
                                />
                                <CustomInput
                                    name="Kapazität"
                                    content={
                                        <input 
                                            type="number" 
                                            min="0" 
                                            placeholder="Kapazität" 
                                            defaultValue={rooms[id].capacity}
                                            onBlur={(e) => changeRoomMetadata("capacity", e.target.value, id)}
                                        />
                                    }
                                />
                            </tbody>
                        </table>
                    </div>
                </div>
                <div>
                    <div>
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
                        data={rooms[id].bookings
                            .filter(booking => booking)
                            .map(booking => ({
                                date: formatDate(booking.start),
                                startTime: formatTime(booking.start),
                                endTime: formatTime(booking.end),
                                username: users[booking.userId]?.username || 'Loading...',
                                bookingId: booking.id
                            }))}
                            columns={columns}
                        />
                    </div>
                </div>
            </div>
            <div className="assets-container flex-vertical surface">
                <h3>Ausstattung</h3>
                <RoomAssets 
                    name="Raumspezifisch" 
                    id={id}
                    roomLoading={roomLoading}
                    assets={assets}
                    changeAnyAsset={changeRoomAsset}
                    anyAsset={rooms[id].roomAsset}
                />
                <RoomAssets 
                    name="Typspezifisch"
                    id={rooms[id].typeId}
                    roomLoading={roomLoading}
                    assets={assets}
                    changeAnyAsset={changeTypeAsset}
                    anyAsset={Object.entries(typeAssets).filter(([_, asset]) => asset.typeId === rooms[id].typeId).map(([id, asset]) => ({...asset, id}))}
                />
            </div>
            <BookingDialog
                roomData={rooms[id]}
                modalClosed={bookDialogClosed}
                setClosed={setBookDialogClosed}

            />
        </div>
    );

    return (
        <BaseLayout 
            title="Raum bearbeiten" 
            content={content}
            actions={actions}
        />
    );
}

export default RoomEdit;