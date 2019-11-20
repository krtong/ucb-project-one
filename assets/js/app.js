// states are either 'thread list', 'create thread', 'view thread', 'create post', 'view profile', ...//
let state = 'thread list';
console.log(state);

//Stuff to push onto firebase
// $('#sign-in').on("click", function () {
//     event.preventDefault();

//     var name = $("#username-input").val().trim();
//     var password = $('#password-input').val().trim();

//     database.ref("/users").push({
//         name,
//         password,

//     });
//     console.log({
//         name,
//         password
//     });
// })

////////// INITIALIZE PAGE ///////////

// initialize map
let mymap = L.map('mapid');

//start map at random longitude
const rdmLatLon = function randomLatitudeAndLongitudeArray() {
    const randomNum = (min, max) => Math.random() * (max - min) + min;
    let lat = randomNum(33, 45)
    let lon = randomNum(-128, -80)
    return [lat, lon]
}
mymap.setView(rdmLatLon(), 12);

//initial layer shown on pageload
let currentLayerIdx = Math.random() > 0.5 ? 2 : 4;
//should be the key name of the layer object 
let currentLayer = Object.keys(mapLayers)[currentLayerIdx];


// set initial values for map layers
const initializeLayer = (layerKey = currentLayer) => {
    currentLayer = layerKey;
    currentLayerIdx = Object.keys(mapLayers).indexOf(layerKey)
    mapLayers[layerKey].addTo(mymap)

    // every time there's a layer change you need to invoke L.terminator to bring back the day/night overlay.
    L.terminator().addTo(mymap);

    // useless but funny button color creator
    const bRCG = () => 'primary success danger warning info light'.split(' ')[Math.floor(Math.random() * 5)];

    //populate layer buttons 
    $("#layer-btns-go-here").html(function () {
        let html = `<button type="button" class="btn btn-secondary disabled">${mapLayers[currentLayer].attribution}</button>`
        Object.keys(mapLayers).forEach((a, i) => html += `
    <button id="button${i+1}" type="button" class="btn btn-${i === currentLayerIdx ? bRCG() : 'secondary'} map-btn" number="${i+1}">${i+1}</button>
    `);
        return html;
    });
};

initializeLayer(currentLayer);

const removeMapLayer = function(layerKey){
    mapLayers[currentLayer].remove();
}
// on button click change layer values 
const toggleLayer = function togglesBetweenMapLayers(event) {
    let btnNumber = parseInt($(this).attr("number")) - 1;
    let key = Object.keys(mapLayers);
    currentLayer.remove();
    currentLayer = mapLayers[key[btnNumber]];
    initializeLayer(currentLayer);
    $("#layer-btns-go-here").children(".map-btn").attr("class", 'btn btn-secondary map-btn');
    $(`#button${btnNumber+1}`).attr("class", `btn btn-${bRCG()} map-btn`);
};


//changes the values of lat/on on the document.
const changeLatLon = function changesLatAndLongOnDocument(lat, lon) {
    $("#lat").text(lat.toFixed(5));
    $('#lon').text(lon.toFixed(5));
};

// go to location
const goToLocation = function () {
    if ('geolocation' in navigator) {
        console.log('geolocation available');
        let stillWaiting = true;
        let count = 1;
        //pan map until location is selected.
        setInterval(function () {
            if (stillWaiting) {
                mymap.panBy([1, 0], {
                    pan: {
                        animate: true,
                        duration: 0.01
                    }
                })
                // count = count > 180 ? count - 180 : count + 1;
            };
        }, 100);
        //once location is selected, fly to location. go to location. fly to location
        navigator.geolocation.getCurrentPosition(position => {
            stillWaiting = false;
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            //flies to location
            mymap.flyTo([lat, lng], 13);
            initializeLayer('googleHybrid')
            renderCoords('', {
                lat,
                lng
            });
            //adds marker
            let marker = L.marker([lat, lng]).addTo(mymap);
        });
    } else {
        console.log("geolocation not available");
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
    let {
        lat,
        lng
    } = e.latlng;
    console.log([lat, lng]);
    postAppendLatLng(lat, lng);
    changeLatLon(lat, lng);
    $("#form-geohash").val(encodeGeoHash([lat, lng]));

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
        const {
            lat,
            lon,
            heading,
            body,
            dateCreated,
            user
        } = cur[0];
        const {
            userName,
            images
        } = user;
        const {
            thumb
        } = images;
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
    $('#thread-list').html(threadListHTML);
    
};
////////// END POPULATE THREAD LIST ///////////

/////////User Sign In //////////
const signInButtonClicked = function (){
    console.log('click');
    event.preventDefault();

    var username = $("#username-input").val().trim();
    var password = $('#password-input').val().trim();

    database.ref("/users").push({
        username,
        password,
    });
    
}

//////////USER SIGN UP//////////

//when signup in nav is clicked
const signupButtonClicked = function () {
    console.log('click');
};

//when submit button is clicked
const signupSubmitButtonClicked = function () {
    console.log('click');
};

//////////END USER SIGN UP//////////




////////// CREATE THREAD FORM ///////////

const createThreadBtnClick = function () {
    setTimeout(function () {
        $(".leaflet-popup").attr("style", "visibility: hidden; opacity: 0; transition: visibility 0.5s, opacity 0.5s linear;")
    }, 8000)
    $("#right-btn").html(`<button type="button" id="cancel-thread" class="btn btn-secondary map-btn">cancel thread</button>`);
    $("#cancel-thread").attr("class", `btn btn-warning map-btn`);
    displayFormToggle();
};

const signupFormComplete = function () {
    console.log('click');
}

const displayFormToggle = (test) => {
    let bool = state === 'thread list' ? true : false;
    if (test) bool = test;
    state = bool ? 'create thread' : 'thread list';
    console.log(state);
    //bool === true if threads are showing and list is hidden
    let threadList = $("#thread-list");
    let createThreadForm = $("#create-thread-form");
    let createThread = $("#create-thread");
    let cancelThread = $("#cancel-thread");

    //values are meant to flip to the opposite of the current state
    [threadList, createThreadForm, createThread, cancelThread].forEach(a => {
        console.log(a.attr("toggle"));
        let toggle = a.attr("toggle") === 'off';
        a.attr("toggle", `${toggle ? 'on' : 'off'}`)
        a.attr("style", `${toggle ? 'display: show;' : 'display: none;'}`)
    });

};

const postAppendLatLng = function (lat, lng) {
    $("#form-latitude").val(lat.toString())
    $("#form-longitude").val(lng.toString())
};
// on submit button click create object, clear form, add obj to dataObj, etc...
const submitButtonClicked = function () {
    let d = new Date(); //Mon Nov 18 2019 16:37:14 GMT-0800 (Pacific Standard Time) 
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
    ///push to fire base////
    // database.ref("/thread").push({
    //     dataObj:dateCreated,
    //     dataObj:$("#form-latitude").val(),
    //     dataObj:lon,
    //     dataObj:geohash,
    //     dataObj:heading,
    //     dataObj:body,
    //     dataObj:user.userData,

    // })
    console.log(dataObj.dateCreated)
    console.log(dataObj.lat)
    console.log(dataObj.lon)
    console.log(dataObj.geohash)
    const createPushkey = function (str = '') {
        for (let i = 0; i < 16; i++) {
            let randomStr = 'aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ123456789';
            let randomIdx = Math.floor(Math.random() * 61);
            str += randomStr[randomIdx];
        };
        return str
    };
    //real database:
    console.log("push this to firebase", dataObj);
    threadData[createPushkey()] = dataObj;
    
    //on completion:
    displayFormToggle(false);
    let {
        heading,
        body,
        lat,
        lon,
        geohash
    } = dataObj;
    [heading, body, lat, lon, geohash].forEach(a => a = '');
    //fake database:
};
////////// END CREATE THREAD FORM ///////////





////////// START HELPER FUNCTIONS ///////////
//find threads on map and sort them by distance
const findAndSortThreadsNearby = function findsThreadsOnMapAndSortsByDistance(coords) {
    let latlng1 = coords ? coords : mymap.getCenter();
    let keys = Object.keys(threadData);
    let distances = [];
    // get distances from center of map
    for (let i = 0; i < keys.length; i++) {
        let {
            lat,
            lon
        } = threadData[keys[i]];
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
    let {
        lat,
        lng
    } = latlng ? latlng : mymap.getCenter();
    changeLatLon(lat, lng);
    findAndSortThreadsNearby([lat, lng]);
}

////////// END HELPER LISTENERS ///////////




////////// EVENT LISTENERS ///////////
//initialize event handlers
mymap.on('drag', renderCoords);
mymap.on('click', onMapClick);
$(document).on("click", ".map-btn", toggleLayer)
$(document).on("click", "#create-thread", displayFormToggle)
$(document).on("click", "#cancel-thread", displayFormToggle)
$(document).on("click", "#submit-btn", submitButtonClicked)
$(document).on("click", "#signup-button", signupButtonClicked)
$(document).on("click", "#signup-submit", signupSubmitButtonClicked)
$(document).on("click", "#sign-in",signInButtonClicked)

////////// END EVENT LISTENERS ///////////


