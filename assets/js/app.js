///////GLOBAL VARIABLES/////////////////GLOBAL VARIABLES/////////////////GLOBAL VARIABLES//////////
//any function that lives on the global scope has been moved here.
const mymap = L.map('mapid');
//most/all of these functions are really only used in one function. searchbar is your frand.
// states are either 'thread list', 'create thread', 'view thread', 'create post', 'view profile', ...//
let state = 'thread list';
let currentMapLayerIdx = Math.random() > 0.5 ? 2 : 4;
let currentMapLayer = Object.keys(mapLayers)[currentMapLayerIdx];
let threadMarkerArray = [];
let shouldMapKeepPanning = true;
let isSignedIn = false;
let userProfileObj = {};
//10 spaces between sections
///////END GLOBAL VARIABLES/////////////////END GLOBAL VARIABLES/////////////////END GLOBAL VARIABLES//////////









//////////FIRESTORE /////////////
const db = firebase.firestore();
const usersRef = db.collection('users');
const postsRef = db.collection('posts');
async function getPosts() {
    // Data Structure
    // Collection: public
    //  Doc: write-your-first-query
    //    Collection: star-wars-people
    const db = firebase.firestore();

    // See Firebase docs: https://firebase.google.com/docs/firestore/query-data/get-data#get_a_document

    // Define collection
    const collection = db.collection('posts');

    // Get collection snapshot
    const snapshot = await collection.get();

    // Loop through snapshot.docs
    return snapshot.docs.map(doc => ({
        __id: doc.id,
        ...doc.data()
    }));
}

async function runQuery() {
    const people = await getPosts();
    console.table(people)
}

runQuery();
//////// END FIRESTORE ////////////









///////// FIREBASE AUTH //////////
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        isSignedIn = true;
        console.log(user)
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        // ...
    } else {
        isSignedIn = false;
        console.log('user not logged in')
        // User is signed out.
        // ...
    }
});
///////// END FIREBASE AUTH /////









////////// INITIALIZE FUNCTIONS ///////////////////// INITIALIZE FUNCTIONS ///////////////////// INITIALIZE FUNCTIONS ///////////
//function to create a random longitude and latitude over 'merica.
const rdmLatLon = function randomLatitudeAndLongitudeArray() {
    const randomNum = (min, max) => Math.random() * (max - min) + min;
    const lat = randomNum(33, 45)
    const lon = randomNum(-128, -80)
    return [lat, lon]
}

//initial layer shown on pageload
// useless but funny button color creator
const bRCG = randomColorGenerator = () => 'primary success danger warning info light'.split(' ')[Math.floor(Math.random() * 5)];

// set initial values for map layers
const addNewMapLayer = (layerKey = currentMapLayer) => {
    //old map layer should be removed before new layer is added.
    //if the old map layer is not removed, you won't be able to switch back to it because it will render BEHIND the new one.
    mapLayers[layerKey].remove();
    //set current layer to new layer
    currentMapLayer = layerKey;
    //find the index of the new layer so the button can be colorized.
    currentMapLayerIdx = Object.keys(mapLayers).indexOf(layerKey)
    //add the new layer to the map.
    mapLayers[layerKey].addTo(mymap)
    //create string of html for the buttons.
    let mapBtnHTML = `<button type="button" class="btn btn-secondary disabled" style="width: 200px;">${currentMapLayer}</button>`;
    Object.keys(mapLayers).forEach((a, i) => mapBtnHTML += `<button id="button${i+1}" type="button" class="btn btn-${i === currentMapLayerIdx ? bRCG() : 'secondary'} map-btn" number="${i+1}">${i+1}</button>`);
    $("#layer-btns-go-here").html(mapBtnHTML);
};


// toggle between map layers. on map button click change layer values  
const toggleLayer = function togglesBetweenMapLayers() {
    const btnNumber = parseInt($(this).attr("number")) - 1;
    const newMapLayer = Object.keys(mapLayers)[btnNumber];
    addNewMapLayer(newMapLayer);
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
        //pan map until location is selected.
        setInterval(function () {
            if (shouldMapKeepPanning) {
                mymap.panBy([1, 0], {
                    pan: {
                        animate: true,
                        duration: 0.01
                    }
                });
            };
        }, 100);
        //once location is selected, fly to location. go to location. fly to location
        navigator.geolocation.getCurrentPosition(position => {
            shouldMapKeepPanning = false;
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            //flies to location
            mymap.flyTo([lat, lng], 13);
            addNewMapLayer('googleHybrid')
            coordProgression(null, {
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
//////////END INITIALIZATION ///////////////////////END INITIALIZATION ///////////////////////END INITIALIZATION /////////////









////////// WHAT TO DO ON MAP CLICK ///////////////////// WHAT TO DO ON MAP CLICK ///////////////////// WHAT TO DO ON MAP CLICK ///////////
//create popup on map click
const popup = L.popup();
const onMapClick = function coordinatesPopUpOnMapClick(e) {
    const {
        lat,
        lng
    } = e.latlng;

    //change latlon on the subnav bar and in the create thread form.
    postAppendLatLng(lat, lng);
    changeLatLon(lat, lng);

    //remove popup after 3 seconds
    setTimeout(function () {
        popup.remove()
    }, 3000);

    $("#form-geohash").val(encodeGeoHash([lat, lng]));
    //show popup
    popup.setLatLng(e.latlng).setContent("You clicked the map at " + e.latlng.toString()).openOn(mymap);
};
////////// END WHAT TO DO ON MAP CLICK ///////////////////// END WHAT TO DO ON MAP CLICK ///////////////////// END WHAT TO DO ON MAP CLICK ///////////









////////// POPULATE THREAD LIST ///////////////////// POPULATE THREAD LIST ///////////////////// POPULATE THREAD LIST ///////////

//when the coordinates on the map viewport change, everything associated with said-coordinates need to change too.
const coordProgression = function updateAllCoorsOnDocument(e, latlng) {
    //lat & lng = either the provided latlng OR the center of the viewport
    const {
        lat,
        lng
    } = latlng ? latlng : mymap.getCenter();
    const keys = Object.keys(threadData);
    const latlng1 = [lat, lng];
    let tsbdArr = threadsSortedByDistancesArr = [];
    shouldMapKeepPanning = false;
    // get threadsSortedByDistancesArr from center of map
    for (let i = 0; i < keys.length; i++) {
        const latlng2 = threadData[keys[i]];
        tsbdArr.push([i, mymap.distance(latlng1, latlng2)]);
    };
    // sort threads by distances
    tsbdArr.sort((a, b) => a[1] > b[1] ? 1 : -1).forEach((a, i) => tsbdArr[i][0] = threadData[keys[a[0]]]);
    //once coords are updated:
    //update thread rankings by distance
    populateThreads(tsbdArr);
    changeLatLon(lat, lng);
};

//once render coords has sorted the threads into an array
const populateThreads = function repopulatesThreadTableWheneverInvoked(threadArr) {
    let threadListHTML = ''; //create html to place into $("#thread-list").

    //remove old markers before repopulating
    if (threadMarkerArray[0] !== undefined) {
        threadMarkerArray.forEach(a => a.remove())
        threadMarkerArray = [];
    };

    threadArr.forEach((cur, idx) => {
        //a questionable amount of object destructuring for shorter naming of variables
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
        const fullDate = ((date = dateCreated) => `${['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'Septemper', 'October', 'November', 'December'][date.slice(5, 7)]} ${parseInt(date.slice(8, 10))}, ${date.slice(0, 4)}`)();
        const blurb = body.length > 140 ? `${body.slice(0, 140)}...` : body;
        const colorFirstPost = idx === 0 ? 'active' : '';
        //we can change this html to whatever format you want.
        threadListHTML += `
            <a href="#" class="list-group-item list-group-item-action ${ colorFirstPost }">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">${ heading }</h5>
                    <small>${ fullDate }</small>
                </div>
                <p class="mb-1">${ blurb }</p>
                <small>
                    By <img src="${ thumb }" style="border-radius: 50%; margin: 0 3px 0 1px;" height="18px" width="18px">
                    ${ userName } | distance: ${ distanceString } | 10 new replies
                </small>
            </a>`;
        //create new markers
        threadMarkerArray.push(L.marker([lat, lon]).addTo(mymap));
    });
    //append html to threadlist
    $('#thread-list').html(threadListHTML);
};
////////// END POPULATE THREAD LIST ///////////////////// END POPULATE THREAD LIST ///////////////////// END POPULATE THREAD LIST ///////////









//////////USER SIGN UP////////////////////USER SIGN UP////////////////////USER SIGN UP//////////
//toggle firebase


//Stuff to push onto firebase
$('#sign-in').on("click", function () {

    
})

//when signup in nav is clicked
const signupButtonClicked = function () {
    console.log('click');
};

//when submit button is clicked
const signupSubmitButtonClicked = function () {
    console.log('click');
};
//////////END USER SIGN UP////////////////////END USER SIGN UP////////////////////END USER SIGN UP//////////









////////// CREATE THREAD FORM ///////////////////// CREATE THREAD FORM ///////////////////// CREATE THREAD FORM ///////////
const createThreadBtnClick = function () {
    $("#right-btn").html(`<button type="button" id="cancel-thread" class="btn btn-secondary map-btn">cancel thread</button>`);
    $("#cancel-thread").attr("class", `btn btn-warning map-btn`);
    displayFormToggle();
};

const signupFormComplete = function () {
    console.log('click');
}
// create thread button clicked. cancel thread button clicked. 
const displayFormToggle = (test) => {
    // if user is not signed in...
    if (!isSignedIn) {


    //if user is signed in...
    } else {
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

};

const postAppendLatLng = function (lat, lng) {
    $("#form-latitude").val(lat.toString())
    $("#form-longitude").val(lng.toString())
};

// creates a mock pushkey/fake pushkey for use with the mock database/fake database.
const createPushkey = function createAFakePushkey(str = '') {
    for (let i = 0; i < 16; i++) {
        const randomStr = 'aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ123456789';
        const randomIdx = Math.floor(Math.random() * 61);
        str += randomStr[randomIdx];
    };
    return str
};

// thread form submit: on thread submit button click create object, clear form, add obj to dataObj, etc...
const threadSubmitButtonClicked = function () {


    //create timestamp
    let d = new Date(); //Mon Nov 18 2019 16:37:14 GMT-0800 (Pacific Standard Time) 
    const day = d.getDate();
    const month = d.getMonth(); //january = 0
    const year = d.getFullYear();
    let dateCreated = `${year}-${month}-${day}`
    console.log("d", d, "datecreated", dateCreated)
    let formInputs = [$("#form-latitude"), $("#form-longitude"), $("#form-geohash"), $("#form-title"), $("#editor-container")]
    let dataObj = {
        dateCreated,
        lat: $("#form-latitude").val(),
        lon: $("#form-longitude").val(),
        geohash: $("#form-geohash").val(),
        heading: $("#form-title").val(),
        body: $("#editor-container").val(),
        user: userData.pushkey1,
    };

    const checkForm = function () {
        let isComplete = formInputs.map(a => a.val().toString().length > 10 ? true : false);
        isComplete.forEach((a, i) => formInputs[i].toggleClass('is-valid', a).toggleClass('is-invalid', !a))
        console.log('isComplete', isComplete);
        return isComplete.reduce((acc, cur) => cur ? acc : false, true);
    }
    console.log('is everything good ?', checkForm())
    //real database:
    console.log("push this to firebase", dataObj);
    //on completion:
    if (checkForm()) {
        displayFormToggle(false);
        $("#form-latitude").val('');
        $("#form-longitude").val('');
        $("#form-geohash").val('');
        $("#form-title").val('');
        $("#editor-container").val('');
        $('#submit-button').toggleClass('btn-primary').toggleClass('btn-success').append()
        $("#submit-button").append('')
        coordProgression()
        //fake database:
        threadData[createPushkey()] = dataObj;
        //real database: 
        postsRef.add(dataObj)
    }
};
////////// END CREATE THREAD FORM ///////////////////// END CREATE THREAD FORM ///////////////////// END CREATE THREAD FORM ///////////









////////// INITIALIZATION //////////////////// INITIALIZATION //////////////////// INITIALIZATION //////////
//on pageload:
//set starting coordinate for viewport
mymap.setView(rdmLatLon(), 12);
//set starting mapLayer for viewport
addNewMapLayer();
//add day/night
L.terminator().addTo(mymap);
//idfk why this is here but it changes the "Create Thread" button to color "primary"
$("#create-thread").attr("class", "btn btn-primary")
//ask user if they want to go to their location. the way the app is designed right now, they HAVE TO go to location for the app to work properly
goToLocation()
////////// END INITIALIZATION //////////////////// END INITIALIZATION //////////////////// END INITIALIZATION ///////////









////////// EVENT LISTENERS ///////////////////// EVENT LISTENERS ///////////////////// EVENT LISTENERS ///////////
//initialize event handlers
mymap.on('drag', coordProgression);
mymap.on('click', onMapClick);
$(document).on("click", ".map-btn", toggleLayer)
$(document).on("click", "#create-thread", displayFormToggle)
$(document).on("click", "#cancel-thread", displayFormToggle)
$(document).on("click", "#submit-btn", threadSubmitButtonClicked)
$(document).on("click", "#signup-button", signupButtonClicked)
$(document).on("click", "#signup-submit", signupSubmitButtonClicked)
////////// END EVENT LISTENERS ///////////////////// END EVENT LISTENERS ///////////////////// END EVENT LISTENERS ///////////