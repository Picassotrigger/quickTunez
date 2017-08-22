// -----------------   Dependencies   -----------------
//round incrementation: endgame page
//spotify link
//results page
//fix the end game/end game page
//plan presentation

var express = require('express');
var app = express();
var passport = require('passport');
var session = require('express-session');
//var FileStore = require('session-file-store')(session);
var bodyParser = require('body-parser');
var env = require('dotenv').load();
var exphbs = require('express-handlebars');
var mysql = require('mysql');
var Sequelize = require('sequelize');

var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');
var path = require('path');

var rooms = require('./app/controllers/room.js');
var songObject = require('./app/controllers/songObject.js');
//console.log(“songObject: “, songObject);
//results page


// -----------------   Include the song file   -----------------
var songData = require('./app/data/allSongs');



// ----------------   Setup song file at app/data/allSongs   ----------------
app.set('appData', songData);



// ----------------   Setup public folder   ----------------
app.use(express.static('app/public'));



// -----------------   Setup Handlbars   -----------------
app.set('views', './app/views');
app.engine('hbs', exphbs({
  extname: '.hbs',
  defaultLayout  : 'main',
  layoutsDir     : './app/views/layouts/',
  partialsDir    : './app/views/partials/'
  }));
app.set('view engine', '.hbs');



// -----------------   Setup BodyParser   -----------------
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));



// -----------------   Setup Morgan (logger middleware for Express)   -----------------
app.use(require('morgan')('dev'));



// -----------------   Setup Passport   -----------------
// app.use(session({
//   name: 'server-session-cookie-id',
//   secret: 'powder blue',
//   resave: true,
//   saveUninitialized: true,
//   store: new FileStore()
// }));
// app.use(function printSession(req, res, next) {
//   console.log('req.session', req.session);
//   return next();
// });
app.use(passport.initialize());
//app.use(passport.session());  // Persistent login session



// -----------------   Setup Models   -----------------
var models = require('./app/models');



// -----------------   Setup Routes   -----------------
var authRoute = require('./app/routes/auth.js')(app, passport);



// -----------------   Load Passport strategies   -----------------
require('./app/config/passport/passport.js')(passport, models.user);




// -----------------   Index route   -----------------
app.get('/', function(req, res) {
  res.render('index');
});



// ----------------   Setup port   ----------------
var PORT = process.env.PORT || 3000;



// -----------------   Express server listener   -----------------
// app.listen(3000, function(err) {
//   if(!err) {
//     console.log('Site is live on port 3000');
//   }else {
//     console.log(err);
//   }
// });
http.listen(PORT, function() {
    console.log('listening on *:3000');
});

var nextQuestionDelayMs = 5000; //5secs // how long are players 'warned' next question is coming
var timeToAnswerMs = 15000; // 15secs // how long players have to answer question
var timeToEnjoyAnswerMs = 5000; //5secs // how long players have to read answer

// -----------------   Initializing rooms   -----------------



// -----------------   Sync Database   -----------------
models.sequelize.sync().then(function() {
  console.log('Database looks good');
}).catch(function(err) {
  console.log('Something is wrong with the database');
});


/*var io = require('socket.io')(server);

var Session = require('express-session'),
    SessionStore = require('session-file-store')(Session);
    session = Session({
      store: new SessionStore({ path: './tmp/sessions' }),
      secret: 'pass',
      resave: true,
      saveUninitialized: true
    });

io.use(function(socket, next) {
  session(socket.handshake, {}, next);
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.emit('chat message', "UserID: " + socket.handshake.session.uid);
*/
rooms.init();

//=======================   Socket.io server   =======================
//io.attach(server);
var nsp = io.of('/my');
nsp.on('connection', function(socket) {
//**changed io.on(...) to io.sockets.on
//io.socket.on('connection', function(socket) {
  console.log('User Connected' + "......" + socket.id);

  socket.on("Player Clicked", function(data){
    socket.username = data.username;
    socket.emoji=data.emoji;
    console.log("data: " + data);
/******************************************************************/
//var j=0;

for(var i = 0; i<10;i++){

      socket.room = "room"+i;
      socket.join(socket.room);
      //console.log("length of room" +nsp.adapter.rooms[socket.room].length);
      if(nsp.adapter.rooms[socket.room].length<5){
        console.log("room: " +socket.room + ", users in room: " + nsp.adapter.rooms[socket.room].length);

        if(!rooms.room[socket.room]){
          //var something = songObject.start(songObject.allSongs,4);
          //console.log(something);
          //var songList = songObject.shuffle(songObject.allSongs);

          //console.log("WHERE IS THIS: " +songList);
          var q = rooms.addRoom({
            roomID:socket.room,
            //songObjectList:songList
          });
        }
          //console.log(rooms.room[socket.room].songList.allSongs);
          //console.log("testing: " +rooms.room[socket.room].songObjectList);

      // console.log(rooms.room[socket.room].songlist);
        var p = rooms.addUserIntoRoom({
          userID: socket.id,
          userName: data.username,
          emoji: data.emoji,
          roomID:socket.room
        });
      //   //console.log(room);
      // console.log(rooms.room[socket.room].users[socket.id]);
      // console.log(nsp.adapter.rooms);
      // console.log(rooms.room[socket.room].songlist);
      if(rooms.room[socket.room].userCount == 1){
        emitWaitPage(socket.room);
      }
      nsp.to(socket.room).emit("playersDetails", rooms.room[socket.room].users);

      break;
      }
      else{
        socket.leave(socket.room);
      }
    }

  });

  //**what to execute when switching rooms
  socket.on('switchRoom', function(newroom){
    socket.leave(socket.room);
    socket.join(newroom);
    socket.broadcast.to(socket.room).emit('')
  });

  // ----------------   Listens for messages that have been posted and resends them to all users  ----------------

  socket.on('postMessage', function(data) {
    nsp.emit('updateMessages', data);
  });

  socket.on("selectedChoice",function(data){
    console.log(typeof(data));
    console.log(data);
    console.log("Answer"+typeof(songObject.correctSongNumber));
    if(parseInt(data.choice)===songObject.correctSongNumber){
      var scoreToAdd = (data.time*6);
      rooms.room[socket.room].users[socket.id].score+=scoreToAdd;
      //rooms.winningSocket=socket;
      console.log("afjoawejf:" +data.time);

      console.log("Addedscore"+  rooms.room[socket.room].users[socket.id].score);
      }
      nsp.to(socket.room).emit("playersDetails",rooms.room[socket.room].users);

  });

  socket.on('disconnect', function() {
    console.log('User Disconnected' + socket.room);

if(rooms.room[socket.room]){

     rooms.removeUser(rooms.room[socket.room].users[socket.id]);
     if(rooms.room[socket.room].users){
      nsp.to(socket.room).emit("playersDetails", rooms.room[socket.room].users);
     }
    }
    console.log('SOCKET.IO player disconnect: for socket '+ socket.id);
});

function emitWaitPage(data){
  nsp.to(socket.room).emit("waiting", rooms.room[data]);

  setTimeout(function(){

      emitNewQuestion(data);
  }, nextQuestionDelayMs);
}

function emitNewQuestion(data) {
  //console.log(rooms.room[data]);
  //console.log(rooms.room[data].songlist);
  //console.log("check this" + rooms.room[data].songList);
  //console.log(rooms.room[data].songlist);
  var roomQuestions = songObject.stageSongs(songObject.allSongs, 4);
console.log("music"+songObject.correctSongTitle);
 spotify(songObject.correctSongTitle);
 //console.log("link"+songObject.correctSongLink);
  //console.log("Thisis what i am looking for " +music)
  //var roomQuestions = rooms.room[data].songList.stageSongs(rooms.room[data].songList, 4);
  // console.log("THIS IS STUFF BELOW IT");
  // console.log("name of song" + rooms.room[data].songList.arrayStaging[1].title);
  // console.log("data from song 1 " + rooms.room[data].song1);
  var songtext = songObject.arrayStaging[0].title;
  rooms.room[data].song1 = songtext;
  var songtext = songObject.arrayStaging[1].title;
  rooms.room[data].song2 = songtext;
  var songtext = songObject.arrayStaging[2].title;
  rooms.room[data].song3 = songtext;
  var songtext = songObject.arrayStaging[3].title;
  rooms.room[data].song4 = songtext;
  var correctSongNumber = songObject.correctSongNumber;
  rooms.room[data].songNum = correctSongNumber;
  var correctAnswer = songObject.correctSongTitle;
  rooms.room[data].songAnswer = correctAnswer;
  //var music = songObject.spotify(correctAnswer);
  //console.log("WHAT IS THIS HERE SPOTIFY " + music);
  //grooms.room[data].music = music;
console.log(songObject.correctSongLink);
rooms.room[data].music=songObject.correctSongLink ;

  // rooms.room[data].song1 = songOjbect.arrayStaging[0].title.tostring();
  // rooms.room[data].song2 = songOjbect.arrayStaging[1].title.tostring();
  // rooms.room[data].song3 = songOjbect.arrayStaging[2].title.tostring();
  // rooms.room[data].song4 = songOjbect.arrayStaging[3].title.tostring();
  console.log("OMG DOES THIS WORK?");
  console.log(rooms.room[data]);
  nsp.to(socket.room).emit("question", rooms.room[data]);

  setTimeout(function(){
    nsp.to(socket.room).emit("timer");
      emitAnswer(data);
  }, timeToAnswerMs);
}

  function emitAnswer(data){
    nsp.to(socket.room).emit("results", rooms.room[data]);
    //console.log("THIS WORKS");
    //console.log(rooms.room[data]);

    setTimeout(function(){
      nsp.to(socket.room).emit("timer");
      emitNewQuestion(data);
    }, timeToEnjoyAnswerMs);
  }
  //roooms.room[data].song1=
  //console.log(stuffToEdit.newList);
  // //console.log("IS THIS UNDEFINED? " + rooms.room[data].songlist);
  // rooms.room[data].songlist = stuffToEdit.newList;
  // console.log(rooms.room[data].songlist);
  //songObject.stageSongs(rooms.room[data].songlist, 4);






//
//
// function emitPlayerUpdate(socket) {
//     var userData = room.getUserData();
//       //roomObject
//
//         // emit to everyone (points update)
//          nsp.to(socket.room).emit('players', userData);
//
//
//     //return userData;
// }
 function spotify (song) {
  var Spotify = require('node-spotify-api');

   var media = song;
   //var media=song;

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
         songObject.correctSongLink = response.tracks.items[0].preview_url;
        //rooms.room[data].music=response.tracks.items[0].preview_url;
        //console.log("song"+song);



        console.log("songObject.correctSongLink: " + response.tracks.items[0].preview_url); // Preview link

      //return song;
      })
      .catch(function(err) {
        console.log(err);
      });
  }


  });
