/* game.js
 * all game logic should go in here
 *
 */

// possible multiple room support?
var room1 = {
    users: [],
    word: "HelloWorld1",
    index: 0,
}
var room2 = {
    users: [],
    word: "HelloWorld2",
    index: 0,
}
var room3 = {
    users: [],
    word: "HelloWorld3",
    index: 0,
}
var room4 = {
    users: [],
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
function _setup(_sock, username, roomNumber) {
    room = rooms[roomNumber-1];
    if (room.users.length >= 4){
        console.log("Too Many Users");
    }
    else {
        room.users.push(username);

        // Update the word initially
        _sock.emit("word update", room.word, "");

        // Whenever a letter is typed from a client, then update the progress for clients
        _sock.on("letter typed", function(letter){
            if (letter == room.word[room.index]){
                room.index += 1;
                _sock.emit("word update", room.word, room.word.slice(0, room.index));
            }
        });
        console.log("User entered room" + roomNumber);
    }

}

function _exit(username){
    var index = room.users.indexOf(username);
    if (index > -1) {
      room.users.splice(index, 1);
    }
}
