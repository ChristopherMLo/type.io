/* server.js
 * base server logic should go here
 *
 */

const game = require('./game');
const express = require('express')
const app = express()
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
const path = require('path');

const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')
const dbUtils = require('./src/utils/database')
require('dotenv').config()

require('./src/utils/passport')(passport)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(morgan('dev'))
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true
}))

app.use(flash())
app.use(passport.initialize())
app.set('view engine', 'ejs')
app.use(passport.session())

var users = []; // list of users (string) (currently unused)

io.on('connection', function (socket)
{
    var thisUser = createUser();
    var room = 0;
    console.log(thisUser + " Connected");
    socket.on("enter room", function(roomNumber)
    {
        room = roomNumber;
        game.setup(io, socket, thisUser, roomNumber);
    });
    socket.on("disconnect", function()
    {
        game.exit(socket, thisUser, room);
        console.log("User Disconnected");
    });
});

// Creates a user and stores it in users
function createUser()
{
    var number = 1;
    while(users.indexOf("user" + number.toString()) != -1)
    {
        number++;
    }
    var newUser = "user" + number.toString();
    users.push(newUser);
    return newUser;
}

server.listen(port, function ()
{
    console.log('listening on *:' + port);
});

// connect to the db

const url = `mongodb://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASS}${process.env.MONGO_DB_HOST}:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB_NAME}`
dbUtils.connect(url)
    .then(_ => {
        console.log('Successfully connected to DB 😀')
    })
    .catch(err => {
        console.log(`Error Connecting to the mongo DB ${error}`)
    })

require('./src/routes/routes')(app, passport)