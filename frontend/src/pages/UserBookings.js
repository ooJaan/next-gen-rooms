import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../provider/AuthProvider.js";
import { RoomContext } from "../provider/RoomStatus.tsx";

import { useModify } from "../helpers/Modify.ts";
import { useApi } from "../helpers/api.js";
import Loading from "../comps/Loading.js";

import Table from "../comps/Table.js";
import useDate from "../helpers/Date.js";



const UserBookings = () => {
    const { loggedIn, c_userId, c_user, c_role } = useContext(AuthContext)
    const { rooms } = useContext(RoomContext)
    const { fetchWithAuth } = useApi()
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const { formatDate, formatTime } = useDate();
    const { deleteBooking } = useModify();

    console.log("bookings: ", bookings)
    useEffect(() => {
        if (!loggedIn) return
        fetchWithAuth(`booking/by-user/${c_userId}`)
            .then(setBookings)
           .then(() => setLoading(false))
    }, [loggedIn, c_userId])

    const deleteLocalBooking = async (bookingId, roomId) => {
        let newBookings = { ...bookings }
        let oldBookings = { ...bookings }

        delete newBookings[bookingId]
        setBookings(newBookings)
        try {
            await deleteBooking(bookingId, roomId)
        } catch (error) {
            setBookings(oldBookings)
        }
    }

    const columns = [
        { 
            key: 'roomName', 
            label: 'Room',
            sortable: true,
            render: (row) => rooms[row.roomId]?.name || 'Loading...'
        },
        { key: 'date', label: 'Datum', sortable: true },
        { key: 'startTime', label: 'Von', sortable: true },
        { key: 'endTime', label: 'Bis', sortable: true },
        { 
            key: 'actions', 
            label: 'Löschen',
            sortable: false,
            render: (row) => (
                <button className="delete-button" onClick={() => deleteLocalBooking(row.id, row.roomId)}>Delete</button>
            )
        }
    ];

    const tableData = Object.entries(bookings).map(([id, booking]) => ({
        id,
        roomId: booking.roomId,
        date: formatDate(booking.start),
        startTime: formatTime(booking.start),
        endTime: formatTime(booking.end)
    }));

    if (loading) return <Loading />

    return (
        <div>
            <Table 
                head={
                    <tr>
                        <th>Raum</th>
                        <th>Datum</th>
                        <th>Von</th>
                        <th>Bis</th>
                        <th>Löschen</th>
                    </tr>
                }
                data={tableData}
                columns={columns}
            />
        </div>
    )
}

export default UserBookings 