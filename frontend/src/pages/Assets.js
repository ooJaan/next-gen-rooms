import { useEffect, useState, useContext } from "react";
import { RoomContext } from "../provider/RoomStatus.tsx";
import Loading from "../comps/Loading";
import Table from "../comps/Table";
import { useModify, methods } from "../helpers/Modify.ts";
import BaseLayout from "./BaseLayout";
import AssetDialog from "../comps/AssetDialog";

const Assets = ( {assetDialogClosed, setAssetDialogClosed} ) => {
    const { assets, assetsLoading } = useContext(RoomContext)
    const { changeAsset } = useModify()

    if (assetsLoading) {
        return <Loading />
    }

    const tableData = Object.entries(assets).map(([key, row]) => ({
        name: row.name,
        id: key
    }));
    const columns = [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'delete', label: 'Löschen', sortable: false, render: (row) => (
            <button onClick={() => changeAsset({} ,row.id, methods.DELETE)}>Löschen</button>
        )}
    ]

    return (
        <>
            <Table data={tableData} columns={columns} head={<tr><th>Name</th><th>Löschen</th></tr>} />
            <AssetDialog 
                setClosed={setAssetDialogClosed}
                modalClosed={assetDialogClosed}
            />
        </>
    )
    
}

export default Assets
