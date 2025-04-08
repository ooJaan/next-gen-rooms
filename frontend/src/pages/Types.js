import { useEffect, useState, useContext } from "react";
import { RoomContext } from "../provider/RoomStatus";
import Loading from "../comps/Loading";
import Table from "../comps/Table";

const Types = () => {
    const { types, typesLoading } = useContext(RoomContext)
    if (typesLoading) {
        return <Loading />
    }
    return <Table data={types} columns={["name", "description"]} />
}

export default Types