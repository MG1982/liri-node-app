//spotify client ID and Secret protection (stored locally and never pushed to GitHub)
require("dotenv").config();
let keys = require("./keys.js");
let spotify = new Spotify(keys.spotify);

// setup the switches for different commands

//first declare inputs
let userInput = process.argv[2];
let userQuery = process.argv.slice(3).join(" ");

//then switches
function userCommand(userInput, userQuery) {
  switch (userInput) {
    case "concert-this":
      concertThis();
      break;
    case "spotify-this-song":
      spotifyThisSong();
      break;
    case "movie-this":
      movieThis();
      break;
    case "do-what-it-says":
      doWhatItSays(userQuery);
      break;
    default:
      console.log("Sorry that's not a command I understand");
      break;
  }
}
userCommand(userInput, userQuery);
