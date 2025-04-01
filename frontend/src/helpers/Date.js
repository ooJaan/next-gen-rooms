


const useDate = () => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('de-DE', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };
    return {
        formatDate,
        formatTime
    }
}
export default useDate;