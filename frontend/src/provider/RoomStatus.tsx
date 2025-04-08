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
    const [typeAssets, setTypeAssets] = useState({})
    const [typeAssetsLoading, setTypeAssetsLoading] = useState(true)

    const prevRooms = useRef(null);
    const prevUsers = useRef(null);
    const prevTypes = useRef(null);
    const prevStatus = useRef(null);
    const prevAssets = useRef(null);
    const prevTypeAssets = useRef(null);
    const { fetchWithAuth, postWithAuth, patchWithAuth, deleteWithAuth } = useApi();

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
    useEffect(() => {
        const now = new Date();
        const delay = (60 - now.getSeconds()) * 1000 - now.getMilliseconds() + 200;
        //const delay = 0;
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

    useEffect(() => {
        if (Object.keys(rooms).length > 0) {
            prevRooms.current = rooms
            updateStatus()
        }
    }, [rooms])

    const updateAll = async () => {
        fetchAnything("room", prevRooms, setRooms, setRoomLoading)
        fetchAnything("assets", prevAssets, setAssets, setAssetsLoading);
        fetchAnything("types", prevTypes, setTypes, setTypesLoading);
        fetchAnything("users", prevUsers, setUsers, setUsersLoading);
        fetchAnything("type-assets", prevTypeAssets, setTypeAssets, setTypeAssetsLoading);
    }
    const update = async () => {
        fetchAnything("room", prevRooms, setRooms, setRoomLoading);
        fetchAnything("users", prevUsers, setUsers, setUsersLoading);
        fetchAnything("assets", prevAssets, setAssets, setAssetsLoading);
        fetchAnything("types", prevTypes, setTypes, setTypesLoading);
        fetchAnything("type-assets", prevTypeAssets, setTypeAssets, setTypeAssetsLoading);
    };
    const updateRooms = async () => {
        fetchAnything("room", prevRooms, setRooms, setRoomLoading);
    }

    const updateStatus = async () => {
        const newStatus = getAllstatus(prevRooms.current);
        if (newStatus !== null && JSON.stringify(newStatus) !== JSON.stringify(prevStatus.current)) {
            prevStatus.current = newStatus;
            setStatus(newStatus);
            setStatusLoading(false);
        }
    }

    const fetchAnything = async (url, ref, setter, loadingSetter) => {
        let resp = null
        try {
            resp = await fetchWithAuth(url);
        }
        catch (error) {
            if (error instanceof TypeError && error.message === 'NetworkError when attempting to fetch resource.') {
                //TODO add a small badge that displays that the connection is lost
                console.log("request failed --> seems like the connection is lost")
                return
            }
            else {
                throw error
            }
        }
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
        return status_local
    }

    const getRoomStatus = (roomData, now = new Date()) => {
        //console.log(`getting status from room ${roomData.name} with bookings ${JSON.stringify(roomData.bookings)}`);
        if (roomData.bookings.length > 0) {
            //console.log(`booking: ${JSON.stringify(roomData.bookings[0])}`)
            var highestStatus = null
            for (const booking of roomData.bookings) {
                if (booking === undefined){
                    continue
                }
                var status = getSingleStatus(booking, roomData, now)
                //console.log(`status: ${JSON.stringify(status)}`)

                if (status === null){
                    continue
                }
                if (status["type"] === 1){
                    //status is soon to be booked
                    highestStatus = status
                    continue
                }
                if (status["type"] === 2){
                    //status is currently booked
                    return status
                }
            }
            if (highestStatus === null){
                return { "type": 0, "text": `${roomData.name} ${roomData.number} ist frei` }
            }
            else {
                return highestStatus
            }
        }
        return { "type": 0, "text": `${roomData.name} ${roomData.number} ist frei` }
    }
    const getSingleStatus = (booking, roomData, now = new Date()) => {
        // 0: Free, 1: Booked, 2: Soon to be booked
        let start = new Date(booking.start)
        let end = new Date(booking.end)
        if (now >= start && now < new Date(end.getTime() + 60 * 1000)) {
            // room is currently booked
            const minutesLeft = Math.floor((end - now) / 1000 / 60) + 1;
            return { "type": 2, "user": booking.userId, "text": `${roomData.name} ${roomData.number} ist für die nächsten ${Math.max(1, minutesLeft)} Minuten gebucht` }
        }
        let diff_min = (start - now) / 1000 / 60
        if (diff_min <= 30) {
            //room is soon to be booked
            let mins = Math.floor((start - now) / 1000 / 60) + 1
            return { "type": 1, "user": booking.userId, "text": `${roomData.name} ${roomData.number} ist in ${mins} ${mins > 1 ? 'Minuten' : 'Minute'} gebucht` }
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
            typeAssets, typeAssetsLoading, setTypeAssets,
            getAllstatus,
            updateAll,
            update,
            updateRooms,
            fetchAnything
        }}>
            {children}
        </RoomContext.Provider>
    )
}
