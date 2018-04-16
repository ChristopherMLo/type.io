/* client.js
 * base client logic should go here
 *
 */

var socket;
$(document).ready(init);
function init()
{
    socket = io();
}


function connect(roomNumber)
{
    // TODO: better of of creating multple rooms? other tha one.html two.html etc.
    window.open("/rooms/" + roomNumber + ".html", "_self");
}
