import { useEffect, useState, useContext } from "react";
import { RoomContext } from "../provider/RoomStatus.tsx";
import Loading from "../comps/Loading";
import Table from "../comps/Table";
import { useModify, methods } from "../helpers/Modify.ts";
import BaseLayout from "./BaseLayout";
import TypeDialog from "../comps/TypeDialog";

const Types = ( {typeDialogClosed, setTypeDialogClosed} ) => {
    const { types, typesLoading } = useContext(RoomContext)
    const { changeType } = useModify()

    if (typesLoading) {
        return <Loading />
    }


    const tableData = Object.entries(types).map(([key, row]) => ({
        name: row.name,
        id: key
    }));
    const columns = [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'delete', label: 'Löschen', sortable: false, render: (row) => (
            <button onClick={() => changeType({} ,row.id, methods.DELETE)}>Löschen</button>
        )}
    ]

    return (
        <>
            <Table data={tableData} columns={columns} head={<tr><th>Name</th><th>Löschen</th></tr>} />
            <TypeDialog 
                setClosed={setTypeDialogClosed}
                modalClosed={typeDialogClosed}
            />
        </>
    )
    

}

export default Types