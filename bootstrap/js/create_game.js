var CreateGame = (function() {

    // PRIVATE VARIABLES
    var create_container; // holds create game container, value set in the "start" method below

    // PRIVATE METHODS

    var attachCreateHandler = function(e) {

        create_container.on('click', '#create-finish', function(e) {
            var finish = {} // container to hold game data to be created
            qset = create_container.find('.csv-item.selected');
            template = create_container.find('.template-item.selected');
            template_li = template[0];
            qset_li = qset[0];
            finish.question_set_id = qset_li.id;
            finish.game_template_id = template_li.id;
            finish.description = create_container.find('#create-game-description').val();
            finish.name = create_container.find('#create-game-title').val();
            console.log(finish);

            token = getCookie('auth_token');

            var onSuccess = function(data) {
                //alert('successfully created game');
                location.href = 'dashboard.html';

            };

            var onFailure = function(data) {
                consoleError(data);
            };

            url = '/api/games';
            makePostRequestWithAuthorization(url, finish, token, onSuccess, onFailure);

        });

        create_container.on('click', '#create-cancel', function(e) {
            location.href = 'dashboard.html';
        });

        create_container.on('click', '.csv-item', function(e) {
            $('.csv-item').removeClass('selected');
            $(this).addClass('selected'); 
        });

        create_container.on('click', '.template-item', function(e) {
            $('.template-item').removeClass('selected');
            $(this).addClass('selected'); 
        });

    };

    // GET DATA FROM BACKEND

    var setQuestionSets = function(e) {

        var onSuccess = function(data) {
            qsets = data.question_sets;
            var ul = document.getElementById('csv-list');
            var firstA = document.createElement('a');
            firstA.setAttribute('class', 'list-group-item');
            ul.appendChild(firstA);
            for (var i = 0; i < qsets.length; i++) {
                console.log(qsets[i]);
                var a = document.createElement('a');

                a.setAttribute('href', '#' + qsets[i].setname);
                a.setAttribute('class', 'list-group-item csv-item');
                a.innerHTML = qsets[i].setname;
                a.setAttribute('id', qsets[i].id);
                ul.appendChild(a);
            }
        };

        var onFailure = function(data) {
            consoleError(data);
        };

        makeGetRequestWithAuthorization('/api/question_sets', getCookie('auth_token'), onSuccess, onFailure);
    };

    var setGameTemplates = function(e) {

        var onSuccess = function(data) {
            templates = data.templates;
            console.log(templates);
            var ul = document.getElementById('template-list');
            var firstA = document.createElement('a');
            firstA.setAttribute('class', 'list-group-item');
            ul.appendChild(firstA);
            for (var i = 0; i < templates.length; i++) {
                console.log(templates[i]);
                var a = document.createElement('a');

                a.setAttribute('href', '#' + templates[i].name);
                a.setAttribute('class', 'list-group-item template-item');
                a.innerHTML = templates[i].name;
                a.setAttribute('id', templates[i].id);
                ul.appendChild(a);
            }
        };

        var onFailure = function(data) {
            consoleError(data);
        };

        makeGetRequestWithAuthorization('/api/game_templates', getCookie('auth_token'), onSuccess, onFailure);
    };

    /**
     * Start the app and attach event handlers.
     * @return {None}
     */
    var start = function() {
        create_container = $("#create-game-container");

        setQuestionSets();
        setGameTemplates();

        attachCreateHandler();

    };

    // PUBLIC METHODS
    // any private methods returned in the hash are accessible via CreateGame.key_name, e.g. CreateGame.start()
    return {
        start: start
    };

})();
