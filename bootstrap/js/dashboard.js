var games_list = []; // list of games returned by DB call. Initially empty to prevent failures
var trainer; // is this user a trainer?
var current_game_id; // holds the current game id
var enrolledStudents; // holds the enrolled students' emails

var getGameDetailFromGameList = function(e) {
    for (var i = 0; i < games_list.length; i++) {
        currGame = games_list[i];
        if (current_game_id == currGame.id) {
            return currGame;
        }
    }

}



$('#logout').on('click', function(e) {
    var auth_token = getCookie('auth_token');
    
    var onSuccess = function(data) {
        deleteCookie('auth_token'); 
        if (getCookie('auth_token') == "") {
            location.href = 'index.html'
        }
    };

    var onFailure = function(data) { 
        consoleError(data);
    };

    url = '/api/sessions/' + auth_token;
    //console.log('url is: ' + url);
    makeDeleteRequest(url, onSuccess, onFailure);    
});



$('#preview-play-btn').on('click', function(e) {
    setCookie('game_id', current_game_id); 
    location.href = 'game.html';
});



$('#').on('click', function(e) {
    
});

$('#').on('click', function(e) {
    
});

var DashBoard = (function() {

    var attachCreateHandler = function(e) {

        $('#create').on('click', function(e) {
            location.href = 'create-game.html'; 
        });

        $('#preview-back-btn').on('click', function(e) {
             // hide game preview elements
            document.getElementById('dashboard-title').innerHTML = "Dashboard";
            
            if (trainer) {
                $('#create').show();
            }

            $('#logout').show();
            dash_container.find('#game-preview').hide(); 
            dash_container.find('#dashboard-elements').show();   
        });

        dash_container.on('click', '.game-item', function(e) {
            // hide dashboard only elements
            $('#dashboard-elements').hide();
            $('#logout').hide();
            $('#create').hide();
            
            current_game_id = parseInt($(this).attr('id'));
            
            gameDetails = getGameDetailFromGameList();

            if (gameDetails == null) {
                console.log('error getting game details on click');
            }

            game_temp_id = gameDetails.game_template_id;
            imgPath = gameTemplateIdToImage[game_temp_id];

            document.getElementById('dashboard-title').innerHTML = gameDetails.name;
            document.getElementById('game-preview-img').src = imgPath;
            document.getElementById('game-desc').innerHTML = gameTemplateIdToDesc[game_temp_id];
            document.getElementById('test-desc').innerHTML = gameDetails.description;
            
            dash_container.find('#game-preview').show();
        });

        dash_container.on('click', '#enroll-btn', function(e) {
            dash_container.find('#game-preview').hide();
            dash_container.find('#enroll-container').show(); 

            token = getCookie('auth_token');
            creds = {};

            var onSuccess = function(data) {
                console.log(data);
                enrolledStudents = data.game_enrollments;
                ul = document.getElementById('enroll-list');
                var firstLi = document.createElement('li');
                firstLi.setAttribute('class', 'list-group-item');
                ul.appendChild(firstLi);
                for (var i = 0; i < enrolledStudents.length; i++) {
                    currItem = enrolledStudents[i];
                    console.log(currItem);
                    
                    var li = document.createElement('li');

                    li.innerHTML = currItem.student_email;
                    if (!currItem.registered) {
                        li.innerHTML += ' (not yet registered)';
                    }
                    li.setAttribute('id', currItem.id);
                    li.setAttribute('class', 'list-group-item');
                    ul.appendChild(li);
                }
            };

            var onFailure = function(data) {
                consoleError(data); 
            };

            url = '/api/game_enrollments/' + current_game_id;
            console.log(url);
            makeGetRequestWithAuthorization(url, token, onSuccess, onFailure);

        });

        dash_container.on('click', '#enroll-cancel', function(e) {
            dash_container.find('#enroll-container').hide(); 
            dash_container.find('#game-preview').show();
            $('#enroll-list').empty();
        });

        dash_container.on('click', '#enroll-students-btn', function(e) {
            dash_container.find('#enroll-btns').hide();
            dash_container.find('#enroll-students').show();
        });

        dash_container.on('click', '#enroll-back', function(e) {
            dash_container.find('#enroll-students').hide();
            dash_container.find('#enroll-btns').show();
        });

        dash_container.on('click', '#unenroll-students-btn', function(e) {
            dash_container.find('#enroll-btns').hide();
            dash_container.find('#unenroll-students').show();
        });

        dash_container.on('click', '#unenroll-back', function(e) {
            dash_container.find('#unenroll-students').hide();
            dash_container.find('#enroll-btns').show();
        });

        dash_container.on('click', '#enroll', function(e) {
            token = getCookie('auth_token');

            creds = {};
            creds.game_id = current_game_id;
            creds.student_email = dash_container.find('#enroll-student-email').val();  

            var onSuccess = function(data) {
                console.log(data);
                currItem = data;
                ul = document.getElementById('enroll-list');
                var li = document.createElement('li');
                var a = document.createElement('a');

                li.innerHTML = currItem.student_email;
                if (!data.registered) {
                    li.innerHTML += ' (not yet registered)';
                }
                li.setAttribute('id', data.id);
                li.setAttribute('class', 'list-group-item');
                ul.appendChild(li);
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

            student_email = dash_container.find('#unenroll-student-email').val();

            ul = document.getElementById('enroll-list');
            aList = ul.getElementsByTagName('li');

            var idToRemove;

            for (var i = 0; i < aList.length; i++) {
                if (aList[i].innerHTML == student_email) {
                    idToRemove = aList[i].id; 
                } 
            }

            if (idToRemove == null) {
                alert('cannot find student email to unenroll');
                return;
            }

            var onSuccess = function(data) {
                console.log(data);
                liToRemove = $('#' + idToRemove);
                $('#' + idToRemove).remove();
            };

            var onFailure = function(data) {
                consoleError(data);
            };

            url = '/api/game_enrollments/' + idToRemove;
            console.log(url);
            makeDeleteRequestWithAuthorization(url, token, onSuccess, onFailure);

        });

        dash_container.on('click', '#statistics-btn', function(e) {

            dash_container.find('#game-preview').hide(); 
            dash_container.find('#stats-container').show(); 

            token = getCookie('auth_token');
            console.log('current_game_id');
            console.log(current_game_id);

            var onSuccess = function(data) {
                $("#stats-list li").remove();

                console.log(data);
                stats = data.player_summaries;
                ul = document.getElementById('stats-list');
                var firstLi = document.createElement('li');
                firstLi.setAttribute('class', 'list-group-item');
                ul.appendChild(firstLi);
                for (var i = 0; i < stats.length; i++) {
                    stat = stats[i];
                    var li = document.createElement('li');

                    li.innerHTML = "Student: " + stat.student_id + ", Average Score: " + stat.avg_score + ", Highest Score: " + stat.highest_score;
                    li.setAttribute('id', stat.student_id);
                    li.setAttribute('class', 'list-group-item');
                    ul.appendChild(li);
                }
                
            };

            var onFailure = function(data) {
                consoleError(data);
            };

            url = '/api/game_instances/summary?game_id=' + current_game_id;
            makeGetRequestWithAuthorization(url, token, onSuccess, onFailure);


            var leaderboardSuccess = function(data) {
                $("#leader-list li").remove();

                console.log(data);
                rankings = data.ranking;
                console.log(rankings);
                ul = document.getElementById('leader-list');
                var firstLi = document.createElement('li');
                firstLi.setAttribute('class', 'list-group-item');
                ul.appendChild(firstLi);
                for (var i = 0; i < rankings.length; i++) {
                    ranking = rankings[i];
                    var li = document.createElement('li');

                    li.innerHTML = ranking.email + " score: " + ranking.score;
                    li.setAttribute('class', 'list-group-item');
                    ul.appendChild(li);
                }
            };

            var leaderboardFailure = function(data) {
                consoleError(data);
            };

            leaderboardUrl = '/api/game_instances/leaderboard?game_id=' + current_game_id;
            //leaderboardUrl = '/api/game_instances/leaderboard?game_id=5';
            makeGetRequestWithAuthorization(leaderboardUrl, token, leaderboardSuccess, leaderboardFailure);

        });

        dash_container.on('click', '#statistics-back', function(e) {
            
            dash_container.find('#stats-container').hide();
            dash_container.find('#game-preview').show();

        });

    };

    // checks the User type and updates the page accordingly.
    var checkUser = function(e) {
        trainer = getCookie('trainer');
        token = getCookie('auth_token');
        console.log("I am a trainer: " + trainer);
        if (trainer) {
            // signed in as trainer
            document.getElementById('create').style.visibility = 'visible';
            url = '/api/games';
        } else {
            // signed in as student
            dash_container.find('#enroll-btn').hide();
            document.getElementById('create').style.visibility = 'hidden';
            document.getElementById('create').style.display = 'none';
            url = '/api/games';
            //url = '/api/game_enrollments'
        }

        var onSuccess = function(data) {
            console.log(data);
            console.log('trainer: ' + trainer);
            games_list = data.games;
            var ul = document.getElementById('games-list');
            for (var i = 0; i < games_list.length; i++) {
                game = games_list[i];
                console.log(game);

                var a = document.createElement('a');

                a.setAttribute('href', '#' + game.name);
                a.innerHTML = game.name;
                a.setAttribute('class', 'list-group-item game-item');
                a.setAttribute('id', game.id);
                ul.appendChild(a);
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
        dash_container = $("#dashboard-container");
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
