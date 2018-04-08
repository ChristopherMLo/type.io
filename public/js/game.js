/* game.js
 * client side game logic should be here
 *
 */

// Dont modify any _room variables, do that in the game.js file for the server
var socket;
var username;
var usernameIndex;
var colors = ['red', 'blue', 'green', 'black'];

$(document).ready(init);
function init() {
    socket = io();

    // Update words whenever progress is made
    socket.on('word update', function(_room){
        $('#typed').html(_room.word.slice(0, _room.index));
    });

    // Whenever a player enters the room
    socket.on('player entered', function(_players){
        let str = _players;
        str = str.toString();
        $('#players').html(str);
    });

    // Whenver a player exits the room
    socket.on('player exited', function(_players){
        let str = _players;
        str = str.toString();
        $('#players').html(str);
    });

    // Setup for a player when they are created(ONLY for the player who just entered)
    socket.on('player setup', function(_username){
        username = _username;
        $('#player').html("You are player " + username);
    });

    // When server tells clients the game is starting. Unhide game div and other Setup
    // TODO: countdown timer
    socket.on('start game', function(_room){
        usernameIndex = _room.users.indexOf(username);
        $('#player1').html(_room.users[0]);
        $('#player2').html(_room.users[1]);
        $('#player3').html(_room.users[2]);
        $('#player4').html(_room.users[3]);
        $('#player1').css('color', colors[0]);
        $('#player2').css('color', colors[1]);
        $('#player3').css('color', colors[2]);
        $('#player4').css('color', colors[3]);
        resetWord();
        setupWord(_room.word, _room.split);
        $('#gameWindow').show();
    });

    // Enter the room as the last thing
    socket.emit("enter room", $('#roomNumber').html());

}

// Setup the UI with the word in different colors
function setupWord(word, split){
    for (i = 0; i < word.length; i++){
        $('#goal ul').append("<li>" + word[i] + "</li>");
        $('#goal ul li:nth-child(' + (i+1) + ')').css('color', colors[split[i]]);
    }
}

function resetWord(){
    $('#goal ul').empty();
}

// On Key Up in html we emit the letter typed.
function letterTyped(event){
    socket.emit("letter typed", event.key, usernameIndex);
}

function startGame(){
    socket.emit("start game");
}
