// ----------------   Set variable for socket.io library   ----------------
var socket = io();


// ----------------   Client side chat functionality   ----------------
socket.on('connect', function() {
  var chatForm = document.forms.chatForm;

  // ----------------   Test for chatForm in page   ----------------
  if(chatForm) {
    // ----------------   Grabbing content   ----------------
    var chatUser = document.querySelector('#chat-user');
    var chatMessage = document.querySelector('#chat-message');

    // ----------------   Listening for submit   ----------------
    chatForm.addEventListener('submit', function(event) {
      event.preventDefault();

      // ----------------   Broadcasting message to all users   ----------------
      socket.emit('postMessage', {
        username: chatUser.value,
        message: chatMessage.value
      });

      // ----------------   Clearing chat form   ----------------
      chatMessage.value = '';
      chatMessage.focus();
    });

    // ----------------   Receiving message and calling function to write messag to screen  ----------------
    socket.on('updateMessages', function(data) {
      showMessage(data);
    });
  }
});

// ----------------   Function to write messag to screen  ----------------
function showMessage(data) {
  var chatDisplay = document.querySelector('.chat-display');
  var newMessage = document.createElement('p');

  newMessage.className = 'chat-text';
  newMessage.innerHTML = '<strong>' + data.username + '</strong>' + "     " + data.message;

  chatDisplay.insertBefore(newMessage, chatDisplay.firstChild);
}
