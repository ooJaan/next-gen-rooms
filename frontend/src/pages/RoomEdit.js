import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';

import useDate from '../helpers/Date';
import { useApi } from '../helpers/api';
import { useModify } from '../helpers/Modify.ts';

import RoomAssets from '../comps/RoomAssets.js';
import { RoomContext } from '../provider/RoomStatus.tsx';
import Table from "../comps/Table";

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
    const { rooms, roomLoading, types, typesLoading, users, userLoading, update, assets } = useContext(RoomContext);
    const { id } = useParams();
    const [typeOptions, setTypeOptions] = useState({});
    const [typeOptionsLoading, setTypeOptionsLoading] = useState(true);
    const { formatDate, formatTime } = useDate();
    const { deleteWithAuth } = useApi();
    const { changeRoomMetadata, deleteBooking, deleteRoom } = useModify(id);

    const navigate = useNavigate()
    console.log("roomEdit init roomData: ", rooms[id])

    useEffect(() => {
        var options = [];
        for (let key in types) {
            if (key !== rooms[id].roomId) {
                options.push({
                    "label": types[key]["name"],
                    "value": key
                })
            }
        }
        console.log(options)
        setTypeOptions(options)
        setTypeOptionsLoading(false);
    }, [types, rooms[id]])

    const setType = async (newTypeId) => {
        console.log(newTypeId)
        var updatedRoom = { ...rooms[id] };
        updatedRoom.typeId = newTypeId.value
        console.log(updatedRoom)
        //todo modify rooms
    }

    const delRoom = async () => {
        await deleteRoom(id)
        navigate("/")
    }

    if (roomLoading | typesLoading | typeOptionsLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className="room-edit flex-horizontal">
            <div className="metadata">
                <div>
                    <h1>{rooms[id].name}</h1>
                    <table>
                        <tbody>
                            <CustomInput
                                name="Raumname"
                                content={
                                    <input 
                                        placeholder="Raumname" 
                                        value={rooms[id].name} 
                                        onChange={(e) => changeRoomMetadata("name", e.target.value, id)}
                                    />
                                }
                            />
                            <CustomInput
                                name="Raumnummer"
                                content={
                                    <input 
                                        type="text" 
                                        placeholder="Raumnummer" 
                                        value={rooms[id].number} 
                                        onChange={(e) => changeRoomMetadata("roomNumber", e.target.value, id)}
                                    />
                                }
                            />
                            <CustomInput
                                name="Raumtyp"
                                content={
                                    <Select
                                        options={typeOptions}
                                        value={typeOptions.find(option => option.value === rooms[id].typeId) || null}
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
                                        value={rooms[id].maxDuration} 
                                        onChange={(e) => changeRoomMetadata("maxDuration", e.target.value, id)}
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
                                        value={rooms[id].capacity} 
                                        onChange={(e) => changeRoomMetadata("capacity", e.target.value, id)}
                                    />
                                }
                            />
                        </tbody>
                    </table>
                </div>
                <div>

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
                                    <td>
                                        <button onClick={() => deleteBooking(data.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        />
                    ) : (
                        <h1>Loading...</h1>
                    )}
                </div>
            </div>
            <div className="assets-container flex-vertical">
                {roomLoading ? (
                    <h1>Loading...</h1>
                )
                : (
                    <>
                        <button onClick={() => delRoom()}>Delete Room</button>
                        <RoomAssets name="Raumspezifisch" roomId={id} roomLoading={roomLoading}/>
                    </>
                )
                }
            </div>

        </div>
    )
}
export default RoomEdit;