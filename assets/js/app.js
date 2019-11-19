// states are either 'thread list', 'create thread', 'create post',
let state = 'thread list'

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

$(`#button2`).attr("class", `btn btn-${bRCG()} `)
//populate layer buttons 
$("#layer-btns-go-here").html(function(){
    let html = '<button type="button" class="btn btn-secondary disabled map-btn">Map layers:</button>'
    Object.keys(mapLayers).forEach((a, i)=> html += `
    <button id="button${i+1}" type="button" class="btn btn-secondary map-btn" number="${i+1}">${i+1}</button>
    `);
    return html;
})


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


////////// POPULATE THREAD LIST ///////////
let threadMarkerArray = [];
const populateThreads = function repopulatesThreadTableWheneverInvoked(threadArr) {
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
                    <a href="#" id="${userName}">${userName}</a> | distance: ${distanceString} | 10 new replies
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
const renderCoords = function updateAllCoordsOnDocument(e, latlng) {
    let {lat,lng} = latlng ? latlng : mymap.getCenter();
    changeLatLon(lat, lng);
    findAndSortThreadsNearby([lat, lng]);
}

//initialize event handlers
mymap.on('drag', renderCoords);
mymap.on('click', onMapClick);
$(document).on("click", ".map-btn", toggleLayer)
$(document).on("click", "#create-thread", displayFormToggle)
$(document).on("click", "#cancel-thread", displayFormToggle)
$(document).on("click", "#submit-btn", submitButtonClicked)