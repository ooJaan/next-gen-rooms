import Modal from '../comps/Modal';
import { useState, useEffect } from 'react';
import { useModify } from '../helpers/Modify.ts';
import { useNavigate } from 'react-router-dom';

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


const ModalContent = ({closeModal}) => {
    const [error, setError] = useState(null)
    const [disabled, setDisabled] = useState(true)
    const [roomName, setRoomName] = useState('')
    const [roomNumber, setRoomNumber] = useState('')
    const [roomCapacity, setRoomCapacity] = useState('')
    const [roomType, setRoomType] = useState('')
    const [maxBookingDuration, setMaxBookingDuration] = useState('')
    const navigate = useNavigate()

    const { createRoom } = useModify()

    useEffect(() => {
        if (roomName && roomNumber && roomCapacity && roomType && maxBookingDuration) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
        //todo numberchecking 
    }, [roomName, roomNumber, roomCapacity, roomType, maxBookingDuration])
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const resp = await createRoom({
                name: roomName,
                roomNumber: roomNumber,
                capacity: roomCapacity,
                maxBookingDuration: maxBookingDuration,
                typeId: roomType
            })
            await new Promise(resolve => setTimeout(resolve, 100));
            navigate(`/edit/${resp}`)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            <h1>Neuen Raum erstellen</h1>
            <div className="error">{error}</div>
            <form>
                <input type="text" placeholder="Room Name" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
                <input type="text" placeholder="Room Number" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} />
                <input type="text" placeholder="Room Capacity" value={roomCapacity} onChange={(e) => setRoomCapacity(e.target.value)} />
                <input type="text" placeholder="Room Type" value={roomType} onChange={(e) => setRoomType(e.target.value)} />
                <input type="number" placeholder="Maximale Buchungsdauer" value={maxBookingDuration} onChange={(e) => setMaxBookingDuration(e.target.value)} />
                <button disabled={disabled} onClick={(e) => handleSubmit(e)}>Create Room</button>
            </form>
        </div>
    )
}

export default NewRoom