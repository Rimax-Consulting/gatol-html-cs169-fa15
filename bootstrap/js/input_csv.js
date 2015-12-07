var InputCSV = (function() {

    // PRIVATE VARIABLES
    var csv_container; // holds link_input container, value set in the "start" method below

    // PRIVATE METHODS

    var attachCreateHandler = function(e) {

        csv_container.on('click', '#upload', function(e) {

            var files = document.getElementById('file-select').files;
            token = getCookie('auth_token');
            var csv = {}

            console.log('token: ' + token);
            console.log('files len: ' + files.length);

            if (files.length <= 0) {
                alert('please select a csv file');
                return;
            }

            csv.file = files[0];

            console.log('file: ' + csv.file);
            console.log('file name: ' + csv.file.name);

            console.log($('#file_select')[0]);
            var test_file = $('#file_select')[0];

            var formData = new FormData();
            formData.append('file', csv.file);

            var onSuccess = function(data) {
                alert('csv successfully uploaded!');
                console.log(data);
                location.href = 'create-game.html';
            }

            var onFailure = function(data) {
                console.log('failed to upload csv');
                consoleError(data);
            }

            url = '/api/question_sets/import'
            uploadCSVrequest(url, formData, token, onSuccess, onFailure);
            
        });

        csv_container.on('click', '#cancel_upload', function(e) {
            location.href = 'create-game.html';
        });

    };

    /**
     * Start the app and attach event handlers.
     * @return {None}
     */
    var start = function() {
        csv_container = $("#input-csv");

        attachCreateHandler();

    };

    // PUBLIC METHODS
    // any private methods returned in the hash are accessible via CreateGame.key_name, e.g. CreateGame.start()
    return {
        start: start
    };

})();
