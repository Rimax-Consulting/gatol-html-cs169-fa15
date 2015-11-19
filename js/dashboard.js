var DashBoard = (function() {

    // PRIVATE VARIABLES
    var dash_header; // get the dashboard header
    var dash_container; // holds dashboard objects, value set in the "start" method below
    var games_list; // list of games returned by DB call. Initially empty to prevent failures
    var trainer; // is this user a trainer?

    // PRIVATE METHODS

    var attachCreateHandler = function(e) {

        // initially hide game preview screen
        dash_container.find('#game_preview').hide();

        dash_header.on('click', '#add', function(e) {
            if (inDev) {
                location.href = 'file:///Users/AllenYu/Desktop/cs169-dx/gatol_html_proj/input_link.html';
            } else {
                location.href = 'http://allenyu94.github.io/gatol-html/input_link'; 
            }
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

        dash_container.on('click', '.game_item', function (e) {
            // hide dashboard only elements
            dash_container.find('#dashboard_elements').hide();
            dash_header.find('#logout').hide();
            dash_header.find('#create').hide();
            dash_header.find('#add').hide();
            
            gameId = $(this).closest('li').id;
            var gameDetails;
            
            for (var i = 0; i < games_list.length; i++) {
                currGame = games_list[i];
                if (gameId = currGame.id) {
                    gameDetails = currGame;
                    break;
                }
            }

            if (gameDetails == null) {
                console.log('error getting game details on click');
            }

            game_temp_id = gameDetails.game_template_id;
            imgPath = gameTemplateIdToImage[game_temp_id];

            console.log('game temp id: ' + game_temp_id);
            console.log('imgPath: ' + imgPath);

            document.getElementById('dashboard_title').innerHTML = gameTemplateIdToTitle[game_temp_id];
            document.getElementById('game_preview_img').src = imgPath;
            document.getElementById('game_desc').innerHTML = gameTemplateIdToDesc[game_temp_id];
            document.getElementById('test_desc').innerHTML = gameDetails.description;
            
            dash_container.find('#game_preview').show();

        });

        dash_container.on('click', '#preview_back_btn', function(e) {
            // hide game preview elements
            document.getElementById('dashboard_title').innerHTML = "Dashboard";
            
            if (trainer) {
                dash_header.find('#create').show();
            }

            dash_header.find('#logout').show();
            dash_container.find('#game_preview').hide(); 
            dash_container.find('#dashboard_elements').show();

        });

    };

    // checks the User type and updates the page accordingly.
    var checkUser = function(e) {
        trainer = getCookie('trainer');
        token = getCookie('auth_token');
        console.log("I am a trainer: " + trainer);
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
            games_list = data.games;
            var ul = document.getElementById('games_list');
            for (var i = 0; i < games_list.length; i++) {
                currGame = games_list[i];
                console.log(currGame);

                var li = document.createElement('li');
                var a = document.createElement('a');
                var bar = document.createElement('div');

                a.setAttribute('href', '#' + currGame.description);
                a.setAttribute('class', 'game_item');
                a.innerHTML = currGame.description;
                bar.setAttribute('class', 'fullbar');
                li.appendChild(a);
                li.setAttribute('id', currGame.id);
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
        games_list = [];

        attachCreateHandler();
        checkUser();
    };

    // PUBLIC METHODS
    // any private methods returned in the hash are accessible via Dashboard.key_name, e.g. Dashboard.start()
    return {
        start: start
    };

})();
