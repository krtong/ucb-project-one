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
    console.log(dataObj)
    threadData[pushkey] = dataObj;
    displayFormToggle(false)
    popup.remove()
}
////////// END CREATE THREAD FORM ///////////