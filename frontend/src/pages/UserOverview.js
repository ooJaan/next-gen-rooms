import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { RoomContext } from "../provider/RoomStatus.tsx";

import { useModify } from "../helpers/Modify.ts";
import { useApi } from "../helpers/api";
import Loading from "../comps/Loading";

import Table from "../comps/Table";
import useDate from "../helpers/Date";



const UserOverview = () => {
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

    if (loading) return <Loading />

    return (
        <div>
            <h1>User Overview</h1>
            <Table 
                head={
                    <tr>
                        <th>Room</th>
                        <th>Datum</th>
                        <th>Von</th>
                        <th>Bis</th>
                        <th>Löschen</th>
                    </tr>
                }
                body={Object.entries(bookings).map(([id, booking]) => (
                    <pre>{id} {JSON.stringify(booking)}</pre>
                ))}
            />
        </div>
    )
}

export default UserOverview 