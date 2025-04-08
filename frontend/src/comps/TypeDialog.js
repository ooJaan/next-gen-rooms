import Modal from '../comps/Modal';
import { useState } from 'react';
import { useModify, methods } from '../helpers/Modify.ts';

const TypeDialog = ({ setClosed, modalClosed }) => {
    console.log("TypeDialog", setClosed, modalClosed)

    const closeModal = () => {
        setClosed(true)
    }
    return (
        <Modal 
            content={<ModalContent setClosed={setClosed} />} 
            setClosed={setClosed} 
            onClose={closeModal}
            closed={modalClosed} 
        />
    )
}

const ModalContent = ({ setClosed }) => {
    const [name, setName] = useState("");
    const { changeType } = useModify();

    const submit = () => {
        changeType({ name: name }, "", methods.NEW)
        setClosed(true)
    }

    return (
        <>
            <h1>Neuen Raumtyp anlegen</h1>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <button onClick={submit}>Anlegen</button>
        </>
    )
}

export default TypeDialog;
