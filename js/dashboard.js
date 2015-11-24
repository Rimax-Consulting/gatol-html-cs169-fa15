var DashBoard = (function() {

    // PRIVATE VARIABLES
    var dash_header; // get the dashboard header
    var dash_container; // holds dashboard objects, value set in the "start" method below
    var games_list; // list of games returned by DB call. Initially empty to prevent failures
    var trainer; // is this user a trainer?

    var current_game_id; // holds the current game id
    var enrolledStudents // holds the enrolled students' emails

    // PRIVATE METHODS

    // helps for testing
    var getGameDetailFromGameList = function(e) {
        for (var i = 0; i < games_list.length; i++) {
            currGame = games_list[i];
            if (current_game_id == currGame.id) {
                return currGame;
            }
        }

    }

    var attachCreateHandler = function(e) {

        // initially hide game preview screen
        dash_container.find('#game_preview').hide();

        // initially hide game enrollment screen
        dash_container.find('#enroll_container').hide();

        // initially hide enroll input screen and unenroll input screen
        dash_container.find('#enroll_students').hide();
        dash_container.find('#unenroll_students').hide();

        // initially hide stats container
        dash_container.find('#stats_container').hide();

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
                //alert('successfully logged out');
                deleteCookie('auth_token'); 
                if (getCookie('auth_token') == "") {
                    //alert("successfully removed auth token from cookies");
                    if (inDev) {
                        location.href = 'file:///Users/AllenYu/Desktop/cs169-dx/gatol_html_proj/index.html'
                    } else {
                        location.href = 'http://allenyu94.github.io/gatol-html/';
                    }
                }
            };

            var onFailure = function(data) { 
                consoleError(data);
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
            
            current_game_id = parseInt($(this).closest('li').attr('id'));
            
            gameDetails = getGameDetailFromGameList();
            console.log('game details');
            console.log(gameDetails);

            if (gameDetails == null) {
                console.log('error getting game details on click');
            }

            if (trainer == 'true') {
                game_temp_id = gameDetails.game_template_id;
            } else {
                game_temp_id = gameDetails.template_id;
            }
            imgPath = gameTemplateIdToImage[game_temp_id];

            console.log('game temp id: ' + game_temp_id);
            console.log('imgPath: ' + imgPath);

            document.getElementById('dashboard_title').innerHTML = gameTemplateIdToTitle[game_temp_id];
            document.getElementById('game_preview_img').src = imgPath;
            document.getElementById('game_desc').innerHTML = gameTemplateIdToDesc[game_temp_id];
            document.getElementById('test_desc').innerHTML = gameDetails.description;
            
            dash_container.find('#game_preview').show();

        });

        dash_container.on('click', '#preview_play_btn', function(e) {
            setCookie("game_id", current_game_id);
            if (inDev) {
                location.href = 'file:///Users/AllenYu/Desktop/cs169-dx/gatol_html_proj/game.html';
            } else {
                location.href = 'http://allenyu94.github.io/gatol-html/game';
            } 
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

        dash_container.on('click', '#enroll_btn', function(e) {
            dash_container.find('#game_preview').hide();
            dash_container.find('#enroll_container').show(); 

            token = getCookie('auth_token');
            creds = {};

            var onSuccess = function(data) {
                console.log(data);
                enrolledStudents = data.game_enrollments;
                ul = document.getElementById('enroll_list');
                for (var i = 0; i < enrolledStudents.length; i++) {
                    currItem = enrolledStudents[i];
                    console.log(currItem);
                    
                    var li = document.createElement('li');
                    var a = document.createElement('a');
                    var bar = document.createElement('div');

                    a.innerHTML = currItem.student_email;
                    if (!currItem.registered) {
                        a.innerHTML += ' (not yet registered)';
                    }
                    bar.setAttribute('class', 'fullbar');
                    li.appendChild(a);
                    li.setAttribute('id', currItem.id);
                    ul.appendChild(li);
                    ul.appendChild(bar);
                }
            };

            var onFailure = function(data) {
                consoleError(data); 
            };

            url = '/api/game_enrollments/' + current_game_id;
            console.log(url);
            makeGetRequestWithAuthorization(url, token, onSuccess, onFailure);

        });

        dash_container.on('click', '#enroll_cancel', function(e) {
            dash_container.find('#enroll_container').hide(); 
            dash_container.find('#game_preview').show();
            $('#enroll_list').empty();
        });

        dash_container.on('click', '#enroll_students_btn', function(e) {
            dash_container.find('#enroll_buttons').hide();
            dash_container.find('#enroll_students').show();
        });

        dash_container.on('click', '#enroll_back', function(e) {
            dash_container.find('#enroll_students').hide();
            dash_container.find('#enroll_buttons').show();
        });

        dash_container.on('click', '#unenroll_students_btn', function(e) {
            dash_container.find('#enroll_buttons').hide();
            dash_container.find('#unenroll_students').show();
        });

        dash_container.on('click', '#unenroll_back', function(e) {
            dash_container.find('#unenroll_students').hide();
            dash_container.find('#enroll_buttons').show();
        });

        dash_container.on('click', '#enroll', function(e) {
            token = getCookie('auth_token');

            creds = {};
            creds.game_id = current_game_id;
            creds.student_email = dash_container.find('#enroll_student_email').val();  

            var onSuccess = function(data) {
                console.log(data);
                currItem = data;
                ul = document.getElementById('enroll_list');
                var li = document.createElement('li');
                var a = document.createElement('a');
                var bar = document.createElement('div');

                a.innerHTML = currItem.student_email;
                if (!data.registered) {
                    a.innerHTML += ' (not yet registered)';
                }
                bar.setAttribute('class', 'fullbar');
                li.appendChild(a);
                li.setAttribute('id', data.id);
                ul.appendChild(li);
                ul.appendChild(bar);
            };

            var onFailure = function(data) {
                consoleError(data);
            };

            url = '/api/game_enrollments';
            makePostRequestWithAuthorization(url, creds, token, onSuccess, onFailure);

        });

        dash_container.on('click', '#unenroll', function(e) {
            token = getCookie('auth_token'); 
            console.log('token is: ' + token);

            student_email = dash_container.find('#unenroll_student_email').val();

            ul = document.getElementById('enroll_list');
            aList = ul.getElementsByTagName('a');

            var idToRemove;

            for (var i = 0; i < aList.length; i++) {
                if (aList[i].innerHTML == student_email) {
                    idToRemove = aList[i].closest('li').id; 
                } 
            }

            if (idToRemove == null) {
                alert('cannot find student email to unenroll');
                return;
            }

            var onSuccess = function(data) {
                console.log(data);
                liToRemove = $('#' + idToRemove);
                bar = liToRemove.next('div');
                $('#' + idToRemove).remove();
                bar.remove();
            };

            var onFailure = function(data) {
                consoleError(data);
            };

            url = '/api/game_enrollments/' + idToRemove;
            console.log(url);
            makeDeleteRequestWithAuthorization(url, token, onSuccess, onFailure);

        });

        dash_container.on('click', '#statistics_btn', function(e) {

            dash_container.find('#game_preview').hide(); 
            dash_container.find('#stats_container').show(); 

            token = getCookie('auth_token');
            console.log('current_game_id');
            console.log(current_game_id);

            var onSuccess = function(data) {
                console.log(data);
                rankings = data.ranking;
                for (var i = 0; i < rankings.length; i++) {
                    ul = document.getElementById('stats_list');
                    var li = document.createElement('li');
                    var a = document.createElement('a');
                    var bar = document.createElement('div');

                    a.innerHTML = rankings.student_id + " score: " + rankings.score + " date: " + rankings.date;
                    bar.setAttribute('class', 'fullbar');
                    li.appendChild(a);
                    li.setAttribute('id', rankings.student_id);
                    ul.appendChild(li);
                    ul.appendChild(bar);
                }
            };

            var onFailure = function(data) {
                consoleError(data);
            };

            url = '/api/game_instances/summary?game_id=' + current_game_id;
            makeGetRequestWithAuthorization(url, token, onSuccess, onFailure);


            var leaderboardSuccess = function(data) {
                console.log(data);
                rankings = data.ranking;
                console.log(rankings);
                for (var i = 0; i < rankings.length; i++) {
                    ranking = rankings[i];
                    ul = document.getElementById('leader_list');
                    var li = document.createElement('li');
                    var a = document.createElement('a');
                    var bar = document.createElement('div');

                    a.innerHTML = ranking.email + " score: " + ranking.score;
                    bar.setAttribute('class', 'fullbar');
                    li.appendChild(a);
                    //li.setAttribute('id', rankings.student_id);
                    ul.appendChild(li);
                    ul.appendChild(bar);
                }
            };

            var leaderboardFailure = function(data) {
                consoleError(data);
            };

            //leaderboardUrl = '/api/game_instances/leaderboard?game_id=' + current_game_id;
            leaderboardUrl = '/api/game_instances/leaderboard?game_id=5';
            makeGetRequestWithAuthorization(leaderboardUrl, token, leaderboardSuccess, leaderboardFailure);

        });

        dash_container.on('click', '#statistics_back', function(e) {
            
            dash_container.find('#stats_container').hide();
            dash_container.find('#game_preview').show();

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
            url = '/api/games';
        } else {
            // signed in as student
            dash_container.find('#enroll_btn').hide();
            document.getElementById('create').style.visibility = 'hidden';
            document.getElementById('create').style.display = 'none';
            url = '/api/games';
            //url = '/api/game_enrollments'
        }

        var onSuccess = function(data) {
            console.log(data);
            console.log('trainer: ' + trainer);
            games_list = data.games;
            var ul = document.getElementById('games_list');
            for (var i = 0; i < games_list.length; i++) {
                game = games_list[i];
                console.log(game);

                var li = document.createElement('li');
                var a = document.createElement('a');
                var bar = document.createElement('div');

                a.setAttribute('href', '#' + game.description);
                a.setAttribute('class', 'game_item');
                a.innerHTML = game.name;
                bar.setAttribute('class', 'fullbar');
                li.appendChild(a);
                li.setAttribute('id', game.id);
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

    var getGameInstanceFromGameId = function(id) {

        token = getCookie('auth_token');
        
        var onSuccess = function(data) {
            console.log(data);
        };

        var onFailure = function(data) {
            consoleError(data);
        };

        url = '/api/game_instances/' + id;
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
