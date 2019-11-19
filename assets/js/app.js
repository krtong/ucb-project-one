

// states are either 'thread list', 'create thread', 'create post',
let state = 'thread list'
console.log(state)

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

// let database = firebase.database();


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

////////// DATA OBJECTS ///////////
// for ESRI
mapLink = '<a href="http://www.esri.com/">Esri</a>';
wholink = 'i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
// let weatherOpen = `a448b20824`+`a829df46169`+`895466e5e13`

//the jibberish is meant to represent pushkeys
let threadData = {
    dwlkjdKNDknddskdn: {
        geohash:'',
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
};

// these are letious layers I've found online.
let mapLayers = {
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
        attribution: '&copy; ' + mapLink + ', ' + wholink,
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1Ijoiam9udHJ1b25nIiwiYSI6ImNrMnpteHlxdDA0Z24zaW5zdnh2dHRkNnYifQ.2TcrWXV6vkhipQnqDt_Qgw'
    }),
    // weatherMaps : L.tileLayer(`http://maps.openweathermap.org/maps/2.0/weather/TA2/{z}/{x}/{y}?appid={${weatherOpen}}`, {
    //     attribution: `Open Weather Maps`,
    // })
};
//////////END DATA OBJECTS ///////////





////////// INITIALIZE PAGE ///////////

// initialize map
let mymap = L.map('mapid');
mymap.setView([17.73969749165746, -21.14395000623526], 2);

//initial layer shown on pageload
let currentLayer = mapLayers.googleHybrid;

// set initial values for map layers
const initializeLayer = (layer) => layer.addTo(mymap);
initializeLayer(currentLayer);
L.terminator().addTo(mymap)

// useless but funny button color creator
const bRCG = () => 'primary success danger warning info light'.split(' ')[Math.floor(Math.random() * 5)];

//populate layer buttons 
$("#layer-btns-go-here").html(function(){
    let html = '<button type="button" class="btn btn-secondary disabled map-btn">Map layers:</button>'
    Object.keys(mapLayers).forEach((a, i)=> html += `
    <button id="button${i+1}" type="button" class="btn btn-secondary map-btn" number="${i+1}">${i+1}</button>
    `);
    return html;
})
$(`#button2`).attr("class", `btn btn-${bRCG()} `)


// on button click change layer values 
const toggleLayer = function togglesBetweenMapLayers(event) {
    let btnNumber = parseInt($(this).attr("number")) - 1;
    let key = Object.keys(mapLayers)
    currentLayer.remove()
    currentLayer = mapLayers[key[btnNumber]];
    initializeLayer(currentLayer);
    $(".map-btn").attr("class", "btn btn-secondary map-btn")
    $(`#button${btnNumber+1}`).attr("class", `btn btn-${bRCG()} map-btn`)
}


//changes the values of lat/on on the document.
const changeLatLon = function changesLatAndLongOnDocument(lat, lon) {
    $("#lat").text(lat.toFixed(5));
    $('#lon').text(lon.toFixed(5));
}

// go to location
const goToLocation = function() {
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
            let marker = L.marker([lat, lng]).addTo(mymap);
        });
    } else {
        console.log("geolocation not available")
    };
};

$("#create-thread").attr("class", "btn btn-primary")
goToLocation()
//////////END INITIALIZATION ///////////




////////// WHAT TO DO ON MAP CLICK ///////////
//create popup on map click
    
const popup = L.popup();
const onMapClick = function coordinatesPopUpOnMapClick(e) {
    popup.setLatLng(e.latlng).setContent("You clicked the map at " + e.latlng.toString()).openOn(mymap);
    let {lat,lng} = e.latlng;
    console.log([lat, lng]);
        postAppendLatLng(lat, lng)
        $("#form-geohash").val(encodeGeoHash([lat, lng]))
};
////////// END WHAT TO DO ON MAP CLICK ///////////






////////// POPULATE THREAD LIST ///////////
let threadMarkerArray = [];
const populateThreads = function repopulatesThreadTableWheneverInvoked(threadArr, ) {
    //remove old markers before repopulating
    if (threadMarkerArray[0] !== undefined) {
        threadMarkerArray.forEach(a => a.remove())
        threadMarkerArray = [];
    }
    //create html
    let threadListHTML = '';
    threadArr.forEach((cur, idx) => {
        //easier letiables
        const {lat,lon,heading,body,dateCreated,user} = cur[0];
        const {userName,images} = user;
        const {thumb} = images;
        const distance = cur[1] * 3.28084; //converted from meters to  feet
        const distanceString = distance < 900 ? `${distance.toFixed(0)} feet` : distance < 1500 ? `${(distance/3).toFixed(0)} yards` : `${(distance*0.000189394).toFixed(1)} miles`
        const fullDate = ((date = dateCreated) => `${['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'Septemper', 'October', 'November', 'December'][date.slice(5, 7)-1]} ${parseInt(date.slice(8, 10))}, ${date.slice(0, 4)}`)();
        const blurb = body.length > 140 ? `${body.slice(0, 140)}...` : body;
        const colorFirstPost = idx === 0 ? 'active' : '';
        //we can change this html to whatever format you want.
        threadListHTML += `
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
    $('#thread-list').html(threadListHTML)
};
////////// END POPULATE THREAD LIST ///////////








////////// CREATE THREAD FORM ///////////
const createThreadBtnClick = function() {
    $("#right-btn").html(`<button type="button" id="cancel-thread" class="btn btn-secondary map-btn">cancel thread</button>`)
    $("#cancel-thread").attr("class", `btn btn-warning map-btn`)
    displayFormToggle()
};

const displayFormToggle = (test) => {
    let bool = state === 'thread list' ? true : false;
    if (test) bool = test;
    state = bool ? 'create thread' : 'thread list';
    console.log(state)
    //bool === true if threads are showing and list is hidden
    let threadList = $("#thread-list")
    let createThreadForm = $("#create-thread-form");
    let createThread = $("#create-thread");
    let cancelThread = $("#cancel-thread");

    //values are meant to the the opposite of the current state
    [threadList, createThreadForm, createThread, cancelThread].forEach(a => {
        console.log(a.attr("toggle"))
        let toggle = a.attr("toggle") === 'off';
        a.attr("toggle", `${toggle ? 'on' : 'off'}`)
        a.attr("style", `${toggle ? 'display: show;' : 'display: none;'}`)
    });
}



const postAppendLatLng = function(lat, lng) {
    $("#form-latitude").val(lat.toString())
    $("#form-longitude").val(lng.toString())
}
// on submit button click create object, clear form, add obj to dataObj, etc...
const submitButtonClicked = function(){
    let d = new Date();//Mon Nov 18 2019 16:37:14 GMT-0800 (Pacific Standard Time) 
    var curr_date = d.getDate();
    var curr_month = d.getMonth();
    var curr_year = d.getFullYear();
    let dateCreated = curr_date + "-" + curr_month + "-" + curr_year;

    let dataObj = {
        dateCreated,
        lat: $("#form-latitude").val(),
        lon: $("#form-longitude").val(),
        geohash: $("#form-geohash").val(),
        heading: $("#form-title").val(),
        body: $("#editor-container").val(),
        user: userData.pushkey1,
        
    };
    let pushkey = '';

    for (let i = 0; i < 16; i++) {
        let randomStr = 'aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ123456789'
        let randomIdx = Math.floor(Math.random() * 61)
        pushkey += randomStr[randomIdx];
    }
    console.log(pushkey)
    console.log(dataObj)

    threadData[pushkey] = dataObj;
    displayFormToggle(false)
}
////////// END CREATE THREAD FORM ///////////






////////// START HELPER FUNCTIONS ///////////

// geohash.js
// Geohash library for Javascript
// (c) 2008 David Troy
// Distributed under the MIT License

BITS = [16, 8, 4, 2, 1];

BASE32 = "0123456789bcdefghjkmnpqrstuvwxyz";
NEIGHBORS = {
	right: {
		even: "bc01fg45238967deuvhjyznpkmstqrwx"
	},
	left: {
		even: "238967debc01fg45kmstqrwxuvhjyznp"
	},
	top: {
		even: "p0r21436x8zb9dcf5h7kjnmqesgutwvy"
	},
	bottom: {
		even: "14365h7k9dcfesgujnmqp0r2twvyx8zb"
	}
};
BORDERS = {
	right: {
		even: "bcfguvyz"
	},
	left: {
		even: "0145hjnp"
	},
	top: {
		even: "prxz"
	},
	bottom: {
		even: "028b"
	}
};

NEIGHBORS.bottom.odd = NEIGHBORS.left.even;
NEIGHBORS.top.odd = NEIGHBORS.right.even;
NEIGHBORS.left.odd = NEIGHBORS.bottom.even;
NEIGHBORS.right.odd = NEIGHBORS.top.even;

BORDERS.bottom.odd = BORDERS.left.even;
BORDERS.top.odd = BORDERS.right.even;
BORDERS.left.odd = BORDERS.bottom.even;
BORDERS.right.odd = BORDERS.top.even;

function refine_interval(interval, cd, mask) {
	if (cd & mask)
		interval[0] = (interval[0] + interval[1]) / 2;
	else
		interval[1] = (interval[0] + interval[1]) / 2;
}

function calculateAdjacent(srcHash, dir) {
	srcHash = srcHash.toLowerCase();
	let lastChr = srcHash.charAt(srcHash.length - 1);
	let type = (srcHash.length % 2) ? 'odd' : 'even';
	let base = srcHash.substring(0, srcHash.length - 1);
	if (BORDERS[dir][type].indexOf(lastChr) != -1)
		base = calculateAdjacent(base, dir);
	return base + BASE32[NEIGHBORS[dir][type].indexOf(lastChr)];
}

function decodeGeoHash(geohash) {
	let [isEven, latErr, lngErr] = [1, 90.0, 180.0];
	let lat = [-90.0, 90.0];
	let lng = [-180.0, 180.0];


	for (i = 0; i < geohash.length; i++) {
		c = geohash[i];
		cd = BASE32.indexOf(c);
		for (j = 0; j < 5; j++) {
			mask = BITS[j];
			if (isEven) {
				lngErr /= 2;
				refine_interval(lng, cd, mask);
			} else {
				latErr /= 2;
				refine_interval(lat, cd, mask);
			}
			isEven = !isEven;
		}
	}
	lat[2] = (lat[0] + lat[1]) / 2;
	lng[2] = (lng[0] + lng[1]) / 2;
	return [lat[2], lng[2]];
}

function encodeGeoHash(lngLatArr) {
	let [latitude, lnggitude] = lngLatArr
	let [isEven, i, bit, ch, precision, geohash] = [1, 0, 0, 0, 12, ""];
	let lat = [-90.0, 90.0];
	let lng = [-180.0, 180.0];

	while (geohash.length < precision) {
		if (isEven) {
			mid = (lng[0] + lng[1]) / 2;
			if (lnggitude > mid) {
				ch |= BITS[bit];
				lng[0] = mid;
			} else
				lng[1] = mid;
		} else {
			mid = (lat[0] + lat[1]) / 2;
			if (latitude > mid) {
				ch |= BITS[bit];
				lat[0] = mid;
			} else
				lat[1] = mid;
		}
		isEven = !isEven;
		if (bit < 4)
			bit++;
		else {
			geohash += BASE32[ch];
			bit = 0;
			ch = 0;
		}
	};
	return geohash;
}



//find threads on map and sort them by distance
const findAndSortThreadsNearby = function findsThreadsOnMapAndSortsByDistance(coords) {
    let latlng1 = coords ? coords : mymap.getCenter();
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

//display changes to distance on each thread and in the lat-lon component
const renderCoords = function updateAllCoorsOnDocument(e, latlng) {
    let {lat,lng} = latlng ? latlng : mymap.getCenter();
    changeLatLon(lat, lng);
    findAndSortThreadsNearby([lat, lng]);
}

//populates the thread list with threads and repopulates the associated markers. repopulates the thread list every time it's invoked.  


////////// END HELPER LISTENERS ///////////

////////// EVENT LISTENERS ///////////
//initialize event handlers
mymap.on('drag', renderCoords);
mymap.on('click', onMapClick);
$(document).on("click", ".map-btn", toggleLayer)
$(document).on("click", "#create-thread", displayFormToggle)
$(document).on("click", "#cancel-thread", displayFormToggle)
$(document).on("click", "#submit-btn", submitButtonClicked)
////////// END EVENT LISTENERS ///////////