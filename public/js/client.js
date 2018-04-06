/* client.js
 * base client logic should go here
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
