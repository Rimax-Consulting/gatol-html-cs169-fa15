var CreateGame = (function() {

    // PRIVATE VARIABLES
    var create_container; // holds create game container, value set in the "start" method below

    // PRIVATE METHODS

    var attachCreateHandler = function(e) {

        create_container.on('click', '#add_csv_btn', function(e) {
            //location.href = 'file:///Users/AllenYu/Desktop/cs169-dx/gatol_html_proj/input_csv.html';
            location.href = 'http://allenyu94.github.io/gatol-html/input_csv'; 
        });

        create_container.on('click', '#create_finish', function(e) {
            alert('Finish!');
            //location.href = 'file:///Users/AllenYu/Desktop/cs169-dx/gatol_html_proj/dashboard.html';
            location.href = 'http://allenyu94.github.io/gatol-html/dashboard';
        });

        create_container.on('click', '#create_cancel', function(e) {
            //location.href = 'file:///Users/AllenYu/Desktop/cs169-dx/gatol_html_proj/dashboard.html';
            location.href = 'http://allenyu94.github.io/gatol-html/dashboard';
        });

    };

    /**
     * Start the app and attach event handlers.
     * @return {None}
     */
    var start = function() {
        create_container = $("#create_game_container");

        attachCreateHandler();

    };

    // PUBLIC METHODS
    // any private methods returned in the hash are accessible via CreateGame.key_name, e.g. CreateGame.start()
    return {
        start: start
    };

})();
