/**
 * GATOL js file
 * 
 * Helps keep track of helper methods that each js may need.
 */

/* =========================== Shared Variables =========================== */

// the backend we are using
//var apiUrl = 'https://calm-garden-9078.herokuapp.com' 
var apiUrl = 'https://gatol.herokuapp.com' 

// maps game_template_id to image
var gameTemplateIdToImage = {1:'images/blobbers_example.png', 2:'images/baskets_example.png'};

// maps game_template_id to game description
var gameTemplateIdToDesc = {
    1: 'Blobbers! Basic game where you are a blob and you have to eat the correct blob!',
    2: 'Baskets! Basic game where you control a basket and have to catch the correct ball!',
    3: 'Shooters! Basic game where you control a gun and have to ensure the correct one lands first!'
}

// maps game_template_id to game title
var gameTemplateIdToTitle = {1:'Blobbers', 2:'Baskets', 3:'Shooters'};

// url to use when in development mode
var devUrl = 'file:///Users/AllenYu/Desktop/cs169-dx/gatol_html_proj/';

// url to use for release
var releaseUrl = 'https://allenyu94.github.io/gatol-html/'

// determine whether or not we are in development mode. 
var inDev = true;


/* =========================== JSON Request Logic =========================== */

/**
 * HTTP GET request
 * @param  {string}   url       URL path, e.g. "/api/question_sets"
 * @param  {function} onSuccess   callback method to execute upon request success (200 status)
 * @param  {function} onFailure   callback method to execute upon request failure (non-200 status)
 * @return {None}
 */
var makeGetRequest = function(url, onSuccess, onFailure) {
    $.ajax({
        type: 'GET',
        url: apiUrl + url,
        dataType: "JSON",
        success: onSuccess,
        error: onFailure
    });
};

/**
 * HTTP GET request
 * @param  {string}   url       URL path, e.g. "/api/question_sets"
 * @param  {string}   token     authorization token
 * @param  {function} onSuccess   callback method to execute upon request success (200 status)
 * @param  {function} onFailure   callback method to execute upon request failure (non-200 status)
 * @return {None}
 */
var makeGetRequestWithAuthorization = function(url, token, onSuccess, onFailure) {
    $.ajax({
        type: 'GET',
        url: apiUrl + url,
        headers: {'Authorization': token},
        dataType: "JSON",
        success: onSuccess,
        error: onFailure
    });
};

/**
 * HTTP GET request with Data and authorization
 * @param  {string}   url       URL path, e.g. "/api/question_sets"
 * @param  {string}   token     authorization token
 * @param  {function} onSuccess   callback method to execute upon request success (200 status)
 * @param  {function} onFailure   callback method to execute upon request failure (non-200 status)
 * @return {None}
 */
var makeGetRequestWithAuthorizationAndData = function(url, data, token, onSuccess, onFailure) {
    $.ajax({
        type: 'GET',
        url: apiUrl + url,
        headers: {'Authorization': token},
        data: JSON.stringify(data),
        dataType: "JSON",
        success: onSuccess,
        error: onFailure
    });
};

/**
 * HTTP POST request
 * @param  {string}   url       URL path, e.g. "/api/trainers"
 * @param  {Object}   data      JSON data to send in request body
 * @param  {function} onSuccess   callback method to execute upon request success (200 status)
 * @param  {function} onFailure   callback method to execute upon request failure (non-200 status)
 * @return {None}
 */
var makePostRequest = function(url, data, onSuccess, onFailure) {
    $.ajax({
        type: 'POST',
        url: apiUrl + url,
        data: JSON.stringify(data),
        contentType: "application/json",
        dataType: "JSON",
        success: onSuccess,
        error: onFailure
    });
};

/**
 * HTTP POST request (with Authorization token)
 * @param  {string}   url       URL path, e.g. "/api/trainers"
 * @param  {Object}   data      JSON data to send in request body
 * @param  {string}   token     authorization token
 * @param  {function} onSuccess   callback method to execute upon request success (200 status)
 * @param  {function} onFailure   callback method to execute upon request failure (non-200 status)
 * @return {None}
 */
var makePostRequestWithAuthorization = function(url, data, token, onSuccess, onFailure) {
    $.ajax({
        type: 'POST',
        url: apiUrl + url,
        headers: {'Authorization': token},
        data: JSON.stringify(data),
        contentType: "application/json",
        dataType: "JSON",
        success: onSuccess,
        error: onFailure
    });
};

/**
 * HTTP PUT request
 * @param  {string}   url       URL path, e.g. "/api/trainers"
 * @param  {Object}   data      JSON data to send in request body
 * @param  {function} onSuccess   callback method to execute upon request success (200 status)
 * @param  {function} onFailure   callback method to execute upon request failure (non-200 status)
 * @return {None}
 */
var makePutRequest = function(url, data, onSuccess, onFailure) {
    $.ajax({
        type: 'PUT',
        url: apiUrl + url,
        data: JSON.stringify(data),
        contentType: "application/json",
        dataType: "JSON",
        success: onSuccess,
        error: onFailure
    });
};

/**
 * HTTP PUT request (with Authorization token)
 * @param  {string}   url       URL path, e.g. "/api/trainers"
 * @param  {Object}   data      JSON data to send in request body
 * @param  {string}   token     authorization token
 * @param  {function} onSuccess   callback method to execute upon request success (200 status)
 * @param  {function} onFailure   callback method to execute upon request failure (non-200 status)
 * @return {None}
 */
var makePutRequestWithAuthorization = function(url, data, token, onSuccess, onFailure) {
    $.ajax({
        type: 'PUT',
        url: apiUrl + url,
        headers: {'Authorization': token},
        data: JSON.stringify(data),
        contentType: "application/json",
        dataType: "JSON",
        success: onSuccess,
        error: onFailure
    });
};


/**
 * UPLOAD CSV request (with Authorization token)
 * @param  {string}   url       URL path, e.g. "/api/trainers"
 * @param  {Object}   data      JSON data to send in request body. In the form of FormData with file appended
 * @param  {string}   token     authorization token
 * @param  {function} onSuccess   callback method to execute upon request success (200 status)
 * @param  {function} onFailure   callback method to execute upon request failure (non-200 status)
 * @return {None}
 */
var uploadCSVrequest = function(url, data, token, onSuccess, onFailure) {
    $.ajax({
        type: 'POST',
        url: apiUrl + url,
        headers: {'Authorization': token},
        data: data,
        processData: false,
        contentType: false,
        dataType: "JSON",
        success: onSuccess,
        error: onFailure
    });
};

/**
 * HTTP DELETE request
 * @param  {string}   url       URL path, e.g. "/api/sessions/:id" (id = auth_token)
 * @param  {Object}   data      JSON data to send in request body
 * @param  {function} onSuccess   callback method to execute upon request success (204 status)
 * @param  {function} onFailure   callback method to execute upon request failure (non-200 status)
 * @return {None}
 */
var makeDeleteRequest = function(url, onSuccess, onFailure) {
    $.ajax({
        type: 'DELETE',
        url: apiUrl + url,
        //data: JSON.stringify(data),
        contentType: "application/json",
        dataType: "JSON",
        success: onSuccess,
        error: onFailure
    });
};

/**
 * HTTP DELETE request (with authorization token)
 * @param  {string}   url       URL path, e.g. "/api/sessions/:id" (id = auth_token)
 * @param  {Object}   data      JSON data to send in request body
 * @param  {string}   token     authorization token
 * @param  {function} onSuccess   callback method to execute upon request success (204 status)
 * @param  {function} onFailure   callback method to execute upon request failure (non-200 status)
 * @return {None}
 */
var makeDeleteRequestWithAuthorization = function(url, token, onSuccess, onFailure) {
    $.ajax({
        type: 'DELETE',
        url: apiUrl + url,
        headers: {'Authorization': token},
        //data: JSON.stringify(data),
        contentType: "application/json",
        dataType: "JSON",
        success: onSuccess,
        error: onFailure
    });
};

/* =========================== Cookie Logic =========================== */

// Sets the Cookie
function setCookie(cname, cvalue) {
    // currently only doing expiration of 4 hours
    var now = new Date();
    var time = now.getTime();
    time += 4 * 3600 * 1000;
    now.setTime(time);

    document.cookie= cname + "=" + cvalue +
    "; expires=" + now.toUTCString() +
    "; path=/"; 

    console.log("set cookie: " + cname + "=" + cvalue +
    "; expires=" + now.toUTCString() +
    "; path=/");
}

// Gets the Cookie
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

// Deletes the Cookie
function deleteCookie(cname) {
    document.cookie= cname + "=" +
    "; expires=Thu, 01 Jan 1970 00:00:00 UTC" +
    "; path=/"; 

    console.log("deleted cookie: " + cname);
}

// Used for debugging
function checkCookie() {
    var auth = getCookie("auth_token");
    if (auth != "") {
        alert("Welcome again, auth token: " + auth);
    }
}

/* =========================== Helpful Functions =========================== */

// show error in console
function consoleError(data) {
    console.error(data.status);
    console.error(data.responseText);
}


