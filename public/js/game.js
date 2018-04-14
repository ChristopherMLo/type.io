/* game.js
 * client side game logic should be here
 *
 */

// Dont modify any _room variables, do that in the game.js file for the server
var socket;
var username;
var usernameIndex;
var colors = ['red', 'cyan', 'green', 'orange'];

$(document).ready(init);
function init()
{
    socket = io();

    // Update words whenever progress is made
    socket.on('word update', function(_room)
    {
        document.getElementById('typed').innerHTML = _room.word.slice(0, _room.index);
    });

    // Whenever a player enters the room
    socket.on('player entered', function(_players)
    {
        let str = _players;
        str = str.toString();
        $('#players').html(str);
    });

    // Whenver a player exits the room
    socket.on('player exited', function(_players)
    {
        let str = _players;
        str = str.toString();
        $('#players').html(str);
    });

    // Setup for a player when they are created(ONLY for the player who just entered)
    socket.on('player setup', function(_username)
    {
        username = _username;
        $('#player').html("You are player " + username);
    });

    // When server tells clients the game is starting. Unhide game div and other Setup
    // TODO: countdown timer
    socket.on('start game', function(_room)
    {
        usernameIndex = _room.users.indexOf(username);
        $('#player1').html(_room.users[0]);
        $('#player2').html(_room.users[1]);
        $('#player3').html(_room.users[2]);
        $('#player4').html(_room.users[3]);
        $('#player1').css('background-color', colors[0]);
        $('#player2').css('background-color', colors[1]);
        $('#player3').css('background-color', colors[2]);
        $('#player4').css('background-color', colors[3]);
        $('#message').html("<br>");
        $('#typed').html("<br>");
        resetWord();
        setupWord(_room.word, _room.split);
        $('#preGameWindow').hide();
        $('#gameWindow').show();
    });

    // when incorrect player tries to type a keys
    socket.on('wrong player', function()
    {
        document.getElementById("message").innerHTML = "Not Your Turn!";
        document.getElementById("input").disabled = true;
        setTimeout(disableTyping, 3000);
    });

    // when wrong key is typed by correct user
    socket.on('wrong key', function()
    {
        document.getElementById("message").innerHTML = "Incorrect Key!";
        document.getElementById("input").disabled = true;
        setTimeout(disableTyping, 3000);
    });

    // Enter the room as the last thing
    socket.emit("enter room", $('#roomNumber').html());

}


// Disable typing for punishment
function disableTyping()
{
    document.getElementById("input").disabled = false;
    document.getElementById("message").innerHTML = "";

}

// Setup the UI with the word in different colors
function setupWord(word, split)
{
    for (i = 0; i < word.length; i++)
    {
        $('#goal').append("<li>" + word[i] + "</li>");
        $('#goal li:nth-child(' + (i+1) + ')').css('color', colors[split[i]]);
    }
}

// Reset the word
function resetWord()
{
    $('#goal').empty();
}

// On Key Up in html we emit the key typed.
function keyTyped(event)
{
    // Check if key is actually a key(ex. SHIFT or CAPS LOCK or ENTER)
    let keycode = event.keyCode;
    if( (keycode > 47 && keycode < 58)   || // number keys
        keycode == 32                    || // spacebar
        (keycode > 64 && keycode < 91)   || // letter keys
        (keycode > 95 && keycode < 112)  || // numpad keys
        (keycode > 185 && keycode < 193) || // ;=,-./`
        (keycode > 218 && keycode < 223))   // [\]'
    {
        socket.emit("key typed", event.key, usernameIndex);
    }
}

function startGame()
{
    socket.emit("start game");
}
