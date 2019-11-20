const mapLayers = {
    googleStreets: L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        attribution: `Google Streets`,
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }),
    googleHybrid: L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
        attribution: `Google Hybrid`,
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }),
    googleSat: L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        attribution: `Google Satellite`,
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }),
    googleTerrain: L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
        attribution: `Google Terrain`,
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }),
    esri: L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'esri',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1Ijoiam9udHJ1b25nIiwiYSI6ImNrMnpteHlxdDA0Z24zaW5zdnh2dHRkNnYifQ.2TcrWXV6vkhipQnqDt_Qgw'
    }),
    // weatherMaps : L.tileLayer(`http://maps.openweathermap.org/maps/2.0/weather/TA2/{z}/{x}/{y}?appid={${weatherOpen}}`, {
    //     attribution: `Open Weather Maps`,
    // })
};