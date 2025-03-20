import React, { useState, useEffect } from "react";

import { useApi } from "../helpers/api";

const toISOString = (date) => {
    return new Date(date).toISOString();
};




const BookingDialog = ({ roomData = null }) => {
    const [startDateTime, setStartDateTime] = useState("");
    const [endDateTime, setEndDateTime] = useState("");
    const [loading, setLoading] = useState(true);
    const [rooms, setRooms] = useState({});
    const [selectValue, setSelectValue] = useState({});
    const { fetchWithAuth } = useApi();
    const step = 15;



    // if no room is set we want to display a select #TODO
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
    const formatDateToLocalString = (date) => {
        const yyyy = date.getFullYear();
        const mm = (date.getMonth() + 1).toString().padStart(2, "0");
        const dd = date.getDate().toString().padStart(2, "0");
        const hh = date.getHours().toString().padStart(2, "0");
        const mi = date.getMinutes().toString().padStart(2, "0");
        return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
    };

    useEffect(() => {
        const now = new Date();
        const formattedDate = formatDateToLocalString(now);
        setStartDateTime(formattedDate);
    }, []);


    const handleStartChange = (event) => {
        setStartDateTime(event.target.value);
    };
    const handleEndChange = (event) => {
        setEndDateTime(event.target.value);
    };
    const handleSubmit = () => {
        const startISO = startDateTime ? toISOString(startDateTime) : null;
        const endISO = endDateTime ? toISOString(endDateTime) : null;
        console.log(startISO, endISO, roomData, selectValue)
    };
    const handleSelectChange = (event) => {
        setSelectValue(event.target.value);
    };

    const isButtonDisabled = startDateTime === "" || endDateTime === "";


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

                <input
                    type="datetime-local"
                    id="start-date-time"
                    value={startDateTime}
                    step={step}
                    onChange={handleStartChange}
                />
                <input
                    type="datetime-local"
                    min={startDateTime}
                    id="end-date-time"
                    value={endDateTime}
                    step={step}
                    onChange={handleEndChange}
                />
                <button
                    disabled={isButtonDisabled}
                    onClick={handleSubmit}
                >Book</button>
            </div>
        </div>
    )
}

BookingDialog.defaultProps = {
    roomId: null,
}

export default BookingDialog;