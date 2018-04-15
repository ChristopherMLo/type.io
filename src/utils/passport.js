const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },

        function (req, email, password, done) {

            User
                .findOne({ email: email })
                .exec()
                .then(user => {
                    if (!user) {
                        return done(null, false, req.flash('loginMessages', 'Incorrect email.'))
                    }
                    if (!user.validPassword(password)) {
                        return done(null, false, req.flash('loginMessages', 'Incorrect password.'))
                    }
                    return done(null, user)
                })
                .catch(err => {
                    return done(err)
                })
        }))



    passport.use('register', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },

        function (req, email, password, done) {

            User.findOne({ email: email }, function (err, user) {
                if (err) { return done(err) }

                if (user) {
                    console.log('User already')
                    return done(null, false, req.flash('registerMessage', 'User already exists(email)'))
                } else {
                    var newUser = new User({
                        email: email,
                        username: req.body.username,
                    })
                    newUser.password = newUser.generateHash(password)

                    newUser
                        .save()
                        .then(user => {
                            return done(null, newUser)
                        })
                        .catch(err => {
                            throw err
                        })
                }
            })
        }))
}
