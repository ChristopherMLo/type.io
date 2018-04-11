# type.io

After pulling from git, run an npm install
run server: node server.js
run client: go to browser localhost:3000


Try not to use JQuery for time sensitive things, it is slow (but if its way easier than go for it)
Ex. you can use it for stuff like setting up the game, but dont use it to update keys typed


For the html, what I've been doing is making into a grid system. If you have a better way I'm all for it, I suck at front-end webdev.
Use float:none to stack elements on top of eachother
Use float:left to stack elements beside eachother
Use padding to center things
use wrappers to wrap a row and set the wrapper to float:none.
Set the child elements float:left to make columns for the row

For the game room I dont want to to open another window, so in the gameWrapper just hide whatever screen is not in use and show the one you want to see. (same idea for the main menu screen)


Hosted at: https://type-io.herokuapp.com/
