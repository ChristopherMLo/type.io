/* game.js
 * all game logic should go in here
 *
 */

// room objects, contains information specific to the rooms.
// users= array of useres
// name = rooms name, used to broadcast to rooms
// word = word to typed
// index = current index of word progress
// split = assigned key to word, ex[1, 2, 4, 3, 2, 1, 1], see splitWord()
var room1 = {
    users: [null, null, null, null],
    numUsers: 0,
    name: 'room 1',
    word: "",
    nospace: "",
    min: 2,
    max: 3,
    index: 0,
    split: [],
    timer: 0,
    history: [],

}
var room2 = {
    users: [null, null, null, null],
    numUsers: 0,
    name: 'room 2',
    word: "",
    min: 5,
    max: 8,
    index: 0,
    split: [],
    timer: 0,
    history: [],

}
var room3 = {
    users: [null, null, null, null],
    numUsers: 0,
    name: 'room 3',
    word: "",
    min: 9,
    max: 15,
    index: 0,
    split: [],
    timer: 0,
    history: [],
}
var room4 = {
    users: [null, null, null, null],
    numUsers: 0,
    name: 'room 4',
    word: "",
    min: 16,
    max: 20,
    index: 0,
    split: [],
    timer: 0,
    history: [],

}
var rooms = [room1, room2, room3, room4];
for (i = 0; i < 50; i++) {
  rooms[0].history.push("<li>&nbsp;</li>");
  rooms[1].history.push("<li>&nbsp;</li>");
  rooms[2].history.push("<li>&nbsp;</li>");
  rooms[3].history.push("<li>&nbsp;</li>");
}

var randomWords = require('random-words');

// Anytime you add a function make sure to update this if you need the function in server.js
module.exports = {
    setup: _setup,
    exit: _exit,
};

// Called whenever a socket enters the room.
function _setup(io, _sock, username, roomNumber) {
     var cancelInterval;
    // set the room
    if (addUser(roomNumber, username) == -1){
        console.log("Too Many Users");
    }
    else {
        // Setup the user and socket in the room
        _sock.join(rooms[roomNumber-1].name);
        _sock.emit("player setup", username);
        _sock.emit('player entered', rooms[roomNumber-1]);
        _sock.in(rooms[roomNumber-1].name).emit('player entered', rooms[roomNumber-1]);

        // Start game button (or some other event) is clicked
        // split the word and send the final users
        _sock.on("start game", function()
        {
            rooms[roomNumber-1].word = randomWords({ min: rooms[roomNumber-1].min, max: rooms[roomNumber-1].max }).join(' ');
            rooms[roomNumber-1].timer = 0;
            splitWord(roomNumber);
            rooms[roomNumber-1].index = 0;
            _sock.emit('start game', rooms[roomNumber-1]);
            _sock.in(rooms[roomNumber-1].name).emit('start game', rooms[roomNumber-1]);

            // records seconds since game started
            cancelInterval = setInterval(function(){
                 rooms[roomNumber-1].timer++;
                 console.log('time used: ', rooms[roomNumber-1].timer);
            }
            , 1000);
        });

        _sock.on("restart", function()
        {
            _sock.emit('restart', rooms[roomNumber-1]);
            _sock.in(rooms[roomNumber-1].name).emit('restart', rooms[roomNumber-1]);
        });

        // Whenever a key is typed from a client, then update the progress for clients
        _sock.on("key typed", function(key, _index)
        {
            // Check if the correct player typed it
            if (_index == rooms[roomNumber-1].split[rooms[roomNumber-1].index])
            {
                // Check if the right key was pressed
                if (key.toLowerCase() == rooms[roomNumber-1].word[rooms[roomNumber-1].index].toLowerCase())
                {
                    rooms[roomNumber-1].index += 1;
                    _sock.emit("word update", rooms[roomNumber-1]);
                    _sock.in(rooms[roomNumber-1].name).emit("word update", rooms[roomNumber-1]);
                    if (rooms[roomNumber-1].index >= rooms[roomNumber-1].word.length)
                    {
                         clearInterval(cancelInterval);
                         _sock.emit("game over", rooms[roomNumber-1]);
                         _sock.in(rooms[roomNumber-1].name).emit("game over", rooms[roomNumber-1]);
                    }

                }
                else
                {
                    _sock.emit("wrong key")
                }
            }
            else
            {
                _sock.emit("wrong player");
            }
        });

        // CHAT FUNCTIONS
        _sock.on("chat message", function(msg, user)
        {
            _sock.emit('chat message', msg, user);
            _sock.in(rooms[roomNumber-1].name).emit('chat message', msg, user);
        });

        _sock.on('add history', function (msg)
        {
            rooms[roomNumber-1].history.push(msg);
            if (rooms[roomNumber-1].history.length > 50)
            {
                rooms[roomNumber-1].history.shift();
            }
        });

        _sock.emit("setup chat", rooms[roomNumber-1].history);

        console.log(username + " has entered room" + roomNumber);
    }

}
//
// function timer(roomNumber) {
//     rooms[roomNumber-1].timer ++;
// }

// clear the split array and split the word among players
// room.split[] will contain [0, 2, 2, 3, ...]
// which corrolates to users[0] types first key, users[2] types next two, then users[4] types the next etc.
function splitWord(roomNumber)
{
    rooms[roomNumber-1].split = []
    for (i = 0; i < rooms[roomNumber-1].word.length; i++)
    {
        while (true)
        {
            let identifier = Math.floor(Math.random() * rooms[roomNumber-1].word.length);
            if (rooms[roomNumber-1].users[identifier] != null)
            {
                rooms[roomNumber-1].split.push(identifier);
                break;
            }
        }

    }
}

function addUser(roomNumber, _user)
{
    for (i = 0; i < 4; i++)
    {
        if (rooms[roomNumber-1].users[i] == null)
        {
            rooms[roomNumber-1].users[i] = _user;
            return i;
        }
    }
    return -1;
}


// when a player exits the room
function _exit(_sock, username, roomNumber)
{
    if (roomNumber > 0)
    {
        let index = rooms[roomNumber-1].users.indexOf(username);
        if (index > -1)
        {
          rooms[roomNumber-1].users[index] = null;
          _sock.in(rooms[roomNumber-1].name).emit('player exited', rooms[roomNumber-1]);
        }
    }


    console.log(username + " has exited room " + roomNumber);
}
