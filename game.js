/* game.js
 * all game logic should go in here
 *
 */

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
};
function _setup(_sock, username, roomNumber) {
    room = rooms[roomNumber-1];
    room.users.push(username);
    _sock.emit("word update", room.word, "");
    _sock.on("letter typed", function(letter){
        console.log(letter + " typed");
        console.log(room.word[room.index])
        if (letter == room.word[room.index]){
            room.index += 1;
            _sock.emit("word update", room.word, room.word.slice(0, room.index));
        }
    });
    console.log("User entered room" + roomNumber);
}
