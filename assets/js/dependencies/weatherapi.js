var settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://community-open-weather-map.p.rapidapi.com/weather?callback=test&id=2172797&units=%2522metric%2522%20or%20%2522imperial%2522&mode=xml%252C%20html&q=London%252Cuk",
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
		"x-rapidapi-key": "6d3c1feb20msh822810202791af6p1ebb53jsn5d19af241004"
	}
}



const options = {
    key: apiKey.windy, // REPLACE WITH YOUR KEY !!!

    // Changing Windy parameters at start-up time
    // (recommended for faster start-up)
    lat: 50.4,
    lon: 14.3,
    zoom: 5,

    timestamp: Date.now() + 3 * 24 * 60 * 60 * 1000,

    hourFormat: '12h',

    // ...etc
};

    // windyInit(options, windyAPI => {
    //     const { store } = windyAPI;
    //     // All the params are stored in windyAPI.store

    //     const levels = store.getAllowed('availLevels');
    //     // levels = ['surface', '850h', ... ]
    //     // Getting all available values for given key

    //     let i = 0;
    //     setInterval(() => {
    //         i = i === levels.length - 1 ? 0 : i + 1;

    //         // Changing Windy params at runtime
    //         store.set('level', levels[i]);
    //     }, 500);

    //     // Observing change of .store value
    //     store.on('level', level => {
    //         console.log(`Level was changed: ${level}`);
    //     });
    // });