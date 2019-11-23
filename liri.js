//spotify client ID and Secret protection (stored locally and never pushed to GitHub)
require("dotenv").config();
//Requires
const keys = require("./keys.js");
const Spotify = require("node-spotify-api");
const axios = require("axios");
const moment = require("moment");
const fs = require("fs");

//User Inputs
const userInput = process.argv[2];
const userQuery = process.argv.slice(3).join(" ");

//Commands
function userCommand(userInput, userQuery) {
  switch (userInput) {
    case "concert-this":
      concertThis(userQuery);
      break;
    case "spotify-this-song":
      spotifyThisSong(userQuery);
      break;
    case "movie-this":
      movieThis(userQuery);
      break;
    case "do-what-it-says":
      doWhatItSays(userQuery);
      break;
    default:
      console.log(
        "=================================\nError: Unknown Command.\nliri.js can only take in one of the following commands;\nconcert-this\nspotify-this-song\nmovie-this\ndo-what-it-says\n================================="
      );
      break;
  }
}
userCommand(userInput, userQuery);

function concertThis() {
  console.log(
    "_____________________________________________________\n\nSearching for: " +
      userQuery +
      "...\n_____________________________________________________"
  );
  let artistQuery =
    "https://rest.bandsintown.com/artists/" +
    userQuery +
    "/events?app_id=codingbootcamp";
  axios
    .get(artistQuery)
    .then(function(response) {
      for (let i = 0; i < response.data.length; i++) {
        let printFormat =
          "_____________________________________________________\n\nVenue: " +
          response.data[i].venue.name +
          "\nCity: " +
          response.data[i].venue.city +
          "\nDate: " +
          moment(response.data[i].datetime).format("DD/MM/YYYY") +
          "\nTime: " +
          moment(response.data[i].datetime).format("HH:mm") +
          "\n_____________________________________________________";
        console.log(printFormat);
      }
    })
    .catch(function(error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("---------------Data---------------");
        console.log(error.response.data);
        console.log("---------------Status---------------");
        console.log(error.response.status);
        console.log("---------------Status---------------");
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an object that comes back with details pertaining to the error that occurred.
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
}

function spotifyThisSong(userQuery) {
  if (!userQuery) {
    userQuery = "the sign ace of base";
  }
  let spotify = new Spotify(keys.spotify);
  spotify.search({ type: "track", query: userQuery }, function(err, data) {
    let songInfo = data.tracks.items;
    if (err) {
      console.log("Error: " + err);
    } else {
      for (let i = 0; i < songInfo.length; i++) {
        let artistArray = songInfo[i].artists;
        let artists = [];
        for (let a = 0; a < artistArray.length; a++) {
          artists.push(artistArray[a].name);
        }
        printFormat =
          "\n_____________________________________________________" +
          "\n\nArtists: " +
          artists.join(", ") +
          "\nSong: " +
          songInfo[i].name +
          "\nAlbum: " +
          songInfo[i].album.name +
          "\nPreview Link: " +
          songInfo[i].preview_url +
          "\n_____________________________________________________";
        console.log(printFormat);
      }
    }
  });
}

// OMDB_ID=a833708e
