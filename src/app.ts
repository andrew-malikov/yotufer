import { readFile, mkdirSync, writeFile } from "fs";
import { createInterface } from "readline";

import { google } from "googleapis";
import { OAuth2Client } from "googleapis-common";

import { CREDENTIALS, Credentials } from "../config/credentials";

const OAuth2 = google.auth.OAuth2;

const SCOPES = ["https://www.googleapis.com/auth/youtube.readonly"];
const TOKEN_DIR = process.cwd();
const TOKEN_PATH = `${TOKEN_DIR}/youtube-transfer.token.json`;

function authorize(
  credentials: Credentials,
  callback: (...params: any) => void
) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token.toString());
      callback(oauth2Client);
    }
  });
}

function getNewToken(
  oauth2Client: OAuth2Client,
  callback: (...params: any) => void
) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES
  });

  console.log("Authorize this app by visiting this url: ", authUrl);
  var rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question("Enter the code from that page here: ", function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err || !token) {
        console.log("Error while trying to retrieve access token", err);
        return;
      }

      oauth2Client.credentials = token;

      storeToken(token);
      callback(oauth2Client);
    });
  });
}

function storeToken(token: any) {
  try {
    mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != "EEXIST") {
      throw err;
    }
  }
  writeFile(TOKEN_PATH, JSON.stringify(token), err => {
    if (err) throw err;
    console.log("Token stored to " + TOKEN_PATH);
  });
}

function getChannel(auth: OAuth2Client) {
  var service = google.youtube("v3");

  service.playlists
    .list({
      auth: auth,
      part: "snippet,contentDetails",
      mine: true,
      maxResults: 50
    })
    .then(
      function(response) {
        console.log("Response", response);

        if (response.data && response.data.items) {
          response.data.items.forEach(item => {
            console.log(JSON.stringify(item), "\n");
          });
        }
      },
      function(err) {
        console.error("Execute error", err);
      }
    );

  // service.channels.list(
  //   {
  //     auth: auth,
  //     part: "snippet,contentDetails,statistics",
  //     forUsername: "markupcode"
  //   },
  //   function(err, response) {
  //     if (err || !response) {
  //       console.log("The API returned an error: " + err);
  //       return;
  //     }

  //     var channels = response.data.items;

  //     if (!channels || channels.length == 0) {
  //       return console.log("No channel found.");
  //     }

  //     const [title, viewCount] = [
  //       channels[0].snippet ? channels[0].snippet.title : "'-'",
  //       channels[0].statistics ? channels[0].statistics.viewCount : "'-'"
  //     ];

  //     console.log(
  //       "This channel's ID is %s. Its title is '%s', and " + "it has %s views.",
  //       channels[0].id,
  //       title,
  //       viewCount
  //     );
  //   }
  // );
}

export function run() {
  authorize(CREDENTIALS, getChannel);
}
