import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

import { RoomContext } from '../provider/RoomStatus.tsx';
import { useModify, methods} from '../helpers/Modify.ts';


import MultiSelect from '../comps/MultiSelect.js';
import Table from './Table.js';
import { useApi } from '../helpers/api.js';

const AssetsToOptions = (allAssets, usedAssets) => {
    //console.log(allAssets, usedAssets)
    var options = [];
    var newAllAssets = {...allAssets}
    for (let i = 0; i < usedAssets.length; i++) {
        delete newAllAssets[usedAssets[i].assetId]
    }
    for (let key in newAllAssets) {
        options.push({
            "label": newAllAssets[key]["name"],
            "value": key,
        })
    }
    //console.log(options)
    return options
}

const RoomAssets = ({ name, roomId}) => {
    const [options, setOptions] = useState({});
    const [newOptions, setNewOptions] = useState([])
    const [value, setValue] = useState([]);
    const [stueck, setStueck] = useState(1);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const { rooms, assets, assetsLoading } = useContext(RoomContext)
    const {changeAsset, changeRoomAsset} = useModify()

    


    useEffect(() => {
        console.log("assets to options: used assets: ", rooms[roomId]["roomAsset"])
        setOptions(AssetsToOptions(assets, rooms[roomId]["roomAsset"]))
    }, [rooms[roomId]["roomAsset"], assets]);

    useEffect(() => {
        if (value.length > 0 & stueck > 0) {
            setButtonDisabled(false)
        }
        else {
            setButtonDisabled(true)
        }
    }, [value, stueck])
    const handleSubmit = async (e) => {
        e.preventDefault();
        var dict = {};
        console.log(newOptions.length);
        var newOpts = {}
        for (let i = 0; i < newOptions.length; i++) {
            console.log("new asset that needs syncing to backend: ", newOptions[i])
            try {
                const newAssetId = await changeAsset({ "name": newOptions[i] }, newOptions[i], methods.NEW)
                console.log("new asset created id: ", newAssetId)
                await changeRoomAsset({ "roomId": roomId, "assetId": newAssetId, "assetCount": stueck }, newOptions[i], methods.NEW)
            }
            catch (error) {
                console.log("error: ", error)
            }
        }
        if (Object.keys(newOpts).length > 0) {
            console.log("setting all new assets with new options: ", JSON.stringify(newOpts))
            //setAllAssets({ ...assets, ...newOpts })
        }
        //console.log(value, stueck);
        for (let i = 0; i < value.length; i++) {
            var v = value[i]
            changeRoomAsset({ "roomId": roomId, "assetId": v.value, "assetCount": stueck }, v.value, methods.NEW)
        }
        setValue([])
        //TODO: update the backend
    }
    const onDelete = (id) => {
        console.log("deleting with id: ", id)
        changeRoomAsset({"roomId": roomId}, id, methods.DELETE)
        //TODO: update the backend
    }
    const onCreate = (inputValue) => {
        for (let key in rooms[roomId]["roomAsset"]) {
            var value = rooms[roomId]["roomAsset"].filter(asset => asset.name === inputValue)
            console.log(value)
            if (value.name === inputValue) {
                console.log("option already exists in used assets")
                return
            }
        }
        const newOption = { "label": inputValue, "value": inputValue }
        setNewOptions([...newOptions, inputValue])
        setOptions((prev) => [...prev, newOption]);
        console.log("new Option created: ", newOptions)
        setValue((value) => [...value || [], newOption]);
    }
    const onStueckChange = (e) => {
        // number of the input field
        setStueck(e.target.value)

    }

    const onStueckAssetChange = (e, id, assetId) => {
        const req = {
            "roomId": roomId,
            "assetId": assetId,
            "assetCount": e.target.value
        }
        changeRoomAsset(req, id, methods.UPDATE)
    }
    if (assetsLoading) {
        return <h1>Loading...</h1>
    }
    return (
        <div className="assets">
            <h1>{name}</h1>
            <div>
                <Table
                    head={
                        <tr>
                            <th>Name</th>
                            <th>Stück</th>
                            <th>Delete</th>
                        </tr>
                    }
                    body={Object.entries(rooms[roomId]["roomAsset"]).map(([id, data]) => (
                        <tr key={id}>
                            <td>{assets[data.assetId].name}</td>
                            <td>
                                <input
                                    type="number"
                                    value={data.assetCount}
                                    min="1"
                                    onChange={(e) => onStueckAssetChange(e, data.id, data.assetId)}
                                />
                            </td>

                            <td><button onClick={() => onDelete(data.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                />
            </div>
            <div className="asset-selector">
                <MultiSelect
                    options={options}
                    setOptions={setOptions}
                    value={value}
                    setValue={setValue}
                    handleCreate={onCreate}
                />
                <div>
                    <input
                        type="number"
                        min="1"
                        value={stueck}
                        onChange={onStueckChange}
                    />
                </div>
                <div>
                    <button
                        disabled={buttonDisabled}
                        onClick={handleSubmit}
                    >Hinzufügen</button>
                </div>
            </div>
        </div>
    )

}

export default RoomAssets;