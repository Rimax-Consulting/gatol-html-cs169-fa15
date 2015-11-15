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
            if (inDev) {
                location.href = 'file:///Users/AllenYu/Desktop/cs169-dx/gatol_html_proj/create_game.html';
            } else {
                location.href = 'http://allenyu94.github.io/gatol-html/create_game';
            }
        });

        dash_header.on('click', '#logout', function(e) {
            
            var auth_token = getCookie('auth_token');
            
            var onSuccess = function(data) {
                alert('successfully logged out');
                deleteCookie('auth_token'); 
                if (getCookie('auth_token') == "") {
                    alert("successfully removed auth token from cookies");
                    if (inDev) {
                        location.href = 'file:///Users/AllenYu/Desktop/cs169-dx/gatol_html_proj/index.html'
                    } else {
                        location.href = 'http://allenyu94.github.io/gatol-html/';
                    }
                }
            };

            var onFailure = function() { 
                console.error('failure to logout');
            };

            url = '/api/sessions/' + auth_token;
            console.log('url is: ' + url);
            makeDeleteRequest(url, onSuccess, onFailure);

        });

    };

    // checks the User type and updates the page accordingly.
    var checkUser = function(e) {
        trainer = getCookie('trainer');
        token = getCookie('auth_token');
        console.log(trainer);
        if (trainer == 'true') {
            // signed in as trainer
            document.getElementById('create').style.visibility = 'visible';
            document.getElementById('add').style.visibility = 'hidden';
            document.getElementById('add').style.display = 'none';
            url = '/api/games';
        } else {
            // signed in as student
            document.getElementById('add').style.visibility = 'visible';
            document.getElementById('create').style.visibility = 'hidden';
            document.getElementById('create').style.display = 'none';
            url = '/api/game_instances/active'
        }

        var onSuccess = function(data) {
            console.log('data: ' + data);
            games = JSON.parse(data.games);
            console.log('games: ' + games);
            var ul = document.getElementById('games_list');
            for (var i = 0; i < games.length; i++) {
                console.log(games[i]);
                var li = document.createElement('li');
                var a = document.createElement('a');
                var bar = document.createElement('div');

                a.setAttribute('href', '#' + games[i].name);
                a.innerHTML = games[i].name;
                bar.setAttribute('class', 'fullbar');
                li.appendChild(a);
                li.setAttribute('id', qsets[i].id);
                ul.appendChild(li);
                ul.appendChild(bar);
            }
        };

        var onFailure = function(data) {
            consoleError(data);
        };

        console.log('url: ' + url);
        makeGetRequestWithAuthorization(url, token, onSuccess, onFailure); 
    };

    /**
     * Start the app and attach event handlers.
     * @return {None}
     */
    var start = function() {
        dash_header = $("#dashboard_header");
        dash_container = $("#dashboard_container");

        attachCreateHandler();
        //checkUser();
    };

    // PUBLIC METHODS
    // any private methods returned in the hash are accessible via Dashboard.key_name, e.g. Dashboard.start()
    return {
        start: start
    };

})();
