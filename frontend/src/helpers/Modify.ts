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
    const { assets, setAssets, rooms, setRooms, getAllstatus, typeAssets, setTypeAssets, types, setTypes } = useContext(RoomContext)
    /** 
     *  updates an asset and syncs it with the backend
     * @param body: essentially the body of the request
     * @param id: the id of the asset
     * @param method: the method to use [NEW, UPDATE, DELETE]
    */
    const changeAsset = async (body: object, id: string, method: methods) => {
        console.log("modifying room asset: ", body)
        let resp;
        let oldAssets = { ...assets };
        let newAssets = { ...assets };
        switch (method) {
            case methods.NEW:
                resp = await postWithAuth("assets", body)
                if (resp) {
                    let newA = {
                        [resp.assetId]: {
                            "name": resp.name
                        }
                        //TODO something goes wrong here
                    }
                    setAssets({ ...assets, ...newA })
                }
                return resp.assetId
            case methods.UPDATE:
                try {
                    patchWithAuth(`assets/${id}`, body)
                    newAssets[id]["name"] = body.name
                    setAssets(newAssets)
                }
                catch (error) {
                    setAssets(oldAssets)
                }
                break
            case methods.DELETE:
                try {
                    deleteWithAuth(`assets/${id}`)
                    let newAssets = { ...assets }
                    delete newAssets[id]
                    setAssets(newAssets)
                }
                catch (error) {
                    setAssets(oldAssets)
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
        let oldRooms = { ...rooms };
        let newRooms = { ...rooms };
        switch (method) {
            case methods.NEW:
                console.debug("creating new room asset: ", newAsset)
                resp = await postWithAuth("room-assets", newAsset)
                if (resp !== null) {
                    let newRooms = { ...rooms }
                    console.debug(`newRooms: ${JSON.stringify(newRooms)}, resp: ${JSON.stringify(resp)}`)
                    newRooms[newAsset.roomId]["roomAsset"].push(resp)
                    setRooms(newRooms)
                }
                break;
            case methods.UPDATE:
                try {
                    patchWithAuth(`room-assets/${id}`, newAsset)
                    let assets = newRooms[newAsset.roomId].roomAsset
                    for (let i = 0; i < assets.length; i++) {
                        if (assets[i].assetId === resp.assetId) {
                            assets[i].assetCount = resp.assetCount
                            assets[i].roomId = resp.roomId
                        }
                    }
                    setRooms(newRooms)
                }
                catch (error) {
                    setRooms(oldRooms)
                }
                break;
            case methods.DELETE:
                console.debug("deleting room asset: ", id)
                try {
                    deleteWithAuth(`room-assets/${id}`)
                    let assets = newRooms[newAsset.roomId].roomAsset
                    for (let i = 0; i < assets.length; i++) {
                        if (assets[i].id === id) {
                            delete assets[i]
                            break;
                        }
                    }
                    
                    setRooms(newRooms)
                }
                catch (error) {
                    setRooms(oldRooms)
                }
                break;
        }
    }
    const changeType = async (newType, id, method: methods) => {
        console.log("new type: ", newType)
        let resp;
        let oldTypes = { ...types };
        let newTypes = { ...types };
        switch (method) {
            case methods.NEW:
                resp = await postWithAuth("types", newType)
                if (resp) {
                    newTypes[resp] = newType
                    setTypes(newTypes)
                }
                break;
            case methods.UPDATE:
                resp = await patchWithAuth(`types/${id}`, newType)
                if (resp) {
                    newTypes[id] = resp
                    setTypes(newTypes)
                }
                break;
            case methods.DELETE:
                try {
                    deleteWithAuth(`types/${id}`)
                    delete newTypes[id]
                    setTypes(newTypes)
                }
                catch (error) {
                    setTypes(oldTypes)
                }
                break;
        }
    }

    const changeTypeAsset = async (newAsset, id, method: methods) => {
        console.log("new typeAsset: ", newAsset)
        newAsset["typeId"] = newAsset["roomId"]
        delete newAsset["roomId"]
        let resp;
        switch (method) {
            case methods.NEW:
                console.debug("creating new type asset: ", newAsset)
                resp = await postWithAuth("type-assets", newAsset)
                if (resp !== null) {
                    let newTypeAssets = { ...typeAssets }
                    console.debug(`newTypeAssets: ${JSON.stringify(newTypeAssets)}, resp: ${JSON.stringify(resp)}`)
                    newTypeAssets[resp.id] = {
                        "typeId": resp.typeId,
                        "name": resp.name,
                        "assetCount": resp.assetCount,
                        "assetId": resp.assetId
                    }
                    setTypeAssets(newTypeAssets)
                }
                break;
            case methods.UPDATE:
                //change roomid or stuff like that
                console.debug("patching type asset: ", newAsset)
                resp = await patchWithAuth(`type-assets/${id}`, newAsset)
                if (resp) {
                    let newTypeAssets = { ...typeAssets }
                    newTypeAssets[id].assetCount = resp.assetCount
                    newTypeAssets[id].name = resp.name
                    newTypeAssets[id].typeId = resp.typeId
                    newTypeAssets[id].assetId = resp.assetId
                    console.log("newTypeAssets: ", newTypeAssets)
                    setTypeAssets(newTypeAssets)
                }
                break;
            case methods.DELETE:
                console.debug("deleting type asset: ", id)
                resp = await deleteWithAuth(`type-assets/${id}`)
                let newTypeAssets = { ...typeAssets };
                delete newTypeAssets[id]
                setTypeAssets(newTypeAssets)
                break;
        }
    }


    const changeRoomMetadata = async (key: string, value: string, id: string) => {
        let body = {
            "name": rooms[id].name,
            "roomNumber": rooms[id].number,
            "capacity": rooms[id].capacity,
            "maxDuration": rooms[id].maxDuration,
            "typeId": rooms[id].typeId
        }
        let oldRooms = { ...rooms };
        let newRooms = { ...rooms };
        body[key] = value
        try {
            patchWithAuth(`room/${id}`, body)
            newRooms[id][key] = value
            setRooms(newRooms)
        }
        catch (error) {
            setRooms(oldRooms)
        }
    }
    const createRoom = async (room: object) => {
        console.log("creating room: ", room)
        let resp = await postWithAuth("room", room)
        console.log("resp: ", resp)
        if (resp) {
            let newRooms = { ...rooms }
            let newRoom = {
                "roomId": resp,
                "name": room.name,
                "number": room.roomNumber,
                "capacity": room.capacity,
                "maxDuration": room.maxDuration,
                "typeId": room.typeId,
                "bookings": [],
                "roomAsset": []
            }
            newRooms[resp] = newRoom
            await setRooms(newRooms)
        }
        return resp
    }

    const deleteRoom = async (roomId: string) => {
        await deleteWithAuth(`room/${roomId}`)
        let newRooms = { ...rooms }
        delete newRooms[roomId]
        await setRooms(newRooms)
    }
    const deleteBooking = async (bookingId: string, c_roomId: string = roomId) => {
        let oldRooms = { ...rooms };
        let newRooms = { ...rooms };
        console.log("c_roomId: ", c_roomId)
        console.log("deleting booking: ", bookingId, oldRooms)
        try {
            await deleteWithAuth(`booking/${bookingId}`)
            newRooms[c_roomId].bookings = newRooms[c_roomId].bookings.filter(booking => 
                booking.id !== bookingId
            );
            setRooms(newRooms)
            getAllstatus()
        }
        catch (error) {
            setRooms(oldRooms)
            throw error
        }
    }

    const createBooking = async (booking: object) => {
        const resp =await postWithAuth("booking/create", booking)
        console.log("created booking: ", resp)
        let newRooms = { ...rooms }
        const newBooking = {
            "id": resp.bookingId,
            "userId": booking.userId,
            "roomId": null, // /room api endpoint also returns null (prevent re renders)
            "start": booking.startDate,
            "end": booking.endDate,
        }
        newRooms[resp.roomId].bookings.push(newBooking)
        setRooms(newRooms)
    }

    const changeBooking = async (booking: object) => {
        let oldRooms = { ...rooms };
        let newRooms = { ...rooms };
        try {
            patchWithAuth(`booking/${booking.id}`, booking)
            newRooms[booking.roomId].bookings = newRooms[booking.roomId].bookings.map(booking => 
                booking && booking.id === booking.id ? booking : null
            );
            setRooms(newRooms)
        }
        catch (error) {
            setRooms(oldRooms)
        }
    }
    return { 
        changeAsset, 
        changeRoomAsset, 
        changeTypeAsset,
        changeRoomMetadata, 
        changeType,
        deleteBooking,
        changeBooking,
        createRoom, 
        deleteRoom, 
        createBooking 
    }
}