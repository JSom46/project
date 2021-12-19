"use strict";

module.exports = (length) => {
    let result = "";
    for(let i = 0; i < length; i++){
        result += Math.round(Math.random() * 9);
    }
    return result;
};