"use strict";

const passwordValidator = require('password-validator');
const schema = new passwordValidator();

//wymagana zlozonosc hasla
schema
.is().min(8)            //min 8 znakow
.is().max(50)           //max 50 znakow
.has().uppercase()      //min 1 wielka litera
.has().lowercase()      //min 1 mala litera
.has().digits(2)        //min 2 cyfry
.has().not().spaces();  //brak bialych znakow


module.exports = function(passwd){
    const res = schema.validate(passwd, { details: true }).map(e => e.message);
    return {isValid: res.length == 0 ? true : false, errors: res};
}