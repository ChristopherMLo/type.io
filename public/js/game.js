/* game.js
 *
 *
 */
var socket;
$(document).ready(init);
function init() {
    socket = io();
    socket.on('word update', function(goal, typed){
        $('#goal').html(goal);
        $('#typed').html(typed);
    });
    console.log($('#roomNumber').html());
    socket.emit("enter room", $('#roomNumber').html());

}

function letterTyped(event){
    socket.emit("letter typed", event.key);
}
