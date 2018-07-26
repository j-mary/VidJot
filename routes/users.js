const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const passport = require('passport')

const router = express.Router()

// Load User model
require('../models/User')
const User = mongoose.model('Users')

// User Login Route
router.get('/login', (req, res) => {
  res.render('users/login');
});

// User Register Route
router.get('/register', (req, res) => {
  res.render('users/register');
});

// LOGIN Form POST
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next)
})

// Register Form Route
router.post('/register', (req, res) => {
  let errors = []

  if (req.body.name.trim().length < 2) {
    errors.push({text: 'Your full name is required'})
  }

  if (!req.body.email.includes('@')) {
    errors.push({text: 'Email must be valid'})
  }

  if (req.body.password !== req.body.password2) {
    errors.push({text: 'Passwords do not match'})
  }

  if (req.body.password.length < 6) {
    errors.push({text: 'Password must be at least 6 characters'})
  }

  if (errors.length > 0) {
    res.render('users/register', {
      errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    })
  } else {
    User.findOne({email: req.body.email}).then((user) => {
      if (user) {
        req.flash('error_msg', 'Email already registered')
        res.render('users/register', {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          password2: req.body.password2
        })
      } else {
        const newUser = new User ({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        })
    
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password + 'vidjotsecrets', salt, (err, hash) => {
            if (err) throw error
    
            newUser.password = hash
              newUser.save().then((user) => {
              req.flash('success_msg', 'You\'re now registered and can log in')
              res.redirect('/users/login')
            }).catch((err) => {
              console.log(err)
              return
            })
          })
        })
      }
    })
  }
})

// Logout User
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', 'You\'re logged out')
  res.redirect('/users/login')
})

module.exports = router