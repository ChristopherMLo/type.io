/* game.js
 * client side game logic should be here
 *
 */

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
        $('#goal li:nth-child(' + (_room.index) + ')').css('text-decoration', 'none');
        $('#goal li:nth-child(' + (_room.index+1) + ')').css('text-decoration', 'underline');
    });

    // Whenever a player enters the room
    socket.on('player entered', function(_room)
    {
        setPlayerBoxes(_room);
    });

    // Whenver a player exits the room
    socket.on('player exited', function(_room)
    {
        setPlayerBoxes(_room);
    });

    // Setup for a player when they are created(ONLY for the player who just entered)
    socket.on('player setup', function(_username)
    {
        username = _username;
        $('#player').html(username);
    });

    // When server tells clients the game is starting. Unhide game div and other Setup
    socket.on('start game', function(_room)
    {

        usernameIndex = _room.users.indexOf(username);
        setPlayerBoxes(_room);
        $('#message').html("<br>");
        $('#typed').html("<br>");
        resetWord();
        setupWord(_room.word, _room.split);
        document.getElementById("input").disabled = false;
        $('#restartButton').hide();
        $('#preGameWindow').hide();
        $('#ggWindow').hide();
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

    socket.on('game over', function(_room)
    {
       document.getElementById("message").innerHTML = "<br>Total time used: " + _room.timer + " seconds<br>Average letters per second: "+(_room.index)/_room.timer;
       document.getElementById("input").disabled = true;
       $('#restartButton').show();
       resetWord();
       setupWord('Game Over!', _room.split)
    });

    socket.on('restart', function(_room)
    {
        setPlayerBoxes(_room);
        $('#gameWindow').hide();
        $('#preGameWindow').show();
    });

    // CHAT FUNCTIONS
    socket.on('chat message', function(msg, _user)
    {
        if (_user == username)
        {
            $('#messages').append($('<li><p><b> ' + _user + ' : ' +
                            msg + '</b></p></li>'));
            socket.emit('add history', '<li><p>' +  _user + ' : ' +
                            msg + '</p></li>')
        }
        else
        {
            $('#messages').append($('<li><p>' + _user + ' : ' +
                                msg + '</p></li>'));
        }

        $('#chatBody').scrollTop($('#chatBody')[0].scrollHeight);
    });

    socket.on('setup chat', function(history)
    {
        for(let line of history){
            $('#messages').append(line);
        }
    });

    $("#chatInput").on('keyup', function (e) {
        if (e.keyCode == 13) {
            socket.emit('chat message', $('#chatInput').val(), username);
            $('#chatInput').val('');
        }
    });

    // Enter the room as the last thing
    socket.emit("enter room", $('#roomNumber').html());

}



function setPlayerBoxes(_room)
{
    if (username == _room.users[0])
    {
        $('#player').css('background-color', colors[0]);
    }
    if (username == _room.users[1])
    {
        $('#player').css('background-color', colors[1]);
    }
    if (username == _room.users[2])
    {
        $('#player').css('background-color', colors[2]);
    }
    if (username == _room.users[3])
    {
        $('#player').css('background-color', colors[3]);
    }
    if (_room.users[0])
    {
        $('.player1').css('background-color', colors[0]);
        $('.player1').html(_room.users[0]);
    }
    else
    {
        $('.player1').css('background-color', 'white');
        $('.player1').html("EMPTY");
    }


    if (_room.users[1])
    {
        $('.player2').css('background-color', colors[1]);
        $('.player2').html(_room.users[1]);
    }
    else
    {
        $('.player2').css('background-color', 'white');
        $('.player2').html("EMPTY");
    }

    if (_room.users[2])
    {
        $('.player3').css('background-color', colors[2]);
        $('.player3').html(_room.users[2]);
    }
    else
    {
        $('.player3').css('background-color', 'white');
        $('.player3').html("EMPTY");
    }
    if (_room.users[3])
    {
        $('.player4').css('background-color', colors[3]);
        $('.player4').html(_room.users[3]);
    }
    else
    {
        $('.player4').css('background-color', 'white');
        $('.player4').html("EMPTY");
    }

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
        if (word[i] == " ")
            $('#goal').append("<li>&nbsp&nbsp</li>");
        else
            $('#goal').append("<li>" + word[i] + "</li>");
        $('#goal li:nth-child(' + (i+1) + ')').css('background-color', colors[split[i]]);
    }
    $('#goal li:nth-child(' + (1) + ')').css('text-decoration', 'underline');
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
    $('#input').val('');

}

function startGame()
{
    socket.emit("start game");
}

function restartGame()
{
    socket.emit("restart");
}

function exitGame()
{
    window.open("../index.html", "_self");
}
