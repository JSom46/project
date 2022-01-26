"use strict";

module.exports = function(from, to, subject, text){
    return {
        from: from,
        to: to,
        subject: subject,
        text: text
    };   
};
