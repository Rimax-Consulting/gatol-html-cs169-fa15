var InputCSV = (function() {

    // PRIVATE VARIABLES
    var csv_container; // holds link_input container, value set in the "start" method below

    // PRIVATE METHODS

    var attachCreateHandler = function(e) {

        csv_container.on('click', '#upload', function(e) {
            alert('upload!');
            //location.href = 'file:///Users/AllenYu/Desktop/cs169-dx/gatol_html_proj/create_game.html';
            location.href = 'http://allenyu94.github.io/gatol-html/create_game';
        });

        csv_container.on('click', '#cancel_upload', function(e) {
            //location.href = 'file:///Users/AllenYu/Desktop/cs169-dx/gatol_html_proj/create_game.html';
            location.href = 'http://allenyu94.github.io/gatol-html/create_game';
        });

    };

    /**
     * Start the app and attach event handlers.
     * @return {None}
     */
    var start = function() {
        csv_container = $("#csv_container");

        attachCreateHandler();

    };

    // PUBLIC METHODS
    // any private methods returned in the hash are accessible via CreateGame.key_name, e.g. CreateGame.start()
    return {
        start: start
    };

})();
