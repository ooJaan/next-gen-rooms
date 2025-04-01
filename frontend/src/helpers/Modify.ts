import { useContext } from "react";

import { RoomContext } from "../provider/RoomStatus.tsx";
import { useApi } from "../helpers/api.js"





export enum methods {
    NEW,
    UPDATE,
    DELETE
}
export const useModify = (roomId: string) => {
    const { postWithAuth, patchWithAuth, deleteWithAuth } = useApi()
    const { assets, setAssets, rooms, setRooms, getAllstatus } = useContext(RoomContext)
    /** 
     *  updates an asset and syncs it with the backend
     * @param body: essentially the body of the request
     * @param id: the id of the asset
     * @param method: the method to use [NEW, UPDATE, DELETE]
    */
    const changeAsset = async (body: object, id: string, method: methods) => {
        console.log("modifying room asset: ", body)
        let resp;
        switch (method) {
            case methods.NEW:
                resp = await postWithAuth("assets", body)
                if (resp) {
                    let newA = {
                        [resp.assetId]: {
                            "name": resp.name
                        }
                    }
                    setAssets({ ...assets, ...newA })
                }
                return resp.assetId
                break;
            case methods.UPDATE:
                resp = await patchWithAuth(`assets/${id}`, body)
                if (resp) {
                    let newAssets = { ...assets }
                    newAssets[id]["name"] = resp.name
                }
                break
            case methods.DELETE:
                resp = await deleteWithAuth(`assets/${id}`)
                if (resp) {
                    let newAssets = { ...assets }
                    delete newAssets[id]
                    setAssets(newAssets)
                }
                break;
        }
    }

    /**
         * modifies a room asset and syncs it with the backend (change count, delete...)
         * @param newAsset 
         * @param id 
         * @param method 
         */
    const changeRoomAsset = async (newAsset, id, method: methods) => {
        console.log("new asset: ", newAsset)
        let resp;
        switch (method) {
            case methods.NEW:
                console.log("creating new room asset: ", newAsset)
                resp = await postWithAuth("room-assets", newAsset)
                if (resp !== null) {
                    let newRooms = { ...rooms }
                    console.log(`newRooms: ${JSON.stringify(newRooms)}, resp: ${JSON.stringify(resp)}`)
                    newRooms[newAsset.roomId]["roomAsset"].push(resp)
                    setRooms(newRooms)
                }
                break;
            case methods.UPDATE:
                //change roomid or stuff like that
                console.log("patching room asset: ", newAsset)
                resp = await patchWithAuth(`room-assets/${id}`, newAsset)
                if (resp) {
                    let newRooms = { ...rooms }
                    let assets = newRooms[newAsset.roomId].roomAsset
                    for (let i = 0; i < assets.length; i++) {
                        if (assets[i].assetId === resp.assetId) {
                            assets[i].assetCount = resp.assetCount
                            assets[i].roomId = resp.roomId
                        }
                    }
                    setRooms(newRooms)
                }
                break;
            case methods.DELETE:
                console.log("deleting room asset: ", id)
                resp = await deleteWithAuth(`room-assets/${id}`)
                let newRooms = { ...rooms };
                let assets = newRooms[newAsset.roomId].roomAsset
                for (let i = 0; i < assets.length; i++) {
                    console.log(assets[i].id, id)
                    if (assets[i].id === id) {
                        delete assets[i]
                        break;
                    }
                }

                setRooms(newRooms)
                break;
        }
    }
    const changeRoomMetadata = async (key: string, value: string, id: string) => {
        let body = {
            "name": rooms[id].name,
            "roomNumber": rooms[id].number,
            "capacity": rooms[id].capacity,
            "maxDuration": rooms[id].maxDuration
        }
        body[key] = value
        let resp = await patchWithAuth(`room/${id}`, body)
        if (resp) {
            let newRooms = { ...rooms }
            newRooms[id][key] = value
            setRooms(newRooms)

        }
    }
    const createRoom = async (room: object) => {
        console.log("creating room: ", room)
        let resp = await postWithAuth("room", room)
        console.log("resp: ", resp)
        if (resp) {
            let newRooms = { ...rooms }
            newRooms[resp.id] = room
            await setRooms(newRooms)
        }
        return resp
    }

    const deleteRoom = async (roomId: string) => {
        let resp = await deleteWithAuth(`room/${roomId}`)
        if (resp) {
            let newRooms = { ...rooms }
            delete newRooms[roomId]
            await setRooms(newRooms)
        }
    }
    const deleteBooking = async (bookingId: string) => {
        let resp = await deleteWithAuth(`booking/${bookingId}`)
        let newRooms = { ...rooms }
        let bookings = newRooms[roomId].bookings
        for (let i = 0; i < bookings.length; i++) {
            if (bookings[i].id === bookingId) {
                delete bookings[i]
                break;
            }

        }
        setRooms(newRooms)
        getAllstatus()
    }
    const changeRoomType = async (typeId: string, id: string) => {

    }
    return { changeAsset, changeRoomAsset, changeRoomMetadata, deleteBooking, createRoom, deleteRoom }
}