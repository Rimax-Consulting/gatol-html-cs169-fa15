var DashBoard = (function() {

    // PRIVATE VARIABLES
    var dash_header; // get the dashboard header
    var dash_container; // holds dashboard objects, value set in the "start" method below

    // PRIVATE METHODS

    var attachCreateHandler = function(e) {

        dash_header.on('click', '#add', function(e) {
            //location.href = 'file:///Users/AllenYu/Desktop/cs169-dx/gatol_html_proj/input_link.html';
            location.href = 'http://allenyu94.github.io/gatol-html/input_link'; 
        });

        dash_header.on('click', '#create', function(e) {
            //location.href = 'file:///Users/AllenYu/Desktop/cs169-dx/gatol_html_proj/create_game.html';
            location.href = 'http://allenyu94.github.io/gatol-html/create_game';
        });

        dash_header.on('click', '#logout', function(e) {
            
            var auth_token = getCookie('auth_token');
            
            var onSuccess = function(data) {
                alert('successfully logged out');
                deleteCookie('auth_token'); 
                if (getCookie('auth_token') == "") {
                    alert("successfully removed auth token from cookies");
                    //location.href = 'file:///Users/AllenYu/Desktop/cs169-dx/gatol_html_proj/index.html'
                    location.href = 'http://allenyu94.github.io/gatol-html/';
                }
            };

            var onFailure = function() { 
                console.error('failure to logout');
            };

            url = '/api/sessions/' + auth_token;
            makeDeleteRequest(url, onSuccess, onFailure);

        });

    };

    /**
     * Start the app and attach event handlers.
     * @return {None}
     */
    var start = function() {
        dash_header = $("#dashboard_header");
        dash_container = $("#dashboard_container");

        attachCreateHandler();

        console.log(getCookie("auth_token"));

    };

    // PUBLIC METHODS
    // any private methods returned in the hash are accessible via Dashboard.key_name, e.g. Dashboard.start()
    return {
        start: start
    };

})();
