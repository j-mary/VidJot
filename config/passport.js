const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrpt = require('bcryptjs')

// Load User model
const User = mongoose.model('Users')

module.exports = function(passport) {
  passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
    // Match User
    User.findOne({email}).then((user) => {
      if (!user) {
        return done(null, false, {message: 'No User Found'})
      }

      // Match Password
      bcrpt.compare(password + 'vidjotsecrets', user.password, (err, isMatch) => {
        if (err) throw err

        if (isMatch) {
          return done(null, user)
        } else {
          return done(null, false, {message: 'Password Incorrect'})
        }
      })
    })
  }))

  // Passport serialization
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}