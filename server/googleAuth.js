"use strict";

const google = require('googleapis').google
const axios = require('axios');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:2400/api/auth/google'
);

exports.getGoogleAuthURL = function getGoogleAuthURL() { 
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes,
  });
}

exports.getGoogleUser = async function getGoogleUser({ code }) {
  const { tokens } = await oauth2Client.getToken(code);

  const googleUser = await axios.get(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,
    {
      headers: {
        Authorization: `Bearer ${tokens.id_token}`,
      },
    },
      ).then(res => res.data).catch(error => {
        throw new Error(error.message);
      });
    return googleUser;
  }