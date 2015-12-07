/* Inpired by Jee Dribbble Shot ( http://dribbble.com/shots/770815-Login ) */
/* coded by alireza attari ( @alireza_attari ) */

var GameAThon = (function () {

    // PRIVATE VARIABLES
    var loginContainer; // holds login objects, value set in the "start" method below

    // PRIVATE METHODS

    var attachCreateHandler = function (e) {

        // hide the login screen initially
        $("#login_screen").hide();

        // hide the trainer login screen initially
        $("#trainer_login_screen").hide();

        // hide the register screen initially
        $("#register_screen").hide();

        // hide the register trainer screen initially
        $('#register_trainer_screen').hide();

        // hide the forgot screen initially
        $('#forgot_screen').hide();

        // hide the trainer forgot screen initially
        $("#trainer_forgot_screen").hide();

        // hide the login title
        $('#login_title').hide();


        // forgot password 
        loginContainer.on('click', '#user_forgot', function (e) {
            $('#login_title').html('');
            $('#login_title').append('Reset Password');
            $('#login_title').show();
            $('#login_screen').hide();
            $('#forgot_screen').show();
        });

        // forgot password back button
        loginContainer.on('click', '#forgot_back', function (e) {
            $('#login_title').html('');
            $('#login_title').append('Login');
            $('#login_title').show();
            $('#forgot_screen').hide();
            $('#login_screen').show();
        });

        // forgot trainer password 
        loginContainer.on('click', '#trainer_forgot', function (e) {
            $('#login_title').html('');
            $('#login_title').append('Reset Trainer Password');
            $('#login_title').show();
            $('#trainer_login_screen').hide();
            $('#trainer_forgot_screen').show();
        });

        // forgot trainer password back button
        loginContainer.on('click', '#trainer_forgot_back', function (e) {
            $('#login_title').html('');
            $('#login_title').append('Trainer Login');
            $('#login_title').show();
            $('#trainer_forgot_screen').hide();
            $('#trainer_login_screen').show();
        });


        // student login
        loginContainer.on('click', '#student_login', function (e) {
            $('#login_title').html('');
            $('#login_title').append('Login');
            $('#login_title').show();
            $("#select_screen").hide();
            $("#login_screen").show();
        });

        loginContainer.on('click', '#sign_in', function (e) {
            // do user sign in logic

            //if (getCookie("auth_token") != "") {
            //    alert("still signed in, auth_token: " + getCookie("auth_token"));
            //    return;
            //}

            var creds = {} // prepare credentials for passing into backend

            //creds.email = $('#user_email').val();
            //creds.password = $('#user_password').val();
            
            if (checkLoginValid(creds, false)) {
                e.preventDefault();
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
                    //console.error('failure to login as user');
                    consoleError(data);
                    msg = extractJSONFailMsg(data)
                    displayError('Login Failed! ' + msg +' Please try again.', '#login_screen');
                };

                url = '/api/sessions'
                // console.log(creds);
                makePostRequest(url, creds, onSuccess, onFailure);
            }

        });

        loginContainer.on('click', '#trainer_sign_in', function (e) {
            // do trainer sign in logic

            //if (getCookie("auth_token") != "") {
            //    alert("still signed in, auth_token: " + getCookie("auth_token"));
            //    return;
            //}

            var creds = {} // prepare credentials for passing into backend

            //creds.email = $('#trainer_email').val();
            //creds.password = $('#trainer_password').val();

            if (checkLoginValid(creds, true)) {
                e.preventDefault();
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
                    msg = extractJSONFailMsg(data)
                    displayError('Login Failed! ' + msg +' Please try again.', '#trainer_login_screen');
                };

                url = '/api/sessions'
                makePostRequest(url, creds, onSuccess, onFailure);
            }
        });

        loginContainer.on('click', '#logout', function (e) {

        })


        // login back
        loginContainer.on('click', '#login_back', function (e) {
            backToMain('#login_screen');
        });

        // trainer login back
        loginContainer.on('click', '#trainer_login_back', function (e) {
            backToMain('#trainer_login_screen');
        });


        // trainer login
        loginContainer.on('click', '#trainer_login', function (e) {
            $('#login_title').html('');
            $('#login_title').append('Trainer Login');
            $('#login_title').show();
            $('#select_screen').hide();
            $("#trainer_login_screen").show();
            resetAllErrors();
        });

        // register 
        loginContainer.on('click', '#register', function (e) {
            $('#login_title').html('');
            $('#login_title').append('Register As Student');
            $('#login_title').show();
            $('#select_screen').hide();
            $('#register_screen').show();
            resetAllErrors();
        });

        // register back
        loginContainer.on('click', '#register_back', function (e) {
            backToMain('#register_screen');
        });

        // register trainer
        loginContainer.on('click', '#go_register_trainer', function (e) {
            $('#login_title').html('');
            $('#login_title').append('Register As Trainer');
            $('#login_title').show();
            $('#select_screen').hide();
            $('#register_trainer_screen').show();
            resetAllErrors();
        });

        // register trainer back
        loginContainer.on('click', '#register_trainer_back', function (e) {
            backToMain('#register_trainer_screen');
        });

        loginContainer.on('click', '#register_user', function (e) {
            var creds = {} // prepare credentials for passing into backend

            if ($('#register_password').val() != $('#register_confirm_password').val()) {
                //  alert('password does not match');
                displayError('Passwords do not match! Please re-enter.', '#register_screen')
                return;
            }

            creds.email = $('#register_email').val();
            creds.username = $('#username').val();
            creds.password = $('#register_password').val();
            creds.confirm_password = $('#register_confirm_password').val();

            var onSuccess = function (data) {
                alert('Successfully registered user. You should receive a confirmation email from us soon.');
            };
            var onFailure = function (data) {
                console.error(data.status);
                errors = JSON.parse(data.responseText).errors;
                alertMsg = "";

                for (var i = 0; i < errors.length; i++) {
                    alertMsg += errors[i];
                    if (i != errors.length-1) {
                        alertMsg += " and ";
                    }
                };

                displayError('Register Failed: ' + alertMsg + '.', '#register_screen');
            };

            url = '/api/students';
            makePostRequest(url, creds, onSuccess, onFailure);

        });

        loginContainer.on('click', '#register_trainer', function (e) {
            var creds = {} // prepare credentials for passing into backend

            if ($('#register_trainer_password').val() != $('#register_trainer_confirm_password').val()) {
                //alert('password does not match');
                displayError('Passwords do not match! Please re-enter.', '#register_trainer_screen')
                return;
            }

            creds.email = $('#register_trainer_email').val();
            creds.username = $('#trainer_username').val();
            creds.password = $('#register_trainer_password').val();
            creds.confirm_password = $('#register_trainer_confirm_password').val();

            var onSuccess = function (data) {
                alert('Successfully registered trainer. You should receive a confirmation email from us soon.');
            };
            var onFailure = function (data) {
                console.error(data.status);
                errors = JSON.parse(data.responseText).errors;
                alertMsg = "";

                for (var i = 0; i < errors.length; i++) {
                    alertMsg += errors[i];
                    if (i != errors.length-1) {
                        alertMsg += " and ";
                    }
                };

                displayError('Register Failed: ' + alertMsg + '.', '#register_trainer_screen');
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


function showLoginFailMsg(errors) {
}

function showRegisterFailMsg(errors) {
    
}

function backToMain(currentScreen) {
    $('#login_title').hide();
    $(currentScreen).hide();
    $('#select_screen').show();
    resetAllErrors();
}

function checkLoginValid(creds, is_trainer) {
    user = 'user'
    if (is_trainer) {
        // user = 'trainer'
        creds.is_trainer = '1';
    } else {
        creds.is_trainer = '0';
    }
    email = $('#' + user + '_email');
    password = $('#' + user + '_password');
    valid  = email[0].checkValidity() && password[0].checkValidity()
    if (valid) {
        creds.email = email.val();
        creds.password = password.val();
    }

    return valid
}

function checkRegisterFields() {
    
}
