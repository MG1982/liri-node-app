//dotenv Require for spotify client ID and Secret protection
require("dotenv").config();

//NPM Requires
const keys = require("./keys.js");
const Spotify = require("node-spotify-api");
const axios = require("axios");
const moment = require("moment");
const fs = require("fs");

//User Inputs
const userInput = process.argv[2];
const userQuery = process.argv.slice(3).join(" ");

//Messages
function message() {
  if (!userQuery) {
    console.log(
      "_____________________________________________________\n\nNo User Input - Searching Default...\n_____________________________________________________"
    );
  } else {
    console.log(
      "_____________________________________________________\n\nSearching for: " +
        userQuery +
        "...\n_____________________________________________________"
    );
  }
}
const commandError =
  "=================================\nError: Unknown User Input.\nliri.js can only take in one of the following commands;\n--> concert-this\n--> spotify-this-song\n--> movie-this\n--> do-what-it-says\n=================================";

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
      console.log(commandError);
      break;
  }
}
userCommand(userInput, userQuery);

function concertThis() {
  if (userQuery) message();
  let artistQuery =
    "https://rest.bandsintown.com/artists/" +
    userQuery +
    "/events?app_id=codingbootcamp";
  axios
    .get(artistQuery)
    .then(function(response) {
      for (let i = 0; i < response.data.length; i++) {
        let printFormat =
          "\nVenue: " +
          response.data[i].venue.name +
          "\n City: " +
          response.data[i].venue.city +
          "\n Date: " +
          moment(response.data[i].datetime).format("DD/MM/YYYY") +
          "\n Time: " +
          moment(response.data[i].datetime).format("HH:mm") +
          "\n_____________________________________________________";
        console.log(printFormat);
        logFile(printFormat);
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
  message();
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
          "\n     Artists: " +
          artists.join(", ") +
          "\n        Song: " +
          songInfo[i].name +
          "\n       Album: " +
          songInfo[i].album.name +
          "\nPreview Link: " +
          songInfo[i].preview_url +
          "\n_____________________________________________________";
        console.log(printFormat);
        logFile(printFormat);
      }
    }
  });
}
function movieThis(userQuery) {
  message();
  if (!userQuery) {
    userQuery = "mr nobody";
  }
  let movieQuery =
    "http://www.omdbapi.com/?t=" + userQuery + "&y=&plot=short&apikey=trilogy";
  axios
    .get(movieQuery)
    .then(function(response) {
      // console.log(response.data);
      movie = response.data;
      printFormat =
        "\nTitle: " +
        movie.Title +
        "\nYear: " +
        movie.Year +
        "\nRating: " +
        movie.Ratings[1].Value +
        "\nCountry Produced: " +
        movie.Country +
        "\nLanguage: " +
        movie.Language +
        "\nPlot: " +
        movie.Plot +
        "\nActors: " +
        movie.Actors +
        "\n_____________________________________________________";
      console.log(printFormat);
      logFile(printFormat);
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
function doWhatItSays() {
  fs.readFile("./random.txt", "utf8", function(error, data) {
    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    } else {
      // Then split it by commas (to make it more readable)
      let random = data.split(",");
      let userInput = random[0];
      let userQuery = random[1];

      userCommand(userInput, userQuery);
    }
  });
}

function logFile(printFormat) {
  fs.appendFile("log.txt", printFormat, function(err) {
    // If the code experiences any errors it will log the error to the console.
    if (err) {
      return console.log("Error: " + err);
    }
  });
}
