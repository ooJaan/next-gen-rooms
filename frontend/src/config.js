const config = {
    apiUrl: process.env.REACT_APP_API_URL || 'https://api.baumi.me',
    minutenStep: 5*60,
    "Polling_s" : {
        "rooms": 20
    }
};

export default config;