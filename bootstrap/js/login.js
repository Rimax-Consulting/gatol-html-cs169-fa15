$('#login-cancel').on('click', function(e) {
    location.href= 'index.html';
});

$('#create-account').on('click', function(e) {
    $('#login-buttons').hide();   
    $('#register-buttons').show();
});

$('#register-cancel').on('click', function(e) {
    $('#register-buttons').hide();
    $('#login-buttons').show();   
})

$('#login-student').on('click', function(e) {
    $('#initial-screen').hide(); 
    $('#login-screen').show();
    resetAllErrors();
});

$('#login-student-back').on('click', function(e) {
    $('#login-screen').hide();
    $('#initial-screen').show(); 
});


$('#login-trainer').on('click', function(e) {
    $('#initial-screen').hide(); 
    $('#trainer-login-screen').show();
    resetAllErrors();
});

$('#login-trainer-back').on('click', function(e) {
    $('#trainer-login-screen').hide();
    $('#initial-screen').show(); 
});

$('#register-student').on('click', function(e) {
    $('#initial-screen').hide(); 
    $('#register-screen').show();
    resetAllErrors();
});

$('#register-student-back').on('click', function(e) {
    $('#register-screen').hide();
    $('#initial-screen').show(); 
});

$('#register-trainer').on('click', function(e) {
    $('#initial-screen').hide(); 
    $('#trainer-register-screen').show();
    resetAllErrors();
});

$('#register-trainer-back').on('click', function(e) {
    $('#trainer-register-screen').hide();
    $('#initial-screen').show(); 
});

$('#forgot-student').on('click', function(e) {
    $('#login-screen').hide();  
    $('#forgot-student-screen').show();  
});

$('#forgot-student-back').on('click', function(e) {
    $('#forgot-student-screen').hide();  
    $('#initial-screen').show();  
});

$('#forgot-trainer').on('click', function(e) {
    $('#trainer-login-screen').hide();  
    $('#forgot-trainer-screen').show();  
});

$('#forgot-trainer-back').on('click', function(e) {
    $('#forgot-trainer-screen').hide();  
    $('#initial-screen').show();  
});

$('#student-signin').on('click', function(e) {
    var creds = {} // prepare credentials for passing into backend

    if (checkLoginValid(creds, false)) {
        e.preventDefault();

        var onSuccess = function (data) {
            //alert('successfully logged in as user, auth token is: ' + data.auth_token);
            setCookie("auth_token", data.auth_token);
            setCookie("username", data.username);
            setCookie("trainer", "false"); // determines whether or not I am a trainer
            location.href = 'dashboard.html';
        };

        var onFailure = function (data) {
            //console.error('failure to login as user');
            consoleError(data);
            msg = extractJSONFailMsg(data)
            if (data.status == 422) {
                displayError('Login Failed! Please verify email.', '#trainer-login-screen');
            } else {
                displayError('Login Failed! Please try again.', '#trainer-login-screen');
            }
        };

        url = '/api/sessions'
        console.log(creds);
        makePostRequest(url, creds, onSuccess, onFailure);
    }

});

$('#trainer-signin').on('click', function(e) {
    var creds = {} // prepare credentials for passing into backend

    if (checkLoginValid(creds, true)) {
        e.preventDefault();
        var onSuccess = function (data) {
            //alert('successfully logged in as trainer, auth token is: ' + data.auth_token);
            setCookie("auth_token", data.auth_token);
            setCookie("username", data.username);
            setCookie("trainer", true);
            location.href = 'dashboard.html';
        };

        var onFailure = function (data) {
            consoleError(data);
            if (data.status == 422) {
                displayError('Login Failed! Please verify email.', '#trainer-login-screen');
            } else {
                displayError('Login Failed! Please try again.', '#trainer-login-screen');
            }
        };

        url = '/api/sessions'
        makePostRequest(url, creds, onSuccess, onFailure);
    }

});

$('#student-registration').on('click', function(e) {
    var creds = {} // prepare credentials for passing into backend

    if ($('#register-password').val() != $('#register-confirm-password').val()) {
        //  alert('password does not match');
        displayError('Passwords do not match! Please re-enter.', '#register-screen');
        return;
    }

    creds.email = $('#register-email').val();
    creds.username = $('#register-username').val();
    creds.password = $('#register-password').val();
    creds.confirm_password = $('#register-confirm-password').val();

    var onSuccess = function (data) {
        alert('successfully registered user');
        $('#register-screen').hide();
        $('#register-buttons').hide();
        $('#login-buttons').show();
        $('#initial-screen').show();
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
        displayError('Register Failed! Please try again.', '#register-screen');
    };

    url = '/api/students';
    makePostRequest(url, creds, onSuccess, onFailure); 
});

$('#trainer-registration').on('click', function(e) {
    var creds = {} // prepare credentials for passing into backend

    if ($('#register-trainer-password').val() != $('#register-trainer-confirm-password').val()) {
        //alert('password does not match');
        displayError('Passwords do not match! Please re-enter.', '#trainer-register-screen');
        return;
    }

    creds.email = $('#register-trainer-email').val();
    creds.username = $('#register-trainer-username').val();
    creds.password = $('#register-trainer-password').val();
    creds.confirm_password = $('#register-trainer-confirm-password').val();

    var onSuccess = function (data) {
        alert('successfully registered trainer');
        $('#trainer-register-screen').hide();
        $('#register-buttons').hide();
        $('#login-buttons').show();
        $('#initial-screen').show();
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
        displayError('Register Failed! Please try again.', '#trainer-register-screen')
    };

    url = '/api/trainers';
    makePostRequest(url, creds, onSuccess, onFailure); 
});

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

function extractJSONFailMsg(data) {
    errors = JSON.parse(data.responseText).errors;
    msg = ""
    if (errors != null) {
        msg += errors[0] + '. '
    }
    return msg

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
        user = 'trainer'
    }
    email = $('#' + user + '-email');
    password = $('#' + user + '-password');
    valid  = email[0].checkValidity() && password[0].checkValidity()
    if (valid) {
        creds.email = email.val();
        creds.password = password.val();
    }

    return valid   
}

function checkRegisterFields() {
    
}
