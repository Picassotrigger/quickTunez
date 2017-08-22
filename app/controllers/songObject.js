// -------------------   DEPENDENCIES   -------------------
var allSongsFile = require('../data/allSongs.json');




// -------------------   VARIABLES, ARRAYS, and OBJECTS   -------------------
var songObject = {
  'allSongs': allSongsFile.songs,

  'arrayRandom': [],

  'arrayStaging': [],

  'correctSongNumber': 0,
  'correctSongTitle': '',
  'correctSongArtist': '',
  'correctSongLink': '',



  makeRandom: function(genre) {
    this.arrayRandom = this.shuffle(genre);
    console.log('songObject.arrayRandom begin count: ', this.arrayRandom.length);
  },


  shuffle: function(genre) {
    for (var i = genre.length - 1; i > 0; i--) {

        var j = Math.floor(Math.random() * (i + 1));
        var temp = genre[i];
        genre[i] = genre[j];
        genre[j] = temp;
    }
    return genre;
  },


  stageSongs: function(genre, num) {
    var arrToReturn = [];

    for(var i = 0; i < num; i++){
        arrToReturn.push(genre[i]);
    }

    this.arrayStaging = arrToReturn;
    console.log('songObject.arrayStaging: \n', this.arrayStaging);

    this.removeFromOriginalArr(genre, num);
    console.log('songObject.arrayRandom end count: ', this.arrayRandom.length);
    console.log('--------------------------------------------');

    this.pickSong(num);

    return arrToReturn;
  },


  removeFromOriginalArr: function(genre, num) {
    for(var i = 0; i < num; i++){
      genre.shift();
    }
  },


  pickSong: function(num) {
    var numToReturn = Math.floor((Math.random() * num ) + 1);

    this.correctSongNumber = numToReturn;
    console.log('songObject.correctSongNumber: ', this.correctSongNumber);

    this.correctSongTitle = this.arrayStaging[parseInt(this.correctSongNumber - 1)].title;
    console.log('songObject.correctSongTitle: ', this.correctSongTitle);

    this.correctSongArtist = this.arrayStaging[parseInt(this.correctSongNumber - 1)].artist;
    console.log('songObject.correctSongArtist: ', this.correctSongArtist);

    return numToReturn;
  },


  spotify: function() {
    var Spotify = require('node-spotify-api');

    var media = this.correctSongTitle + " " + this.correctSongArtist;

    var spotify = new Spotify({
      id: "69e888fc0a8549f596e66755ea883a64",
      secret: "dfbe980a6614428b9e0b35b5a1e2ec44"
    });

    spotify
      .search({
        type: 'track',
        query: media,
        limit: 1
      })
      .then(function(response) {
        this.correctSongLink = response.tracks.items[0].preview_url;
        console.log("songObject.correctSongLink: " + response.tracks.items[0].preview_url); // Preview link
      })
      .catch(function(err) {
        console.log(err);
      });
  },


  start: function(genre, num) {

    this.makeRandom(genre);

    this.stageSongs(this.arrayRandom, num);

    this.spotify();
  }

};


module.exports=songObject;

// -------------------   MAIN   -------------------
// To start the process:
// 1. the first argument is the genre you want.
//    It must be preceeded by 'songObject.'
//    Your options are 'country', 'hipHop', 'indie', 'pop', and 'rock'
//
// 2. the second argument is the number of song options for each game
//    if you want for songs to choose from, set the argument at '4'

// songObject.start(songObject.allSongs, 4);










// -------------------   END   -------------------
