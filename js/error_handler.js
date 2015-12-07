function extractJSONFailMsg(data) {
    errors = JSON.parse(data.responseText).errors;
    msg = ""
    if (errors != null) {
        msg += errors[0] + '. '
    }
    return msg
}