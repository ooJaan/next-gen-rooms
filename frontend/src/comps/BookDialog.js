import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { RoomContext } from "../provider/RoomStatus.tsx";

import Modal from '../comps/Modal';



import { useApi } from "../helpers/api";
import config from "../config";




const BookingDialog = ({ roomData = null, setClosed, modalClosed }) => {

    const closeModal = () => {
        setClosed(true)
    };
    return (
        <Modal
            content={<ModalContent roomData={roomData} setClosed={setClosed}/>}
            setClosed={setClosed}
            onClose={closeModal}
            closed={modalClosed}
        />
    )
}
const ModalContent = ({ roomData = null, setClosed }) => {

    const { c_userId } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [selectValue, setSelectValue] = useState({});
    const [error, setError] = useState(null)
    const [startTime, setStartTime] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endTime, setEndTime] = useState("");
    const [attendees, setAttendees] = useState(0);
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const { fetchWithAuth, postWithAuth } = useApi();
    const { rooms, roomLoading, updateAll} = useContext(RoomContext);

    console.log("re rendering modal")


    // TODO a booking cannot be over a day
    useEffect(() => {
        // runs at start
        const now = new Date();
        const formattedDate = formatDate(now);
        const formattedTime = formatTime(now);
        const formattedEndTime = formatTime(new Date(now.getTime() + 15 * 60 * 1000));
        setStartDate(formattedDate);
        setStartTime(formattedTime);
        setEndTime(formattedEndTime);
    }, []);

    useEffect(() => {
        const start = StringToDate(startDate, startTime)
        const end = StringToDate(startDate, endTime)
        console.log(`${start} end: ${end}`)
        const now = new Date();
        if (!startTime | !endTime) {
            setError("no start or endtime")
            return
        }
        if (now > startTime) {
            setError("kann keinen raum rückwirkend buchen")
            return
        }
        if (start > end) {
            setError("start muss vor dem Ende sein")
            return
        }
        if (attendees > roomData.capacity) {
            setError(`Raum kann nicht mehr als ${roomData.capacity} Personen haben`)
            return
        }
        const durationMin = (end - start) / (1000 * 60)
        console.log(`max-duration ${roomData.maxDuration} diff ${durationMin}`)
        if (durationMin > roomData.maxDuration) {
            setError(`Raum kann nicht länger als ${roomData.maxDuration}min gebucht werden`)
            return
        }
        if (error !== null) {
            setError(null);
        }

    }, [startTime, endTime, attendees])

    useEffect(() => {
        console.log("error has changed to", error)
        if (error === null) {
            setButtonDisabled(false);
        }
        else {
            setButtonDisabled(true);
        }
    }, [error])
    const formatTime = (date) => {
        const hh = date.getHours().toString().padStart(2, "0");
        const mm = date.getMinutes().toString().padStart(2, "0");
        return `${hh}:${mm}`
    }
    const formatDate = (date) => {
        const yyyy = date.getFullYear();
        const mm = (date.getMonth() + 1).toString().padStart(2, "0");
        const dd = date.getDate().toString().padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`
    }

    const StringToDate = (date, time) => {
        const dateTimeString = `${date}T${time}:00`;
        return new Date(dateTimeString);
    }


    const handleSubmit = async () => {
        const startISO = StringToDate(startDate, startTime).toISOString()
        const endISO = StringToDate(startDate, endTime).toISOString()
        console.log(roomData)
        var req = {
            "roomId": roomData.roomId,
            "userId": c_userId,
            "attendees": attendees,
            "startDate": startISO,
            "endDate": endISO
        }
        console.log(JSON.stringify(req))
        const resp = await postWithAuth("booking/create", req)
        console.log(resp)
        if (!resp["error"]) {
            setClosed(true)
            updateAll()
        } else {
            setError(resp["error"])
        }
    };


    return (
        <div>
            <h2>Raum buchen</h2>
            <div className="book-form">
                {roomData === null ? (
                    <select value={selectValue} onChange={(e) => setSelectValue(e.target.value)}>
                        {loading ? (
                            <option>Loading...</option>
                        ) : (
                            Object.entries(rooms).map(([key, row]) => (
                                <option value={key}>{row.name}</option>
                            ))
                        )}
                    </select>
                ) : (
                    <p>{roomData.number} - {roomData.name}</p>
                )}
                <div className="error">
                    {error}

                </div>

                <input
                    type="date"
                    id="start-date"
                    value={startDate}
                    min={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <div>
                    <input
                        type="time"
                        id="start-time"
                        value={startTime}
                        step={config.minutenStep}
                        min={startTime}
                        onChange={(e) => setStartTime(e.target.value)}

                    />
                    <input
                        type="time"
                        id="end-time"
                        value={endTime}
                        step={config.minutenStep}
                        onChange={(e) => setEndTime(e.target.value)}
                        min={startTime}
                    />
                    <input
                        type="namber"
                        id="attendees"
                        value={attendees}
                        onChange={(e) => setAttendees(e.target.value)}
                        min={0}
                        max={roomData.capacity}
                    />
                </div>
                <button
                    disabled={buttonDisabled}
                    onClick={handleSubmit}
                >Buchen</button>
            </div>
        </div>
    )
}

BookingDialog.defaultProps = {
    roomId: null,
}

export default BookingDialog;