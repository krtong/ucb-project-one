//any function that lives on the global scope has been moved here.
const mymap = L.map('mapid');
//most/all of these functions are really only used in one function. searchbar is your frand.
// states are either 'geoPost list', 'create geoPost', 'signin form'
let currentMapLayerIdx = Math.random() > 0.5 ? 2 : 4;
let currentMapLayer = Object.keys(mapLayers)[currentMapLayerIdx];
let geoPostMarkerArray = [];
let shouldMapKeepPanning = true;
let isSignedIn = false;
let userProfileObj = {};
let localThreadArr = []
let mapLayerState = '';
let afterSignInState = null;
let goWhereAfterSigningIn = "geoPost-list";
let threadFormComplete = false;
let lastLoadedPostIdx = 0;
let threadsPerPage = 8;
let tpp = threadsPerPage;
let geoPostArrLocal;
let daynight = false;
let timezone = false;
const db = firebase.firestore();
const usersRef = db.collection('users');
const postsRef = db.collection('posts');
async function getPosts() {
    // Data Structure
    // Collection: public
    const db = firebase.firestore();
    // See Firebase docs: https://firebase.google.com/docs/firestore/query-data/get-data#get_a_document
    // Define collection
    const collection = db.collection('posts');
    // const users = db.collection('users');
    // Get collection snapshot
    const snapshot = await collection.get();
    // Loop through snapshot.docs
    return snapshot.docs.map(doc => ({
        __id: doc.id,
        ...doc.data()
    }));
};

async function runQuery() {
    const posts = await getPosts();
    localThreadArr = posts;
};


const isSignedInOrOut = function () {
    if (isSignedIn) {
        $("#navbar-signin-btn").css("display", "none");
        $("#navbar-log-out-btn").css("display", "");
    } else {
        $("#navbar-signin-btn").css("display", "");
        $("#navbar-log-out-btn").css("display", "none");
    }
};

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        isSignedIn = true;
        userProfileObj = user;
        changeMainDiv('geoPost-list');
    } else {
        isSignedIn = false;
    };
    isSignedInOrOut()
});

const emailSignIn = function signInWithEmail(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        $("#sign-in-submit-btn").addClass("btn-danger")
        $("#signin-message").addClass("text-danger")
        $("#signin-message").text(errorMessage);
        setTimeout(function () {
            $("#sign-in-submit-btn").removeClass("btn-danger");
            $("#sign-in-submit-btn").addClass("btn-primary")
            $("#signin-message").removeClass("text-danger");
            $("#signin-message").html(`<a href="#" id="go-to-signup" >Create Account</a>`);
        }, 3000)
    });
};

const emailSignUp = function signUpWithEmail(email, password) {
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
    });
};
``
const logOut = function () {
    firebase.auth().signOut().then(function () {
        isSignedIn = true;
    }, function (error) {
        // An error happened.
    });
    isSignedInOrOut()
};

const rdmLatLon = function randomLatitudeAndLongitudeArray() {
    const randomNum = (min, max) => Math.random() * (max - min) + min;
    const lat = randomNum(33, 45);
    const lon = randomNum(-128, -80);
    return [lat, lon];
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
    currentMapLayerIdx = Object.keys(mapLayers).indexOf(layerKey);
    //add the new layer to the map.
    mapLayers[layerKey].addTo(mymap);
    //create string of html for the buttons.
    let mapBtnHTML = `<button type="button" class="btn btn-secondary disabled layer-name" >${currentMapLayer}</button>`;
    Object.keys(mapLayers).forEach((a, i) => mapBtnHTML += `<button id="button${i+1}" type="button" class="btn btn-${i === currentMapLayerIdx ? bRCG() : 'secondary'} map-btn" number="${i+1}">${i+1}</button>`);
    $("#layer-btns-go-here").html(mapBtnHTML);
};

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

const animateMap = function () {
    shouldMapKeepPanning = true;
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
}

// go to location
const goToLocation = function () {
    if ('geolocation' in navigator) {
        //pan map until location is selected.

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
        });
    } else {};
};

//create popup on map click
const popup = L.popup();
const onMapClick = function coordinatesPopUpOnMapClick(e) {
    const {lat,lng} = e.latlng;

    //change latlon on the subnav bar and in the create geoPost form.
    postAppendLatLng(lat, lng);
    changeLatLon(lat, lng);

    //remove popup after 3 seconds
    setTimeout(function () {
        popup.remove()
    }, 1750);
    coordProgression()
    $("#form-geohash").val(encodeGeoHash([lat, lng]));
    //show popup
    popup.setLatLng(e.latlng).setContent("You clicked the map at " + e.latlng.toString()).openOn(mymap);
};

//when the coordinates on the map viewport change, everything associated with said-coordinates need to change too.
const coordProgression = function updateAllCoorsOnDocument(e, latlng) {
    shouldMapKeepPanning = false;
    //lat & lng = either the provided latlng OR the center of the viewport
    const {lat,lng} = latlng ? latlng : mymap.getCenter();
    localThreadArr.forEach(a => a['distance'] = mymap.distance([lat, lng], [a.lat, a.lon]) * 3.28084)
    localThreadArr.sort((a, b) => a.distance > b.distance ? 1 : -1);
    populategeoPosts(localThreadArr);
    changeLatLon(lat, lng);
};

//once render coords has sorted the geoPosts into an array
const populategeoPosts = function repopulatesgeoPostTableWheneverInvoked(geoPostArr, threadStart = 0) {
    geoPostArrLocal = geoPostArr;
    let geoPostListHTML = `<div class="card">
    <div class="form-label card-header background-color-secondary"><i class="fas fa-map-marked-alt"></i>  
    geoPosts sorted by distance </div>`; //create html to place into $("#geoPost-list").
    let pB = threadStart === 0;
    let pageNumber = 0;
    let paginationHTML = `<nav aria-label="..."><ul class="pagination"><li class="page-item ${pB  ? `disabled` : ``}"><${pB ? `span` : `a`} class="page-link" number="${tpp - threadStart + 1}">Previous</${pB ? `span` : `a`}>
    </li>`
    
    //remove old markers before repopulating
    if (geoPostMarkerArray[0] !== undefined) {
        geoPostMarkerArray.forEach(a => a.remove())
        geoPostMarkerArray = [];
    };

    geoPostArrLocal.slice(threadStart, threadStart + tpp).forEach((cur, idx) => {
        //a questionable amount of object destructuring for shorter naming of variables
        const {body,dateCreated,distance,geohash,heading,lat,lon,user,__id} = cur;
        const thumb = userData[user]['images']['thumb'];
        const userName = userData[user]['userName'];
        const distanceString = distance < 900 ? `${distance.toFixed(0)} feet` : distance < 1500 ? `${(distance/3).toFixed(0)} yards` : `${(distance*0.000189394).toFixed(1)} miles`
        const fullDate = ((date = dateCreated) => `${['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'Septemper', 'October', 'November', 'December'][date.slice(5, 7)]} ${parseInt(date.slice(8, 10))}, ${date.slice(0, 4)}`)();
        const blurb = body.length > 140 ? `${body.slice(0, 140)}...` : body;
        const colorFirstPost = idx === 0 ? 'active' : '';

        //we can change this html to whatever format you want.
        geoPostListHTML += `<a href="#" id="thread${ idx }" class="geoPost-li list-group-item list-group-item-action ${ colorFirstPost }" lat="${lat}" lon="${lon}" geohash="${ geohash }"><div class="d-flex w-100 justify-content-between"><h5 class="mb-1">${ heading }</h5><small>${ fullDate }</small></div><p class="mb-1">${ blurb }</p><small>By <img src="${ thumb }" style="border-radius: 50%; margin: 0 3px 0 1px;" height="18px" width="18px">${ userName } | distance: ${ distanceString } | 10 new replies</small></a>`;
        //create new markers
        geoPostMarkerArray.push(L.marker([lat, lon]).addTo(mymap));
    });

    geoPostArrLocal.forEach((a, i) => {
        let modulo = i % tpp === 0;
        pageNumber = modulo ? pageNumber + 1 : pageNumber;
        paginationHTML += modulo && threadStart === i ? `<li class="page-item active" aria-current="page"><span class="page-link">${pageNumber}<span class="sr-only">(current)</span></span></li>` : modulo ? `<li class="page-item"><a  number="${pageNumber}" class="page-link"  href="#">${pageNumber}</a></li>` : ``;
    });


    let nB = threadStart > geoPostArrLocal.length - 1 - tpp;
    paginationHTML += `<li class="page-item ${nB ? 'disabled' : ''}"><${nB ? `span` : `a`} number="${pageNumber}" class="page-link " href="#">Next</${nB ? `span` : `a`}></li>`
    paginationHTML += ` </ul></nav>`
    geoPostListHTML += `</div></div> `
    geoPostListHTML += paginationHTML
    //append html to geoPostlist
    $('#geoPost-list').html(geoPostListHTML);
};

//search keywords: ((change state, state change, changeMainDiv, statechange))
//NEW: toggle between map layers. on map button click change layer values  
const toggleDisplay = (id, value = "block") => $(`#${id}`).css("display", value);
const changeMainDiv = function (divId) {
    event.preventDefault();
    //close old components
    $("#main-div").children().css("display", "none")
    //open new component
    switch (divId) {
        case ("go-to-signup"): {
            toggleDisplay("signin-form", "none")
            toggleDisplay("signup-form");
            break;
        }
        case "create-geoPost": {
            goWhereAfterSigningIn = "create-geoPost";
            if (isSignedIn) toggleDisplay("create-geoPost-form");
            else toggleDisplay("signin-form");
            toggleDisplay("create-geoPost", "none");
            toggleDisplay("cancel-geoPost");
            break;
        };
        case "cancel-geoPost": {
            goWhereAfterSigningIn = "geoPost-list";
            toggleDisplay("geoPost-list");
            toggleDisplay("cancel-geoPost", "none");
            toggleDisplay("create-geoPost");
            break;
        };
        case "navbar-signin-btn": {
            toggleDisplay("signin-form");
            toggleDisplay("create-geoPost", "none");
            toggleDisplay("cancel-geoPost");
            break;
        };
        case "sign-in-submit-btn": {
            let email = $("#signinInputEmail").val().trim()
            let password = $("#signinInputPassword").val().trim()
            emailSignIn(email, password)
            if (isSignedIn) toggleDisplay(goWhereAfterSigningIn);
            else toggleDisplay("signin-form");
            break;
        };
        case "navbar-log-out-btn": {
            logOut();
            toggleDisplay("cancel-geoPost", "none")
            toggleDisplay("create-geoPost")
            break;
        };
        case ("find-my-location"): {
            $("#togglepulse").removeClass("pulse");
            toggleDisplay("geoPost-list");
        };
        case "form-submit-btn": {
            let d = new Date(); //Mon Nov 18 2019 16:37:14 GMT-0800 (Pacific Standard Time) 
            const day = d.getDate();
            const month = d.getMonth(); //january = 0
            const year = d.getFullYear();
            let dateCreated = `${year}-${month}-${day}`
            let formInputs = [$("#form-latitude"), $("#form-longitude"), $("#form-geohash"), $("#form-title"), $("#editor-container")]
            let dataObj = {
                dateCreated,
                lat: $("#form-latitude").val(),
                lon: $("#form-longitude").val(),
                geohash: $("#form-geohash").val(),
                heading: $("#form-title").val(),
                body: $("#editor-container").val(),
                user: userProfileObj.uid,
            };
            const checkForm = function () {
                let isComplete = formInputs.map(a => a.val().toString().length > 10 ? true : false);
                isComplete.forEach((a, i) => formInputs[i].toggleClass('is-valid', a).toggleClass('is-invalid', !a))
                return isComplete.reduce((acc, cur) => cur ? acc : false, true);
            };
            if (checkForm()) {
                $("#form-latitude").val('');
                $("#form-longitude").val('');
                $("#form-geohash").val('');
                $("#form-title").val('');
                $("#editor-container").val('');
                $('#submit-button').toggleClass('btn-primary').toggleClass('btn-success').append()
                $("#submit-button").append('')
                coordProgression()
                //real database: 
                postsRef.add(dataObj)
                toggleDisplay("create-geoPost", "none");
                toggleDisplay("geoPost-list");
            };
        };
    };
};

const postAppendLatLng = function (lat, lng) {
    $("#form-latitude").val(lat.toString())
    $("#form-longitude").val(lng.toString())
};

// init
runQuery();
isSignedInOrOut()
mymap.setView(rdmLatLon(), 12);
addNewMapLayer();
$("#create-geoPost").attr("class", "btn btn-primary")
toggleDisplay("geoPost-list");
coordProgression(null)
animateMap()
mymap.on('click', onMapClick);
mymap.on('drag', coordProgression);
$(document).on("click", ".map-btn", toggleLayer)
$(document).on("click", "#find-my-location", goToLocation)
$(document).on("click", "#find-my-location, #go-to-signup, #form-submit-btn, #create-geoPost, #cancel-geoPost, #navbar-signin-btn, #sign-in-submit-btn, #navbar-log-out-btn", function (e) {
    changeMainDiv($(this).attr("id"))
});

$(document).on("click", "#time-zone-layer", function () {
    if (!timezone) {
        t = L.timezones.bindPopup(function (layer) {
            return new Date().toLocaleString("en-GB", {
                timeZone: layer.feature.properties.tz_name1st,
                timeZoneName: "short"
            }); //.time_zone
        }).addTo(mymap);
        timezone = true;
    } else {
        timezone = false;
        mymap.removeLayer(t)
    }
});
$(document).on("click", "a.page-link", function () {
    event.preventDefault();
    let idx = ($(this).attr("number") - 1) * tpp;
    populategeoPosts(geoPostArrLocal, idx)
});

$(document).on("click", "#day-night-layer", function () {
    if (!daynight) {
        terminator = L.terminator().addTo(mymap);
        daynight = true;
    } else {
        daynight = false;
        mymap.removeLayer(terminator)
    }
});

$(document).on("click", ".geoPost-li", function () {
    event.preventDefault();
    let lon = $(this).attr("lon");
    let lat = $(this).attr("lat");
    $(".geoPost-li").removeClass("active")
    $(this).addClass("active")
    mymap.flyTo([lat, lon], 13);
});

$(document).on("click", "#zoom-out", function () {
    event.preventDefault();
    let [lat, lng] = [0, 0]
    mymap.flyTo([lat, lng], 2);
});