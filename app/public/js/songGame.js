//---------------------   CAPTURING USER CHOICES   ---------------------//
//var io = require('socket.io')(http);

var roomChosen = 0;
var catChosen = 0;
var songChosen = 0;
var sock = io.connect("/my");
var username;
var emoji;
var songChosen ;

function roomChoice() {
  roomChosen = $(this).attr("value");
  console.log("roomChosen: " + roomChosen);
}

function catChoice() {
  catChosen = $(this).attr("value");
  console.log("catChosen: " + catChosen);
}

function songChoice() {
  songChosen = $(this).attr("value");
  var newTime = time;
  //console.log("songChosen: " + songChosen);
  sock.emit("selectedChoice",{choice:songChosen, time:newTime});
}



// Choosing room
$("#room1").on('click', roomChoice);

$("#room2").on('click', roomChoice);


//Choosing category
$("#cat1").on('click', catChoice);

$("#cat2").on('click', catChoice);

$("#cat3").on('click', catChoice);

$("#cat4").on('click', catChoice);



//Choosing song
$("#song1").on('click', songChoice);

$("#song2").on('click', songChoice);

$("#song3").on('click', songChoice);

$("#song4").on('click', songChoice);




//---------------------   CLOCK OBJECT   ---------------------//
// TODO Need to add the restart logic to the count method.

var intervalId;
var clockRunning = false;
var time=0;
var stopwatch = {

//  time: 30,
  lap: 1,

  reset: function() {
    time = 0;
    $("#game-clock").html("00:00");
  },

  start: function() {
    if (!clockRunning) {
        intervalId = setInterval(stopwatch.count, 1000);
        clockRunning = true;
    }
  },

  stop: function() {
    clearInterval(intervalId);
    clockRunning = false;
  },

  count: function() {
    if(time > 0) {
       time--;
       if(time === 0) {
      clearInterval(intervalId);
      //updateTimeOut();
      sock.emit("timeUp");
    }
    }
    else {
    // TODO Need restart logic in here


        time = 15;
    }


    var converted = stopwatch.timeConverter(time);

    $("#game-clock").html(converted);
  },

  timeConverter: function(t) {
    var minutes = Math.floor(t / 60);
    var seconds = t - (minutes * 60);

    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    if (minutes === 0) {
      minutes = "00";
    }
    else if (minutes < 10) {
      minutes = "0" + minutes;
    }

    return minutes + ":" + seconds;
  }
};


////////////HIDE and SHOW\\\\\\\\\\\\\\\\
  //Navbar
$("#loginButton").on("click", function(){
  $("#index").hide(1000);
  $("#register").hide(1000);
  $("#chat").hide(1000);
  $("#category").hide(1000);
  $("#game").hide(1000);
  $("#room").hide(1000);
  $("#login").show(1500);
});

$("#registerButton").on("click", function(){
  $("#index").hide(1000);
  $("#login").hide(1000);
  $("#chat").hide(1000);
  $("#category").hide(1000);
  $("#game").hide(1000);
  $("#room").hide(1000);
  $("#register").show(1500);
});

$("#chatButton").on("click", function(){
  $("#index").hide(1000);
  $("#login").hide(1000);
  $("#register").hide(1000);
  $("#category").hide(1000);
  $("#game").hide(1000);
  $("#room").hide(1000);
  $("#chat").show(1500);
});



//login page
$("#loginSubmit").on("click",function(e){
e.preventDefault();
  username=$("#username").val().trim();
 emoji=$('input[name="emoji"]:checked').val();
   console.log("Login Username: " + username + "Login Emoji: " + emoji);
  $("#login").hide(1000);
  $("#room").show(1500);
});

sock.on("playersDetails",function(data){

  var html=" ";
  for(key in data){
  html+='<div class="col s2" style="text-align: center;">' +
        '<p style="text-align:center;">' + data[key].score + '</p>' +
        '<i style="text-align:center;" class="em '+ data[key].emoji + '"></i>'+
        '<p style="text-align:center;">'+ data[key].userName + '</p>' +
      '</div>';

}
$("#players").html(html);
});

sock.on("waiting", function(data){
  console.log("waiting...");
  //HIDE THE SOMETHING
});

sock.on("timer",function(){
  //console.log(typeof(data));
  time=15;
 $("#game-clock").html(converted);
});

sock.on("question",function(data){
  console.log("all song data" + data);
  stopwatch.start();

  $("#song1").text(data.song1);
  $("#song2").text(data.song2)
  $("#song3").text(data.song3)
  $("#song4").text(data.song4)

});
$("#play").on("click", function(){
  sock.emit("Player Clicked",{username:username,emoji:emoji});
  $("#room").hide(1000);
 $("#game").show(1500);
 //stopwatch.start();


});


sock.on("roomObject", function(data){
  console.log(data);

})
