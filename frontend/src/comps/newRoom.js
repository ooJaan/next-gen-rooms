import Modal from '../comps/Modal';
import { useState, useEffect, useContext } from 'react';
import { useModify } from '../helpers/Modify.ts';
import { useNavigate } from 'react-router-dom';
import { RoomContext } from '../provider/RoomStatus.tsx';
import Select from 'react-select';

const NewRoom = ({setClosed, modalClosed}) => {
    const closeModal = () => {
        setClosed(true)
    }
    return (
        <Modal
            content={<ModalContent closeModal={closeModal}/>}
            setClosed={setClosed}
            onClose={closeModal}
            closed={modalClosed}
        />
    )
}

const Types2Options = (types) => {
    var options = []
    for (let key in types) {
        options.push({
            "label": types[key].name,
            "value": key
        })
    }
    return options
}


const ModalContent = ({closeModal}) => {
    const [error, setError] = useState(null)
    const [disabled, setDisabled] = useState(true)
    const [roomName, setRoomName] = useState('')
    const [roomNumber, setRoomNumber] = useState('')
    const [roomCapacity, setRoomCapacity] = useState('')
    const [roomType, setRoomType] = useState('')
    const [maxBookingDuration, setMaxBookingDuration] = useState('')

    const [roomTypeOptions, setRoomTypeOptions] = useState([])

    const { types, typesLoading } = useContext(RoomContext)
    const navigate = useNavigate()

    const { createRoom } = useModify()

    useEffect(() => {
        if (roomName && roomNumber && roomCapacity && roomType && maxBookingDuration) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
        //todo checking numbers 
    }, [roomName, roomNumber, roomCapacity, roomType, maxBookingDuration])

    useEffect(() => {
        if (typesLoading) {
            return
        }
        setRoomTypeOptions(Types2Options(types))
    }, [types])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const resp = await createRoom({
                name: roomName,
                roomNumber: roomNumber,
                capacity: roomCapacity,
                maxDuration: maxBookingDuration,
                typeId: roomType
            })
            console.log("created new room:", resp)
            navigate(`/edit/${resp}`)
        } catch (error) {
            if (error.name === "Bad Request") {
                setError(error.error)
            } else {
                setError("Ein unbekannter Fehler ist aufgetreten")
            }
        }
    }


    return (
        <div className="new-room-container">
            <h1>Neuen Raum erstellen</h1>
            <div className="error">{error}</div>
            <form>
                <input type="text" placeholder="Room Name" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
                <input type="text" placeholder="Room Number" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} />
                <input type="text" placeholder="Room Capacity" value={roomCapacity} onChange={(e) => setRoomCapacity(e.target.value)} />
                <Select 
                    options={roomTypeOptions} 
                    onChange={(e) => setRoomType(e.value)} 
                    placeholder="Raum Typ"
                />
                <input type="number" placeholder="Maximale Buchungsdauer" value={maxBookingDuration} onChange={(e) => setMaxBookingDuration(e.target.value)} />
                <button disabled={disabled} onClick={(e) => handleSubmit(e)}>Create Room</button>
            </form>
        </div>
    )
}

export default NewRoom