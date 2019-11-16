//firebase
var database = firebase.database();



//oAuth
let client = new JSO({
	providerID: "google",
	client_id: "541950296471.apps.googleusercontent.com",
	redirect_uri: "http://localhost:8080/", // The URL where you is redirected back, and where you perform run the callback() function.
	authorization: "https://accounts.google.com/o/oauth2/auth",
	scopes: { request: ["https://www.googleapis.com/auth/userinfo.profile"]}
})






// leaflet
var mymap = L.map('mapid').setView([37.8715,122.2730], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1Ijoiam9udHJ1b25nIiwiYSI6ImNrMnpteHlxdDA0Z24zaW5zdnh2dHRkNnYifQ.2TcrWXV6vkhipQnqDt_Qgw'
}).addTo(mymap);

var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(mymap);
}

mymap.on('click', onMapClick);

if ('geolocation' in navigator){
    console.log('geolocation available');
    navigator.geolocation.getCurrentPosition(position =>{
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        $("#lat").text(lat);
        $('#lon').text(lon);
    });}
    else{
        console.log("geolocation not available")
    }
