const { google } = require('googleapis');

const { OAuth2 } = google.auth;
const oauthClient = new OAuth2();
async function getGoogleProfile(accessToken) {
  oauthClient.setCredentials({ access_token: accessToken });

  const oauth2 = google.oauth2({
    auth: oauthClient,
    version: 'v2',
  });
  const { data } = await oauth2.userinfo.get();
  return data;
}

module.exports = getGoogleProfile;
