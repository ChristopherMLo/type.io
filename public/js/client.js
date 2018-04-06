/* client.js
 *
 *
 */
var socket;
$(document).ready(init);
function init() {
    socket = io();
}

function connect(roomNumber){
    window.open("/rooms/one.html");
}
