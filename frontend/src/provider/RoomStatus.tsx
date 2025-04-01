import React, { createContext, useState, useEffect, useRef, useContext } from "react";

import { AuthContext } from "./AuthProvider";
import { useApi } from "../helpers/api";

import config from "../config";

export const RoomContext = createContext()



export const RoomProvider = ({ children }) => {
    const { loggedIn } = useContext(AuthContext)
    const [status, setStatus] = useState(null)
    const [statusLoading, setStatusLoading] = useState(true)
    const [rooms, setRooms] = useState({})
    const [roomLoading, setRoomLoading] = useState(true)
    const [users, setUsers] = useState({})
    const [usersLoading, setUsersLoading] = useState(true)
    const [types, setTypes] = useState({})
    const [typesLoading, setTypesLoading] = useState(true)
    const [assets, setAssets] = useState({})
    const [assetsLoading, setAssetsLoading] = useState(true)

    const prevRooms = useRef(null);
    const prevUsers = useRef(null);
    const prevTypes = useRef(null);
    const prevStatus = useRef(null);
    const prevAssets = useRef(null);

    const { fetchWithAuth, postWithAuth, patchWithAuth, deleteWithAuth } = useApi();
    console.log("RoomStatus re render")

    useEffect(() => {
        const init = async () => {
            updateAll()
        }
        init()
        const interval = setInterval(() => {
            console.debug("updating the rooms")
            update();
        }, config.Polling_s.rooms * 1000);

        return () => clearInterval(interval);
    }, []);
    /*
    useEffect(() => {   
        console.log("rooms changed --> updateStatus")
        updateStatus()
    }, [rooms])
    */
    useEffect(() => {
        const now = new Date();
        const delay = (60 - now.getSeconds()) * 1000 - now.getMilliseconds() + 200;
        // always wait 200ms after the minute starts to avoid problems with the server time

        // Initial timeout to sync with clock
        const initialTimeout = setTimeout(() => {
            console.debug("updateing the status")
            updateStatus();
            // Once synced, run every minute
            const interval = setInterval(updateStatus, 60000);
            return () => clearInterval(interval);
        }, delay);

        return () => clearTimeout(initialTimeout);
    }, []);

    const updateAll = async () => {
        await fetchAnything("room", prevRooms, setRooms, setRoomLoading)
        await fetchAnything("assets", prevAssets, setAssets, setAssetsLoading);
        updateStatus()
        fetchAnything("types", prevTypes, setTypes, setTypesLoading);
        fetchAnything("users", prevUsers, setUsers, setUsersLoading);

    }
    const update = async () => {
        await fetchAnything("room", prevRooms, setRooms, setRoomLoading);
        await fetchAnything("users", prevUsers, setUsers, setUsersLoading);
        fetchAnything("assets", prevAssets, setAssets, setAssetsLoading);
        fetchAnything("types", prevTypes, setTypes, setTypesLoading);
    };

    const updateStatus = async () => {
        console.log("updateStatus")
        const newStatus = getAllstatus(prevRooms.current);
        if (newStatus !== null && JSON.stringify(newStatus) !== JSON.stringify(prevStatus.current)) {
            prevStatus.current = newStatus;
            setStatus(newStatus);
            setStatusLoading(false);
        }
    }

    const fetchAnything = async (url, ref, setter, loadingSetter) => {
        const resp = await fetchWithAuth(url);
        if (JSON.stringify(resp) !== JSON.stringify(ref.current)) {
            ref.current = resp;
            await setter(resp);
            loadingSetter(false);
        }
    }


    const getAllstatus = (rooms, now = new Date()) => {
        if (rooms === null) {
            return null
        }
        let status_local = {}
        for (const roomId in rooms) {
            var room = rooms[roomId]
            status_local[room.roomId] = getRoomStatus(room, now)
        }
        console.log(status_local)
        return status_local
    }

    const getRoomStatus = (roomData, now = new Date()) => {
        //console.log(`getting status from room ${roomData.name} with bookings ${JSON.stringify(roomData.bookings)}`);
        if (roomData.bookings.length > 0) {
            //console.log(`booking: ${JSON.stringify(roomData.bookings[0])}`)
            for (const booking of roomData.bookings) {
                var status = getSingleStatus(booking, roomData.name, now)
                //console.log(`status: ${JSON.stringify(status)}`)
                if (status !== null) {
                    //console.log(`found relevant booking: status: ${JSON.stringify(status)}`)
                    return status
                }
            }
        }
        return { "type": 0, "text": `${roomData.name} ist frei` }
    }
    const getSingleStatus = (booking, roomName, now = new Date()) => {
        // 0: Free, 1: Booked, 2: Soon to be booked
        let start = new Date(booking.start)
        let end = new Date(booking.end)
        //console.log(`start: ${start}, end: ${end}, now: ${now}`)
        if (now >= start && now < new Date(end.getTime() + 60 * 1000)) {
            // room is currently booked
            const minutesLeft = Math.floor((end - now) / 1000 / 60) + 1;
            return { "type": 1, "user": booking.userId, "text": `${roomName} ist bis in ${Math.max(1, minutesLeft)} Minuten gebucht` }
        }
        let diff_min = (start - now) / 1000 / 60
        if (diff_min <= 30) {
            //room is soon to be booked
            let mins = Math.floor((start - now) / 1000 / 60) + 1
            return { "type": 2, "user": booking.userId, "text": `${roomName} ist in ${mins} ${mins > 1 ? 'Minuten' : 'Minute'} belegt` }
        }
        return null
    }
    return (
        <RoomContext.Provider value={{
            rooms, roomLoading, setRooms,
            status, statusLoading,
            users, usersLoading,
            types, typesLoading,
            assets, assetsLoading, setAssets,
            getAllstatus,
            updateAll,
            update,
            fetchAnything
        }}>
            {children}
        </RoomContext.Provider>
    )
}
