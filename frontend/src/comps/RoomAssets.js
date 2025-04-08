import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

import { RoomContext } from '../provider/RoomStatus.tsx';
import { useModify, methods} from '../helpers/Modify.ts';


import MultiSelect from '../comps/MultiSelect.js';
import Table from './Table.js';
import { useApi } from '../helpers/api.js';

const AssetsToOptions = (allAssets, usedAssets) => {
    console.log(allAssets, usedAssets)
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
    console.log("options: ", options)
    return options
}

/**
 * 
 * @param {*} name           name of the assets
 * @param {*} id             roomId or typeId
 * @param {*} assets         all assets
 * @param {*} assetsLoading  loading state of assets
 * @param {*} anyAsset       assets of the room or type (typeAsset or roomAsset)
 * @param {*} changeAnyAsset change function of the assets
 * @returns rea
 */

const RoomAssets = ({ name, id, roomId, assets, assetsLoading, anyAsset, changeAnyAsset}) => {
    const [options, setOptions] = useState({});
    const [newOptions, setNewOptions] = useState([])
    const [value, setValue] = useState([]);
    const [stueck, setStueck] = useState(1);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    //const { rooms, assets, assetsLoading } = useContext(RoomContext)
    const {changeAsset} = useModify()

    
    console.log("id: ", id)

    useEffect(() => {
        console.log("assets to options: used assets: ", anyAsset)
        setOptions(AssetsToOptions(assets, anyAsset))
    }, [anyAsset, assets]);

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
        console.log(newOptions.length);
        var newOpts = {}
        for (let i = 0; i < newOptions.length; i++) {
            console.log("new asset that needs syncing to backend: ", newOptions[i])
            try {
                const newAssetId = await changeAsset({ "name": newOptions[i] }, newOptions[i], methods.NEW)
                console.log("new asset created id: ", newAssetId)
                await changeAnyAsset({ "roomId": id, "assetId": newAssetId, "assetCount": stueck }, newOptions[i], methods.NEW)
            }
            catch (error) {
                console.log("error: ", error)
            }
        }
        if (Object.keys(newOpts).length > 0) {
            console.log("setting all new assets with new options: ", JSON.stringify(newOpts))
            //setAllAssets({ ...assets, ...newOpts })
        }
        console.log(value, stueck);
        for (let i = 0; i < value.length; i++) {
            var v = value[i]
            await changeAnyAsset({ "roomId": id, "assetId": v.value, "assetCount": stueck }, v.value, methods.NEW)
        }
        setValue([])
    }
    const onDelete = (delete_id) => {
        console.log("deleting with id: ", delete_id)
        changeAnyAsset({"roomId": id}, delete_id, methods.DELETE)
    }
    const onCreate = (inputValue) => {
        for (let key in anyAsset) {
            var value = anyAsset.filter(asset => asset.name === inputValue)
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

    const onStueckAssetChange = (e, anyId, assetId) => {
        const req = {
            "roomId": id,
            "assetId": assetId,
            "assetCount": e.target.value
        }
        changeAnyAsset(req, anyId, methods.UPDATE)
    }

    const columns = [
        { key: 'name', label: 'Name', sortable: true },
        { 
            key: 'assetCount', 
            label: 'Stück',
            sortable: true,
            render: (row) => (
                <input
                    type="number"
                    value={row.assetCount}
                    min="1"
                    onChange={(e) => onStueckAssetChange(e, row.id, row.assetId)}
                />
            )
        },
        { 
            key: 'actions', 
            label: 'Delete',
            sortable: false,
            render: (row) => (
                <button onClick={() => onDelete(row.id)}>Delete</button>
            )
        }
    ];

    const tableData = Object.entries(anyAsset).map(([key, data]) => ({
        id: data.id,
        name: assets[data.assetId].name,
        assetCount: data.assetCount,
        assetId: data.assetId
    }));

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
                    data={tableData}
                    columns={columns}
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