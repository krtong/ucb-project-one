//firebase

// firebase.initializeApp({
//     apiKey: "api-key",
//     authDomain: "project-id.firebaseapp.com",
//     databaseURL: "https://project-id.firebaseio.com",
//     projectId: "project-id",
//     storageBucket: "project-id.appspot.com",
//     messagingSenderId: "sender-id",
//     appId: "app-id",
//     measurementId: "G-measurement-id",
// });
// var database = firebase.database();

//firebase authorization
//can't figure out how to do this without NPM/Node

// Fake data until we get firebase working... 
let userData = {
    pushkey1: {
        userName: 'Kevin Tong',
        hashedpw: 'password',
        images: {
            thumb: 'https://www.fillmurray.com/64/64',
            full: 'https://www.fillmurray.com/400/400'
        }
    }
}

//the jibberish is meant to represent pushkeys
let threadData = {
    dwlkjdKNDknddskdn: {
        lat: 37.898968718507604,
        lon: -122.06153870073815,
        heading: `This Taco Joint is da Bomb`,
        body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis id nulla leo. Morbi venenatis quam egestas mi euismod tempor. Proin eleifend tellus quis ex molestie commodo. Vestibulum sit amet hendrerit risus. Duis vitae pulvinar turpis. Vestibulum id volutpat enim. Nunc vel nibh eget sem finibus lacinia vel eu augue. Phasellus eget quam tortor. Proin volutpat massa et metus efficitur consequat. Vestibulum at leo at ex euismod venenatis euismod vel tellus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce mi metus, fringilla sed venenatis viverra, ultrices vel metus.<br/><br/>
        Ut sagittis dapibus nibh. Nullam tempor in augue ac aliquet. Duis tristique felis mi, et suscipit lacus pretium sed. Morbi maximus nisl non nibh semper, a congue velit efficitur. Donec vitae purus sed sem lobortis pellentesque sed at erat. Donec vulputate libero feugiat mi eleifend tincidunt et non nunc. Nullam commodo turpis odio, id gravida ligula porttitor at.`,
        dateCreated: `2019-10-04 20:49:41`,
        user: userData.pushkey1
    },
    SMDSNKwkjendasdnawe: {
        lat: 37.89029895048281,
        lon: -122.05570221443803,
        heading: `Crazy Car Crash here`,
        body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis id nulla leo. Morbi venenatis quam egestas mi euismod tempor. Proin eleifend tellus quis ex molestie commodo. Vestibulum sit amet hendrerit risus. Duis vitae pulvinar turpis. Vestibulum id volutpat enim. Nunc vel nibh eget sem finibus lacinia vel eu augue. Phasellus eget quam tortor. Proin volutpat massa et metus efficitur consequat. Vestibulum at leo at ex euismod venenatis euismod vel tellus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce mi metus, fringilla sed venenatis viverra, ultrices vel metus.<br/><br/>
        Ut sagittis dapibus nibh. Nullam tempor in augue ac aliquet. Duis tristique felis mi, et suscipit lacus pretium sed. Morbi maximus nisl non nibh semper, a congue velit efficitur. Donec vitae purus sed sem lobortis pellentesque sed at erat. Donec vulputate libero feugiat mi eleifend tincidunt et non nunc. Nullam commodo turpis odio, id gravida ligula porttitor at.`,
        dateCreated: `2019-10-04 20:49:41`,
        user: userData.pushkey1
    },
    kskrnkAKJskndwmasdw: {
        lat: 37.901813263649665,
        lon: -122.06102371665287,
        heading: `House Party at 8:00 am`,
        body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis id nulla leo. Morbi venenatis quam egestas mi euismod tempor. Proin eleifend tellus quis ex molestie commodo. Vestibulum sit amet hendrerit risus. Duis vitae pulvinar turpis. Vestibulum id volutpat enim. Nunc vel nibh eget sem finibus lacinia vel eu augue. Phasellus eget quam tortor. Proin volutpat massa et metus efficitur consequat. Vestibulum at leo at ex euismod venenatis euismod vel tellus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce mi metus, fringilla sed venenatis viverra, ultrices vel metus.<br/><br/>
        Ut sagittis dapibus nibh. Nullam tempor in augue ac aliquet. Duis tristique felis mi, et suscipit lacus pretium sed. Morbi maximus nisl non nibh semper, a congue velit efficitur. Donec vitae purus sed sem lobortis pellentesque sed at erat. Donec vulputate libero feugiat mi eleifend tincidunt et non nunc. Nullam commodo turpis odio, id gravida ligula porttitor at.`,
        dateCreated: `2019-10-04 20:49:41`,
        user: userData.pushkey1
    }
}
// useless but funny
const bRCG = () => 'primary success danger warning info light'.split(' ')[Math.floor(Math.random() * 5)];

let mymap = L.map('mapid')
mymap.setView([17.73969749165746, -21.14395000623526], 2);
$(`#button2`).attr("class", `btn btn-${bRCG()} map-btn`)

mapLink = '<a href="http://www.esri.com/">Esri</a>';
wholink = 'i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';

// these are various layers I've found online.
let mapLayers = {
    googleStreets: L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }),
    googleHybrid: L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }),
    googleSat: L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }),
    googleTerrain: L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }),
    esri: L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; ' + mapLink + ', ' + wholink,
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1Ijoiam9udHJ1b25nIiwiYSI6ImNrMnpteHlxdDA0Z24zaW5zdnh2dHRkNnYifQ.2TcrWXV6vkhipQnqDt_Qgw'
    }),
    terminator:  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
}
//this is how you change which layer is shown.
let currentLayer = mapLayers.googleHybrid;

const initializeLayer = (layer) => layer.addTo(mymap);
initializeLayer(currentLayer);
L.terminator().addTo(mymap)

// mymap.addLayer(L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'));
const toggleLayer = function togglesBetweenMapLayers (event) {
    let btnNumber = parseInt($(this).attr("number"))-1;
    let key = Object.keys(mapLayers)
    currentLayer.remove()
    currentLayer = mapLayers[key[btnNumber]];
    initializeLayer(currentLayer);
    $(".map-btn").attr("class", "btn btn-secondary map-btn")
    $(`#button${btnNumber+1}`).attr("class", `btn btn-${bRCG()} map-btn`)

}


//changes the values of lat/on on the document.
const changeLatLon = function changesLatAndLongOnDocument(lat, lon){
    $("#lat").text(lat.toFixed(5));
    $('#lon').text(lon.toFixed(5));
}

// go to location
if ('geolocation' in navigator) {
        console.log('geolocation available');
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            //flies to location
            // changeLatLon(lat, lon)
            mymap.flyTo([lat, lng], 13);
            renderCoords('', {lat,lng});
            //adds marker
            var marker = L.marker([lat, lng]).addTo(mymap);
        });
    } else {
        console.log("geolocation not available")
    };
;

//some random circle in london
L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(mymap);
// some random polygon in london
var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(mymap);
//create popup onclick
var popup = L.popup();
const onMapClick = function coordinatesPopUpOnMapClick(e) {
    popup.setLatLng(e.latlng).setContent("You clicked the map at " + e.latlng.toString()).openOn(mymap);
    let {lat, lng} = e.latlng;
    console.log([lat, lng]);
    $.get(
        `https://weather.cit.api.here.com/weather/1.0/report.json?product=observation&latitude=${lat}&longitude=%20-${lng}&oneobservation=true&app_id=DemoAppId01082013GAL&app_code=AJKnXv84fjrb0KIHawS0Tg`,
        function(data, status){
            console.log("get")
            console.log(data)
            console.logg(status)
        }
    )

    renderCoords('', e.latlng)
};

const findAndSortThreadsNearby = function findsThreadsOnMapAndSortsByDistance(latlng1) {
    let keys = Object.keys(threadData);
    let distances = [];
    // get distances from center of map
    for (let i = 0; i < keys.length; i++) {
        let {lat,lon} = threadData[keys[i]];
        let latlng2 = [lat, lon];
        distances.push([i, mymap.distance(latlng1, latlng2)]);
    };
    // sort threads by distances
    distances.sort((a, b) => a[1] > b[1] ? 1 : -1).forEach((a, i) => distances[i][0] = threadData[keys[a[0]]]);
    //add threadObjects to distance array and send both the distances and the threadObjects to the thread-populate function.
    populateThreads(distances)
};

const renderCoords = function updateAllCoorsOnDocument(e, latlng) {
    let {lat,lng} = latlng ? latlng : mymap.getCenter();
    changeLatLon(lat, lng);
    findAndSortThreadsNearby([lat, lng]);
}

let threadMarkerArray = [];
const populateThreads = function repopulatesThreadTableWheneverInvoked(threadArr) {
    //remove old markers before repopulating
    if (threadMarkerArray[0] !== undefined) {
        threadMarkerArray.forEach(a => a.remove())
        threadMarkerArray = [];
    }
    //create html
    let html = '';
    threadArr.forEach((cur, idx) => {
        //easier variables
        let {lat,lon,heading,body,dateCreated,user} = cur[0];
        let {userName,images} = user;
        let {thumb} = images;
        let distance = cur[1] * 3.28084; //converted from meters to  feet
        let distanceString = distance < 900 ? `${distance.toFixed(0)} feet` : distance < 1500 ? `${(distance/3).toFixed(0)} yards` : `${(distance*0.000189394).toFixed(1)} miles`
        let fullDate = ((date = dateCreated) => `${['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'Septemper', 'October', 'November', 'December'][date.slice(5, 7)-1]} ${parseInt(date.slice(8, 10))}, ${date.slice(0, 4)}`)();
        let blurb = body.length > 140 ? `${body.slice(0, 140)}...` : body;
        let colorFirstPost = idx === 0 ? 'active' : '';
        //we can change this html to whatever format you want.
        html += `
            <a href="#" class="list-group-item list-group-item-action ${colorFirstPost}">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">
                        ${heading}
                    </h5>
                    <small>
                        ${fullDate}
                    </small>
                </div>
                <p class="mb-1">
                    ${blurb}
                </p>
                <small>
                    By <img src="${thumb}" style="border-radius: 50%; margin: 0 3px 0 1px;" height="18px" width="18px">
                    ${userName} | distance: ${distanceString} | 10 new replies
                </small>
            </a>
            `;
        //create new markers
        threadMarkerArray.push(L.marker([lat, lon]).addTo(mymap));
    });
    //append html to threadlist
    $('#thread-list').html(html)
};

//initialize event handlers
mymap.on('drag', renderCoords);
mymap.on('click', onMapClick);
$(document).on('click', ".map-btn", toggleLayer)