/* game.js
 * client side game logic should be here
 *
 */
var socket;
$(document).ready(init);
function init() {
    socket = io();

    // Update words whenever progress is made
    socket.on('word update', function(goal, typed){
        $('#goal').html(goal);
        $('#typed').html(typed);
    });

    // Enter the room as the last thing
    socket.emit("enter room", $('#roomNumber').html());

}

// On Key Up in html we emit the letter typed.
function letterTyped(event){
    socket.emit("letter typed", event.key);
}
