import data from '../data/rooms.json'

import Modal from '../comps/Modal';
import { useParams } from 'react-router-dom';
import '../css/RoomOverview.css'

const RoomOverview = () => {
    const { id } = useParams();
    return (
        <div class="overview-container">
            <div>
                <h1>Ausstattung {id}</h1>
            </div>
            <div>
                <h1>Buchungen</h1>
            </div>
        </div>
    )
}
export default RoomOverview;