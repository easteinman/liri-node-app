require("dotenv").config();

var fs = require("fs"); //reads and writes files
var request = require("request");
var keys = require('./keys'); // requires the client IDs, tokens, etc for Spotify and Twitter
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var liriRequest = process.argv[2]; // A variable for what function/request to call

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// Liri Commands
switch(liriRequest) {
    case "my-tweets": myTweets(); break;
    case "spotify-this-song": spotifyThisSong(); break;
    case "movie-this": movieThis(); break;
    case "do-what-it-says": doWhatItSays(); break;

    // Instructions will be shown if the app is run without a command
    default: console.log("Use one of the following commands after 'node liri.js':");
    console.log("1. 'my-tweets' to view my last 20 Tweets");
    console.log("2. spotify-this-song 'any song name'");
    console.log("3. movie-this 'any movie name'");
    console.log("If the movie or song is more than one word put it in quotation marks for better results.");
}    

// Twitter Function ===================================================================================

function myTweets() {
    var params = {screen_name: 'kyliejenner'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                console.log(tweets[i].text);
                console.log(tweets[i].created_at);
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
    
    var songTitle = process.argv[3];

        if (songTitle == null) {
            songTitle = 'The Sign';
        }
        
        console.log(songTitle);
    
    spotify.search({ 
        type: 'track', query: songTitle, limit: 1 }, function(err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            
            else {
            console.log("This song's artist is " + data.tracks.items[0].artists[0].name + "."); 
            console.log("The song's title is '" + data.tracks.items[0].name + "'."); 
            console.log("Check out a preview of this song here: " + data.tracks.items[0].preview_url + "."); 
            console.log("This song can be found on the album '" + data.tracks.items[0].album.name + "'.");
            }

        })
};

// OMDB Function ===================================================================================

function movieThis(){


    
    // Grab or assemble the movie name and store it in a variable called "movieName"
    var movieTitle = process.argv[3];

    if (movieTitle == null) {
        console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
        console.log("It's on Netflix!");
    }

    else {
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
                console.log("This movie stars the following actors: " + omdbObject.Actors + ".");

            }
        })

    }
};

// Do What It Says Function ===================================================================================

function doWhatItSays(){

    fs.readFile("random.txt", 'utf8', function(err, data) {

        if (err) {
        return console.log(err);
        }
    
        var splitData = data.split(",");

        console.log(splitData[0]);
        console.log(splitData[1]);

        spotifyThisSong(splitData[1]);

    
    })
};