/* Inpired by Jee Dribbble Shot ( http://dribbble.com/shots/770815-Login ) */
/* coded by alireza attari ( @alireza_attari ) */

var GameAThon = (function () {

    // PRIVATE VARIABLES
    var loginContainer; // holds login objects, value set in the "start" method below

    // PRIVATE METHODS

    var attachCreateHandler = function (e) {

        // hide the login screen initially
        loginContainer.find("#login_screen").hide();

        // hide the trainer login screen initially
        loginContainer.find("#trainer_login_screen").hide();

        // hide the register screen initially
        loginContainer.find("#register_screen").hide();

        // hide the register trainer screen initially
        loginContainer.find('#register_trainer_screen').hide();

        // hide the forgot screen initially
        loginContainer.find('#forgot_screen').hide();

        // hide the trainer forgot screen initially
        loginContainer.find("#trainer_forgot_screen").hide();

        // hide the login title
        loginContainer.find('#login_title').hide();


        // forgot password 
        loginContainer.on('click', '#user_forgot', function (e) {
            loginContainer.find('#login_title').html('');
            loginContainer.find('#login_title').append('Reset Password');
            loginContainer.find('#login_title').show();
            loginContainer.find('#login_screen').hide();
            loginContainer.find('#forgot_screen').show();
        });

        // forgot password back button
        loginContainer.on('click', '#forgot_back', function (e) {
            loginContainer.find('#login_title').html('');
            loginContainer.find('#login_title').append('Login');
            loginContainer.find('#login_title').show();
            loginContainer.find('#forgot_screen').hide();
            loginContainer.find('#login_screen').show();
        });

        // forgot trainer password 
        loginContainer.on('click', '#trainer_forgot', function (e) {
            loginContainer.find('#login_title').html('');
            loginContainer.find('#login_title').append('Reset Trainer Password');
            loginContainer.find('#login_title').show();
            loginContainer.find('#trainer_login_screen').hide();
            loginContainer.find('#trainer_forgot_screen').show();
        });

        // forgot trainer password back button
        loginContainer.on('click', '#trainer_forgot_back', function (e) {
            loginContainer.find('#login_title').html('');
            loginContainer.find('#login_title').append('Trainer Login');
            loginContainer.find('#login_title').show();
            loginContainer.find('#trainer_forgot_screen').hide();
            loginContainer.find('#trainer_login_screen').show();
        });


        // student login
        loginContainer.on('click', '#student_login', function (e) {
            loginContainer.find('#login_title').html('');
            loginContainer.find('#login_title').append('Login');
            loginContainer.find('#login_title').show();
            loginContainer.find("#select_screen").hide();
            loginContainer.find("#login_screen").show();
        });

        loginContainer.on('click', '#sign_in', function (e) {
            // do user sign in logic

            //if (getCookie("auth_token") != "") {
            //    alert("still signed in, auth_token: " + getCookie("auth_token"));
            //    return;
            //}

            var creds = {} // prepare credentials for passing into backend

            creds.email = loginContainer.find('#user_email').val();
            creds.password = loginContainer.find('#user_password').val();

            var onSuccess = function (data) {
                //alert('successfully logged in as user, auth token is: ' + data.auth_token);
                setCookie("auth_token", data.auth_token);
                setCookie("username", data.username);
                setCookie("trainer", "false"); // determines whether or not I am a trainer
                if (inDev) {
                    location.href = devUrl + 'dashboard.html';
                } else {
                    location.href = 'http://allenyu94.github.io/gatol-html/dashboard';
                }
            };
            var onFailure = function (data) {
                console.error('failure to login as user');
                consoleError(data);
                displayError('Login Failed! Please try again.', '#login_screen');
            };

            url = '/api/sessions'
            console.log(creds);
            makePostRequest(url, creds, onSuccess, onFailure);

        });

        loginContainer.on('click', '#trainer_sign_in', function (e) {
            // do trainer sign in logic

            //if (getCookie("auth_token") != "") {
            //    alert("still signed in, auth_token: " + getCookie("auth_token"));
            //    return;
            //}

            var creds = {} // prepare credentials for passing into backend

            creds.email = loginContainer.find('#trainer_email').val();
            creds.password = loginContainer.find('#trainer_password').val();

            var onSuccess = function (data) {
                //alert('successfully logged in as trainer, auth token is: ' + data.auth_token);
                setCookie("auth_token", data.auth_token);
                setCookie("username", data.username);
                setCookie("trainer", "true");
                if (inDev) {
                    location.href = devUrl + 'dashboard.html';
                } else {
                    location.href = 'http://allenyu94.github.io/gatol-html/dashboard';
                }
            };
            var onFailure = function (data) {
                consoleError(data);
                displayError('Login Failed! Please try again.', '#trainer_login_screen')
            };

            url = '/api/sessions'
            makePostRequest(url, creds, onSuccess, onFailure);
        });

        loginContainer.on('click', '#logout', function (e) {

        })


        // login back
        loginContainer.on('click', '#login_back', function (e) {
            loginContainer.find('#login_title').hide();
            loginContainer.find("#login_screen").hide();
            loginContainer.find("#select_screen").show();
            resetAllErrors();
        });

        // trainer login back
        loginContainer.on('click', '#trainer_login_back', function (e) {
            loginContainer.find('#login_title').hide();
            loginContainer.find("#trainer_login_screen").hide();
            loginContainer.find("#select_screen").show();
            resetAllErrors();
        });


        // trainer login
        loginContainer.on('click', '#trainer_login', function (e) {
            loginContainer.find('#login_title').html('');
            loginContainer.find('#login_title').append('Trainer Login');
            loginContainer.find('#login_title').show();
            loginContainer.find('#select_screen').hide();
            loginContainer.find("#trainer_login_screen").show();
            resetAllErrors();
        });

        // register 
        loginContainer.on('click', '#register', function (e) {
            loginContainer.find('#login_title').html('');
            loginContainer.find('#login_title').append('Register As Student');
            loginContainer.find('#login_title').show();
            loginContainer.find('#select_screen').hide();
            loginContainer.find('#register_screen').show();
            resetAllErrors();
        });

        // register back
        loginContainer.on('click', '#register_back', function (e) {
            loginContainer.find('#login_title').hide();
            loginContainer.find('#register_screen').hide();
            loginContainer.find('#select_screen').show();
            resetAllErrors();
        });

        // register trainer
        loginContainer.on('click', '#go_register_trainer', function (e) {
            loginContainer.find('#login_title').html('');
            loginContainer.find('#login_title').append('Register As Trainer');
            loginContainer.find('#login_title').show();
            loginContainer.find('#select_screen').hide();
            loginContainer.find('#register_trainer_screen').show();
            resetAllErrors();
        });

        // register trainer back
        loginContainer.on('click', '#register_trainer_back', function (e) {
            loginContainer.find('#login_title').hide();
            loginContainer.find('#register_trainer_screen').hide();
            loginContainer.find('#select_screen').show();
            resetAllErrors();
        });

        loginContainer.on('click', '#register_user', function (e) {
            var creds = {} // prepare credentials for passing into backend

            if (loginContainer.find('#register_password').val() != loginContainer.find('#register_confirm_password').val()) {
                alert('password does not match');
                return;
            }

            creds.email = loginContainer.find('#register_email').val();
            creds.username = loginContainer.find('#username').val();
            creds.password = loginContainer.find('#register_password').val();
            creds.confirm_password = loginContainer.find('#register_confirm_password').val();

            var onSuccess = function (data) {
                alert('successfully registered user');
            };
            var onFailure = function (data) {
                console.error(data.status);
                errors = JSON.parse(data.responseText).errors;
                alertMsg = "";
                if (errors.email != null) {
                    alertMsg += "email " + errors.email + "\n";
                }

                if (errors.password != null) {
                    alertMsg += "password " + errors.password;
                }

                alert(alertMsg);
                displayError('Register Failed! Please try again.', '#register_screen');
            };

            url = '/api/students';
            makePostRequest(url, creds, onSuccess, onFailure);

        });

        loginContainer.on('click', '#register_trainer', function (e) {
            var creds = {} // prepare credentials for passing into backend

            if (loginContainer.find('#register_trainer_password').val() != loginContainer.find('#register_trainer_confirm_password').val()) {
                alert('password does not match');
                return;
            }

            creds.email = loginContainer.find('#register_trainer_email').val();
            creds.username = loginContainer.find('#trainer_username').val();
            creds.password = loginContainer.find('#register_trainer_password').val();
            creds.confirm_password = loginContainer.find('#register_trainer_confirm_password').val();

            var onSuccess = function (data) {
                alert('successfully registered trainer');
            };
            var onFailure = function (data) {
                console.error(data.status);
                errors = JSON.parse(data.responseText).errors;
                alertMsg = "";
                if (errors.email != null) {
                    alertMsg += "email " + errors.email + "\n";
                }

                if (errors.password != null) {
                    alertMsg += "password " + errors.password;
                }

                alert(alertMsg);
                displayError('Register Failed! Please try again.', '#register_trainer_screen')
            };

            url = '/api/trainers';
            makePostRequest(url, creds, onSuccess, onFailure);

        });

    }

    /**
     * Start the app by and attach event handlers.
     * @return {None}
     */
    var start = function () {
        loginContainer = $("#login_container");

        attachCreateHandler();
    };

    // PUBLIC METHODS
    // any private methods returned in the hash are accessible via Smile.key_name, e.g. Smile.start()
    return {
        start: start
    };

})();

function displayError(message, parent) {
    var e = $(parent).find('.error')
    $(e).text(message);
    $(e).show();
}

function resetAllErrors() {
    $('.error').hide();
}
