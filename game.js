/* game.js
 * all game logic should go in here
 *
 */

// room objects, contains information specific to the rooms.
// users= array of useres
// name = rooms name, used to broadcast to rooms
// word = word to typed
// index = current index of word progress
var room1 = {
    users: [],
    name: 'room 1',
    word: "HelloWorld1",
    index: 0,
}
var room2 = {
    users: [],
    name: 'room 2',

    word: "HelloWorld2",
    index: 0,
}
var room3 = {
    users: [],
    name: 'room 3',
    word: "HelloWorld3",
    index: 0,
}
var room4 = {
    users: [],
    name: 'room 4',
    word: "HelloWorld4",
    index: 0,
}
var rooms = [room1, room2, room3, room4];
var socket;
module.exports = {
    setup: _setup,
    exit: _exit,
};

// Called whenever a socket enters the room. Currently the socket that starts on
// index.html is not the same socket
function _setup(io, _sock, username, roomNumber) {

    // set the room
    var room = rooms[roomNumber-1];
    if (room.users.length >= 4){
        console.log("Too Many Users");
    }
    else {
        // Setup the user and socket in the room
        room.users.push(username);
        _sock.join(room.name);
        _sock.emit("word update", room.word, "");

        // Whenever a letter is typed from a client, then update the progress for clients
        _sock.on("letter typed", function(letter){
            if (letter == room.word[room.index]){
                room.index += 1;
                _sock.to(room.name).emit("word update", room.word, room.word.slice(0, room.index));
                _sock.emit("word update", room.word, room.word.slice(0, room.index));
            }
        });
        console.log(username + " has entered room" + roomNumber);
    }

}

function _exit(username, roomNumber){
    if (roomNumber > 0){
        var room = rooms[roomNumber-1];
        var index = room.users.indexOf(username);
        if (index > -1) {
          room.users.splice(index, 1);
        }
    }
    console.log(username + " has exited room" + roomNumber);
}
