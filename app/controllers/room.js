var MAX_NAME_LENGTH = 22;
var moment = require('moment');
var songObject = require('./songObject.js');

/*var songObject = require('./songObject.js');
 * Keeps track of players, including names, points, etc.
 *
 * @return {Object} players object
 */
function Rooms() {
    if ( !(this instanceof Rooms) ) {
        return new Rooms();
    }
    this.init();
}


Rooms.prototype.init = function(){
  this.roomCount = 0;
  this.room = {};
  this.winningSocket = null;
}


Rooms.prototype.addRoom = function(room){
  var exampleSongObject = songObject;
  this.roomCount++;
  //console.log(exampleSongObject);
  this.room[room.roomID] = {
    users : {},
    userCount : 0,
    round : 0,
    songNum: 0,
    song1: "",
    song2: "",
    song3: "",
    song4: "",
    music: "",
    songAnswer:"",
   songList:exampleSongObject
  }
}

Rooms.prototype.addUserIntoRoom = function(user){
  this.room[user.roomID].userCount++;
  this.room[user.roomID].users[user.userID] = {
    userID: user.userID,
    userName: user.userName,
    emoji: user.emoji,
    roomID: user.roomID,
    score: 10,
    createdTime: moment().format("hh:mm:ss a"),
    lastActiveTime:moment().format("hh:mm:ss a"),
    lastWinTime: 0
  }
  return this.room[user.roomID].users[user.userID];
}

Rooms.prototype.removeUser = function(user){
  console.log(this.room[user.roomID].users[user.userID]);
  //console.log("this will remove the user " + this.room[user.roomID)
  //delete this.room[user.roomID];
  delete this.room[user.roomID].users[user.userID];
  this.room[user.roomID].userCount--;
  console.log("Number of users now in the room are: " + this.room[user.roomID].userCount);
  //console.log(user.userID + " was removed from Room");
}


Rooms.prototype.getRoomUserCount = function(roomID) {
    return this.room[roomID].userCount;
}

//*****below this i need help
Rooms.prototype.getUserName = function(userID) {
    return this.users[userID] ? this.users[userID].userName : '';
}



Rooms.prototype.getUserData = function(roomID) {
    var userData = {
        users: []
    };
    for (var userID in this.users){
      if(users[userid].roomID)
        userData.users.push({
            createdTime:    this.users[userID].createdTime,
            lastActiveTime: this.users[userID].lastActiveTime,
            lastWinTime:    this.users[userID].lastWinTime,
            points:         this.users[userID].score,
            name:           this.users[userID].userName,
            emoji:          this.users[userID].emoji
        });
    }
    userData.users.sort(function(a,b) {
        return b.score - a.score|| a.userName > b.userName;
    });
    return this.userData = userData;
}


module.exports = Rooms()
