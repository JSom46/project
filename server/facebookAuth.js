"use strict";

const axios = require('axios');

exports.getFacebookUser = async function getFacebookUser(code) {
    const accessTokenUrl = 'https://graph.facebook.com/oauth/access_token?' +
        `client_id=${process.env.FB_CLIENT_ID}&` +
        `client_secret=${process.env.FB_CLIENT_SECRET}&` +
        `redirect_uri=${encodeURIComponent('http://localhost:2400/auth/facebook')}&` +
        `code=${encodeURIComponent(code)}`;
    
    const accessToken = await axios.get(accessTokenUrl).then(res => res.data['access_token']);
    const data = await axios.get(`https://graph.facebook.com/me?access_token=${encodeURIComponent(accessToken)}&fields=name,email`).then(res => res.data);
    return data;
}