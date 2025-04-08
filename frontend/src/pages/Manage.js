import { useContext, useState } from "react";

import Types from "./Types.js";
import Assets from "./Assets.js";
import BaseLayout from "./BaseLayout.js";
import { RoomContext } from "../provider/RoomStatus.tsx";
import Loading from "../comps/Loading.js";

const Manage = () => {
    const {assetsLoading, typesLoading } = useContext(RoomContext)
    const [assetDialogClosed, setAssetDialogClosed] = useState(true)
    const [typeDialogClosed, setTypeDialogClosed] = useState(true)
    if (assetsLoading || typesLoading) {
        return <Loading />
    }   
    const actions = [
        <button onClick={() => setAssetDialogClosed(false)}>Neues Ausstattungsartikel</button>,
        <button onClick={() => setTypeDialogClosed(false)}>Neuer Raumtyp</button>
    ]

    const content = (
        <div className="flex-horizontal room-edit-container">
            <div className="surface grow">
                <h1>Raumtypen bearbeiten</h1>
                <Types 
                    typeDialogClosed={typeDialogClosed} 
                    setTypeDialogClosed={setTypeDialogClosed} 
                />
            </div>
            <div className="surface grow">
                <h1>Ausstattungsartikel bearbeiten</h1>
                <Assets 
                    assetDialogClosed={assetDialogClosed} 
                    setAssetDialogClosed={setAssetDialogClosed} 
                />
            </div>
        </div>
    )

    return (
        <BaseLayout title="Verwaltung" content={content} actions={actions} />
    )
}

export default Manage;