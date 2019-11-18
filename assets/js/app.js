//firebase
// var database = firebase.database();

//firebase authorization
//can't figure out how to do this without NPM/Node

// leaflet

var mymap;
let locationArr;
var mymap = L.map('mapid').setView([51.505, -0.09], 13);

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
    })

}
//this is how you change which layer is shown.
mapLayers.googleHybrid.addTo(mymap);

// go to location
if ('geolocation' in navigator) {
    console.log('geolocation available');
    navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        $("#lat").text(lat);
        $('#lon').text(lon);
        //flies to location
        mymap.flyTo([lat, lon], 13);

        //adds marker
        var marker = L.marker([lat, lon]).addTo(mymap);
    });
} else {
    console.log("geolocation not available")
}

$("#buttons").append(`<button id="london">Go to london</button>`)
$("#london").on("click", function () {
    mymap.flyTo([40.737, -73.923], 8);
})


L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(mymap);

var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(mymap);

var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(mymap);
        console.log(e.latlng)
}

mymap.on('click', onMapClick);




// user password hashing/retrieval


// populate threads 
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

let threadData = {
    dwlkjdKNDknddskdn : {
        lat: 37.898968718507604,
        lon: -122.06153870073815,
        heading: `This Taco Joint is da Bomb`,
        body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis id nulla leo. Morbi venenatis quam egestas mi euismod tempor. Proin eleifend tellus quis ex molestie commodo. Vestibulum sit amet hendrerit risus. Duis vitae pulvinar turpis. Vestibulum id volutpat enim. Nunc vel nibh eget sem finibus lacinia vel eu augue. Phasellus eget quam tortor. Proin volutpat massa et metus efficitur consequat. Vestibulum at leo at ex euismod venenatis euismod vel tellus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce mi metus, fringilla sed venenatis viverra, ultrices vel metus.<br/><br/>
        Ut sagittis dapibus nibh. Nullam tempor in augue ac aliquet. Duis tristique felis mi, et suscipit lacus pretium sed. Morbi maximus nisl non nibh semper, a congue velit efficitur. Donec vitae purus sed sem lobortis pellentesque sed at erat. Donec vulputate libero feugiat mi eleifend tincidunt et non nunc. Nullam commodo turpis odio, id gravida ligula porttitor at.`,
        dateCreated: `2019-10-04 20:49:41` ,
        user: userData.pushkey1
    },
    SMDSNKwkjendasdnawe : {
        lat:  37.89029895048281,
        lon:-122.05570221443803,
        heading: `Crazy Car Crash here`,
        body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis id nulla leo. Morbi venenatis quam egestas mi euismod tempor. Proin eleifend tellus quis ex molestie commodo. Vestibulum sit amet hendrerit risus. Duis vitae pulvinar turpis. Vestibulum id volutpat enim. Nunc vel nibh eget sem finibus lacinia vel eu augue. Phasellus eget quam tortor. Proin volutpat massa et metus efficitur consequat. Vestibulum at leo at ex euismod venenatis euismod vel tellus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce mi metus, fringilla sed venenatis viverra, ultrices vel metus.<br/><br/>
        Ut sagittis dapibus nibh. Nullam tempor in augue ac aliquet. Duis tristique felis mi, et suscipit lacus pretium sed. Morbi maximus nisl non nibh semper, a congue velit efficitur. Donec vitae purus sed sem lobortis pellentesque sed at erat. Donec vulputate libero feugiat mi eleifend tincidunt et non nunc. Nullam commodo turpis odio, id gravida ligula porttitor at.`,
        dateCreated: `2019-10-04 20:49:41` ,
        user: userData.pushkey1
    },
    kskrnkAKJskndwmasdw : {
        lat:   37.901813263649665,
        lon:-122.06102371665287,
        heading: `Crazy Car Crash here`,
        body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis id nulla leo. Morbi venenatis quam egestas mi euismod tempor. Proin eleifend tellus quis ex molestie commodo. Vestibulum sit amet hendrerit risus. Duis vitae pulvinar turpis. Vestibulum id volutpat enim. Nunc vel nibh eget sem finibus lacinia vel eu augue. Phasellus eget quam tortor. Proin volutpat massa et metus efficitur consequat. Vestibulum at leo at ex euismod venenatis euismod vel tellus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce mi metus, fringilla sed venenatis viverra, ultrices vel metus.<br/><br/>
        Ut sagittis dapibus nibh. Nullam tempor in augue ac aliquet. Duis tristique felis mi, et suscipit lacus pretium sed. Morbi maximus nisl non nibh semper, a congue velit efficitur. Donec vitae purus sed sem lobortis pellentesque sed at erat. Donec vulputate libero feugiat mi eleifend tincidunt et non nunc. Nullam commodo turpis odio, id gravida ligula porttitor at.`,
        dateCreated: `2019-10-04 20:49:41` ,
        user: userData.pushkey1
    }
}

let todaysDate = Date.parse()

$('#thread-list').html(function () {
    let html = ''
    let keys = Object.keys(threadData)
    for (let i = 0; i < keys.length; i++) {

        let {lat, lon, heading, body, dateCreated, user} = threadData[keys[i]];
        let {userName, images} = user;
        let {thumb} = user.images;
        
        html += `
            <a href="#" class="list-group-item list-group-item-action ${i === 0 ? 'active' : ''}">
                <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">${heading}</h5>
                <small>
                    ${((date = dateCreated) => `${['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'Septemper', 'October', 'November', 'December'][date.slice(5, 7)-1]} ${parseInt(date.slice(8, 10))}, ${date.slice(0, 4)}`)()}
                </small>
            </div>
            <p class="mb-1">
                ${body.length > 140 ? `${body.slice(0, 140)}...` : body }
            </p>
            <small>By ${userName} | 10 new replies</small>
            </a>
        `;
        //adds marker
        var marker = L.marker([lat, lon]).addTo(mymap);
    }
    
    return html;

});
