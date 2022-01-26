"use strict";

const passwordValidator = require('password-validator');
const schema = new passwordValidator();

//wymagana zlozonosc hasla
schema
.is().min(8)
.is().max(50)
.has().uppercase()
.has().lowercase()
.has().digits(2)
.has().not().spaces();


module.exports = function(passwd){
    const res = schema.validate(passwd, { details: true }).map(e => e.message);
    return {isValid: res.length == 0 ? true : false, errors: res};
}