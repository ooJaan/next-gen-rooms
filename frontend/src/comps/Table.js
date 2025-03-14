import "../css/Table.css"


const Table = ( {head, body}) => {
    return (
        <table className="custom-table">
            <thead>
                {head}
            </thead>
            <tbody>
                {body}
            </tbody>
        </table>
    )
};

export default Table;