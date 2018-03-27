//import { twitter } from './keys.js';

require('dotenv').config();
var twitterKeys = require('./keys.js')
var Twitter = require('twitter');
var moment = require('moment')

switch (process.argv[2]) {
  case 'my-tweets':
    //working except date =================================================
    var client = new Twitter({
      consumer_key: twitterKeys.twitter.consumer_key,
      consumer_secret: twitterKeys.twitter.consumer_secret,
      access_token_key: twitterKeys.twitter.access_token_key,
      access_token_secret: twitterKeys.twitter.access_token_secret
    });

    var params = { screen_name: 'gamaSampleTweet' };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
      if (!error) {
        console.log("Recent tweet(s) from " + params.screen_name)
        for (var i = 0; i < tweets.length; i++) {
          console.log("Tweet #" + (i + 1) + ") " + tweets[i].text + "--- created " + moment(tweets.created_at).format('MMM Do YYYY'))
        }
      }
      else { console.log("error") }
    });
    break
  //==============================================================

  case 'spotify-this-song':
    var spotifyKeys = require('./keys.js')
    var Spotify = require('node-spotify-api');

    var spotify = new Spotify({
      id: spotifyKeys.spotify.id,
      secret: spotifyKeys.spotify.secret
    });

    var q = process.argv[3]
    // var q = 'Ace of Base The Sign'
    spotify.search({ type: 'track', query: q, limit: 12 }, function (err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }
      // console.log("There are " + data.tracks.items.length + " result(s) for " + q)
      // for (var i = 0; i < data.tracks.items.length; i++) {

      //for multiple artists
      for (var x = 0; x < data.tracks.items[0].artists.length; x++) {
        console.log("Artist(s): " + data.tracks.items[0].artists[x].name)
      }

      console.log("Song: " + data.tracks.items[0].name)
      console.log("Album: " + data.tracks.items[0].album.name)
      console.log("Preview URL: " + data.tracks.items[0].preview_url)
      console.log(" ")
    });
    break
  //==============================================================

  case 'movie-this':
  var movieTitle = process.argv[3]
    var OMDB_API_KEY = "3fe4a8d6"
    var request = require('request');
    request("http://www.omdbapi.com/?t=\'"+movieTitle + "\'&apikey=" + OMDB_API_KEY, function (error, response, body) {
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
    break


  default:
    console.log("Please choose \'my-tweets\', \'spotify-this-song <song name here>\', \'movie-this <movie name here>\'")
}

