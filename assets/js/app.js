

// states are either 'thread list', 'create thread', 'create post',
let state = 'thread list'
console.log(state)

//Stuff to push onto firebase
$('#sign-in').on("click", function(){
    event.preventDefault();

    var name = $("#email-input").val().trim();
    var password = $('#password-input').val().trim();

    database.ref("/users").push({
        name,
        password,
    
    });
    console.log({name,password})
})


////////// DATA OBJECTS ///////////
// for ESRI

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


//signup form //

//when signup in nav is clicked
const signupButtonClicked = function () {
    console.log('click')
}

//when submit button is clicked
const signupSubmitButtonClicked = function () {
    console.log('click')
}



////////// CREATE THREAD FORM ///////////
const createThreadBtnClick = function() {
    $("#right-btn").html(`<button type="button" id="cancel-thread" class="btn btn-secondary map-btn">cancel thread</button>`)
    $("#cancel-thread").attr("class", `btn btn-warning map-btn`)
    displayFormToggle()
};

const signupFormComplete = function () {
    console.log('click')
}

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

    threadData[pushkey] = dataObj;
    displayFormToggle(false)
}
////////// END CREATE THREAD FORM ///////////








////////// START HELPER FUNCTIONS ///////////
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

////////// END EVENT LISTENERS ///////////


//WHAT THE FUCK