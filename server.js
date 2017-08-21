// -----------------   Dependencies   -----------------
var express = require('express');
var app = express();
var passport = require('passport');
var session = require('express-session');
 var FileStore = require('session-file-store')(session);
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
app.use(session({
  name: 'server-session-cookie-id',
  secret: 'powder blue',
  resave: true,
  saveUninitialized: true,
  store: new FileStore()
}));
app.use(function printSession(req, res, next) {
  console.log('req.session', req.session);
  return next();
});

app.use(passport.initialize());
app.use(passport.session());  // Persistent login session



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
/*app.listen(3000, function(err) {
  if(!err) {
    console.log('Site is live on port 3000');
  }else {
    console.log(err);
  }
});*/
http.listen(PORT, function() {
    console.log('listening on *:3000');
});


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
    console.log("what up");
/******************************************************************/
//var j=0;

for(var i = 0; i<10;i++){

      socket.room = "room"+i;
      socket.join(socket.room);
      //console.log("length of room" +nsp.adapter.rooms[socket.room].length);
      if(nsp.adapter.rooms[socket.room].length<3){
        console.log("room: " +socket.room + ", users in room: " + nsp.adapter.rooms[socket.room].length);

       if(!rooms.room[socket.room]){
          var songList = songObject.shuffle(songObject.allSongs);
          console.log("WHERE IS THIS: " +songList);
          var q = rooms.addRoom({
            roomID:socket.room,
           // songObjectList:songList
          });
        }
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
      /*if(rooms.room[socket.room].userCount == 2){
        emitNewQuestion(socket.room);
      }*/
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


function emitNewQuestion(data) {
  //console.log(rooms.room[data]);
  console.log(rooms.room[data].songlist);
  var roomQuestions = songObject.stageSongs(rooms.room[data].songlist, 4);
  console.log("THIS IS STUFF BELOW IT");
  console.log("name of song" + songObject.arrayStaging[1].title);
  console.log("data from song 1 " + rooms.room[data].song1);
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
  var music = songObject.correctSongLink;
  rooms.room[data].music = music;

  // rooms.room[data].song1 = songOjbect.arrayStaging[0].title.tostring();
  // rooms.room[data].song2 = songOjbect.arrayStaging[1].title.tostring();
  // rooms.room[data].song3 = songOjbect.arrayStaging[2].title.tostring();
  // rooms.room[data].song4 = songOjbect.arrayStaging[3].title.tostring();
  console.log("OMG DOES THIS WORK?");
  console.log(rooms.room[data]);
  nsp.to(socket.room).emit("question", rooms.room[data]);
  //roooms.room[data].song1=
  //console.log(stuffToEdit.newList);
  // //console.log("IS THIS UNDEFINED? " + rooms.room[data].songlist);
  // rooms.room[data].songlist = stuffToEdit.newList;
  // console.log(rooms.room[data].songlist);
  //songObject.stageSongs(rooms.room[data].songlist, 4);
}


});


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
