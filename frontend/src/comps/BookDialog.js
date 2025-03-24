import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";


import { useApi } from "../helpers/api";
import config from "../config";




const BookingDialog = ({ roomData = null }) => {
    const {c_userId } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [rooms, setRooms] = useState({});
    const [selectValue, setSelectValue] = useState({});
    const [error, setError] = useState(null)
    const [startTime, setStartTime] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endTime, setEndTime] = useState("");
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const { fetchWithAuth, postWithAuth } = useApi();



    // if no room is set we want to display a select #TODO
    // TODO a booking cannot be over a day
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await fetchWithAuth(`room`); // Replace with actual endpoint
                setRooms(response); // Store the response in state
                setLoading(false);
            } catch (err) {
                console.error("Error fetching rooms:", err);
                setLoading(false);
            }
        };
        if (!roomData) {
            fetchRooms();
        }
    }, []);
    useEffect(() => {
        // runs at start
        const now = new Date();
        const formattedDate = formatDate(now);
        const formattedTime = formatTime(now)
        setStartDate(formattedDate);
        setStartTime(formattedTime);
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
        if (now > startTime){
            setError("kann keinen raum rückwirkend buchen")
            return
        }
        if (start > end ){
            setError("start muss vor dem Ende sein")
            return
        }
        const durationMin = (end - start) / (1000 * 60)
        console.log(`max-duration ${roomData.maxDuration} diff ${durationMin}`)
        if (durationMin > roomData.maxDuration) {
            setError(`Raum kann nicht länger als ${roomData.maxDuration}min gebucht werden`)
            return
        }
        setError(null)

    }, [startTime, endTime])

    useEffect(() => {
        console.log("error has changed to", error)
        if(error === null) {
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



    const handleSartTimeChange = (event) => {
        setStartTime(event.target.value)
    }
    const handleStartDateChange = (event) => {
        setStartDate(event.target.value)
    }
    const handleEndTimeChange = (event) => {
        setEndTime(event.target.value)
    }

    const handleSubmit = () => {
        const startISO = StringToDate(startDate, startTime).toISOString()
        const endISO = StringToDate(startDate, endTime).toISOString()
        var req = {
            "roomId": roomData.id,
            "userId": c_userId,
            "startDate": startISO,
            "endDate": endISO
        }
        console.log(JSON.stringify(req)) 
        postWithAuth("booking/create", req)
    };
    const handleSelectChange = (event) => {
        setSelectValue(event.target.value);
    };



    return (
        <div>
            <h2>Raum buchen</h2>
            <div className="book-form">
                {roomData === null ? (
                    <select value={selectValue} onChange={handleSelectChange}>
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

                {error}

                <input
                    type="date"
                    id="start-date"
                    value={startDate}
                    min={startDate}
                    onChange={handleStartDateChange}
                />
                <div>

                    <input
                        type="time"
                        id="start-time"
                        value={startTime}
                        step={config.minutenStep}
                        min={startTime}
                        onChange={handleSartTimeChange}
                    />
                    <input
                        type="time"
                        id="end-time"
                        value={endTime}
                        step={config.minutenStep}
                        onChange={handleEndTimeChange}
                        min={startTime}
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