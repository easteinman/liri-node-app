require("dotenv").config();

var fs = require("fs"); // Reads and writes files.
var request = require("request");
var keys = require('./keys'); // Requires the client IDs, tokens, etc for Spotify and Twitter
var Spotify = require('node-spotify-api'); // Requires the Spotify package
var Twitter = require('twitter'); // Requires Twitter package
var liriRequest = process.argv[2]; // A variable for what function to call in the switch statement

var spotify = new Spotify(keys.spotify); // Sets the client tokens/IDs/API keys
var client = new Twitter(keys.twitter); // Sets the client tokens/IDs/API keys

// Liri Commands
// Create a switch statement so the app knows which function to call based on the user input

function liriSwitch(){

    switch(liriRequest) {
        // if "my-tweets" is input by the user after liri.js the myTweets function will execute and so on for the cases below
        case "my-tweets": myTweets(); break;
        case "spotify-this-song": spotifyThisSong(); break;
        case "movie-this": movieThis(); break;
        case "do-what-it-says": doWhatItSays(); break;

        // Instructions will be shown if the app is run without a liriRequest
        default: console.log("Use one of the following commands after 'node liri.js':");
        console.log("1. 'my-tweets' to view my last 20 Tweets");
        console.log("2. spotify-this-song 'any song name'");
        console.log("3. movie-this 'any movie name'");
        console.log("If the movie or song is more than one word put it in quotation marks.");
    }
};

liriSwitch();

// Twitter Function ===================================================================================

function myTweets() {
    // Hardcode "my" Twitter username
    var params = {screen_name: 'kyliejenner'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
            // If there is no error, loop through the tweets (20) and console log the following
            for (var i = 0; i < tweets.length; i++) {
                // Logs the content of the tweet
                console.log(tweets[i].text);
                // Logs the created at/time stamp
                console.log(tweets[i].created_at);
                // Adds a break between tweets so they are easier to read
                console.log("===============================================================================");
            }
        }  else {
            console.log("Error :"+ error);
            return;
        }
    })
};

// Spotify Function ===================================================================================

function spotifyThisSong(){    
    // Song title is stored in this variable
    var songTitle = process.argv[3];
    // If no song title is provided it will use 'The Sign' as the default song.
    if (process.argv[3]) {
        songTitle = process.argv[3];
    }

    // If not, the default song title will be 'The Sign'
    else {
        songTitle = "The Sign";
    }
    
    console.log(songTitle);
    
    spotify.search({ 
        // Use the song title to search Spotify for 1 result
        type: 'track', query: songTitle, limit: 1 }, function(err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            
            else {
            // Displaying different information about the song to the user.
            console.log("This song's artist is " + data.tracks.items[0].artists[0].name + "."); 
            console.log("The song's title is '" + data.tracks.items[0].name + "'."); 
            console.log("Check out a preview of this song here: " + data.tracks.items[0].preview_url + "."); 
            console.log("This song can be found on the album '" + data.tracks.items[0].album.name + "'.");
            }

        })
};

// OMDB Function ===================================================================================

function movieThis(){

    // Grabs the movie name and stores it in a variable called "movieTitle"
    var movieTitle = process.argv[3];
    // If a movie title is entered it will be stored as movieTitle
    if (process.argv[3]) {
        movieTitle = process.argv[3];
    }
    // If not, the default movie title will be 'Mr. Nobody'
    else {
        movieTitle = "Mr. Nobody";
        console.log("If you haven't watched 'Mr. Nobody,' then you should. It's on Netflix!");
    }

    // Then run a request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=trilogy";


    // Then create a request to the queryUrl
    request(queryUrl, function(error, response, body) {

        // Storing the body in a variable to make the code cleaner when calling information.
        var omdbObject = JSON.parse(body);

        // If the request is successful
        if (!error && response.statusCode === 200) {

            // Parse the body of the site and recover the following information
            console.log("This movie was released in " + omdbObject.Year + ".");
            console.log("The IMDB rating is " + omdbObject.imdbRating + ".");
            console.log(omdbObject.Ratings[1].Value + " of critics on Rotten Tomatoes liked this movie.");
            console.log("This movie was produced in " + omdbObject.Country + ".");
            console.log("It can be enjoyed in " + omdbObject.Language + ".");
            console.log("Here's a quick summary of what this movie is about: " + omdbObject.Plot);
            console.log("This movie stars the following people: " + omdbObject.Actors + ".");

        }
    })    
};

// Do What It Says Function ===================================================================================

function doWhatItSays(){

    fs.readFile("random.txt", 'utf8', function(err, data) {

        if (err) {
            return console.log(err);
        }
    
        else {
            var splitData = data.split(",");

            liriRequest = splitData[0];
            process.argv[3] = splitData[1];
            
            liriSwitch();
        }

    })
};