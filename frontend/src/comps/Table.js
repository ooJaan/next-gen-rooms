
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
}