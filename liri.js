
var fs = require('fs')
require('dotenv').config();
var twitterKeys = require('./keys.js')
var Twitter = require('twitter');
var moment = require('moment')

//Function that handles twitter npm requests. 
//==================================================================================
function getTwitter() {
  var client = new Twitter({
    consumer_key: twitterKeys.twitter.consumer_key,
    consumer_secret: twitterKeys.twitter.consumer_secret,
    access_token_key: twitterKeys.twitter.access_token_key,
    access_token_secret: twitterKeys.twitter.access_token_secret
  });

  var params = { screen_name: 'gamaSampleTweet' };
  client.get('statuses/user_timeline', params, function (error, tweets, response) {
    if (!error) {
      var logFileString="\n"
      console.log("Recent tweet(s) from " + params.screen_name)
      logFileString = logFileString + "Recent tweet(s) from " + params.screen_name+"\n"

      for (var i = 0; i < tweets.length; i++) {
        console.log("Tweet #" + (i + 1) + ") " + tweets[i].text + "--- created " + moment(tweets[i].created_at).format('MMM Do YYYY'))
        logFileString = logFileString + "Tweet #" + (i + 1) + ") " + tweets[i].text + "--- created " + moment(tweets[i].created_at).format('MMM Do YYYY')+'\n'
      }
      fs.appendFile("log.txt", logFileString,function(e){
        if (e){console.log(e)}
      })
    }
    else { console.log("error") }
  });
}
//end getTwitter() ================================================================


//Function that handles Spotify npm requests. 
//==================================================================================
function getSpotify(q) {
  var spotifyKeys = require('./keys.js')
  var Spotify = require('node-spotify-api');

  var spotify = new Spotify({
    id: spotifyKeys.spotify.id,
    secret: spotifyKeys.spotify.secret
  });



  spotify.search({ type: 'track', query: q, limit: 12 }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }

    for (var x = 0; x < data.tracks.items[0].artists.length; x++) {
      console.log("Artist(s): " + data.tracks.items[0].artists[x].name)
    }

    console.log("Song: " + data.tracks.items[0].name)
    console.log("Album: " + data.tracks.items[0].album.name)
    console.log("Preview URL: " + data.tracks.items[0].preview_url)
    console.log(" ")
  });
}
//end getSpotify() ================================================================

//Function that handles OMDB api via REQUEST npm. 
//==================================================================================
function getOMDB(movie) {

  var OMDB_API_KEY = "3fe4a8d6"
  var request = require('request');
  request("http://www.omdbapi.com/?t=\'" + movie + "\'&apikey=" + OMDB_API_KEY, function (error, response, body) {
    if (error) { console.log('error:', error) }
    else { // Print the error if one occurred
      //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      console.log("Movie: " + JSON.parse(body).Title)
      console.log("Year: " + JSON.parse(body).Year)
      for (var i = 0; i < JSON.parse(body).Ratings.length; i++) {
        console.log("Rating: " + JSON.parse(body).Ratings[i].Value + " ----- " + JSON.parse(body).Ratings[i].Source)
      }
      console.log("Country produced: " + JSON.parse(body).Country)
      console.log("Language: " + JSON.parse(body).Language)
      console.log("Plot: " + JSON.parse(body).Plot)
      console.log("Actors: " + JSON.parse(body).Actors)

    }
  });
}
//end getOMDB() ================================================================







switch (process.argv[2]) {
  case 'my-tweets':
    getTwitter()
    break
  //==============================================================

  case 'spotify-this-song':
    var spotifyInput = process.argv[3]
    if (spotifyInput === undefined) {
      spotifyInput = "The Sign Ace of Base"
    }
    getSpotify(spotifyInput)
    break
  //==============================================================

  case 'movie-this':

    var movieTitle = process.argv[3]
    if (movieTitle === undefined) {
      movieTitle = "Mr. Nobody"
    }
    getOMDB(movieTitle)
    break
  //==============================================================================

  case 'do-what-it-says':
    var command = "Empty"
    var searchValue = ''
    var fs = require('fs')
    fs.readFile("random.txt", "utf8", function (e, data) {
      if (e) {
        console.log(e)
      }
      else {
        //console.log(data)
        command = data.substr(0, data.indexOf(" "))
        searchValue = data.substr(data.indexOf(" ") + 1, data.length)
      }

      switch (command) {
        case 'my-tweets':
          getTwitter()
          break

        case 'spotify-this-song':
          if (searchValue === undefined) {
            searchValue = "The Sign Ace of Base"
          }
          getSpotify(searchValue)
          break

        case 'movie-this':
          if (searchValue === undefined) {
            searchValue = "Mr. Nobody"
          }
          getOMDB(searchValue)
          break

        default:
          console.log("Random.txt is empty or invalid")
      }
    })


    break;
  //==============================================================================

  default:
    console.log("Please choose \'my-tweets\', \'spotify-this-song <song name here>\', \'movie-this <movie name here>\', \'do-what-it-says\'")
}



