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