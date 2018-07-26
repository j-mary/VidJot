const express = require('express')
const mongoose = require('mongoose')
const {ensureAuthenticated} = require('../helpers/auth')

const router = express.Router()

//Load Idea Model
require('../models/Idea')
const  Idea = mongoose.model('Ideas')

//Ideas Index Page
router.get('/', ensureAuthenticated, (req, res) => {
  Idea.find({user: req.user.id}).sort({date: 'desc'}).then(ideas => {
    res.render('ideas/index', {ideas})
  })
})

//Add Idea Form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('ideas/add')
})

//Edit Idea Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Idea.findById(req.params.id).then((idea) => {
    if (idea.user != req.user.id) {
      req.flash('error_msg', 'Not Authorizes')
      res.redirect('/ideas')
    } else {
      res.render('ideas/edit', {idea})
    }
  })
})

//Add form Process
router.post('/', ensureAuthenticated, (req, res) => {
 let errors = []
 if (!req.body.title) {
   errors.push({text: 'Please add a title'})
 }
 if (!req.body.details) {
   errors.push({text: 'Please add some details'})
 }

 if (errors.length > 0) {
   res.render('ideas/add', {
     errors: errors,
     title: req.body.title,
     details: req.body.details
   })
 } else {
   const newIdea = new Idea({
     title: req.body.title,
     details: req.body.details,
     user: req.user.id
   })
   newIdea.save().then(idea => {
    req.flash('success_msg', 'Video idea added')
    res.redirect('/ideas')
   })
 }
})

//Edit form process
router.put('/:id', ensureAuthenticated, (req, res) => {
  Idea.findById(req.params.id).then((idea) => {
    //New Values
    idea.title = req.body.title,
    idea.details = req.body.details

    idea.save().then(() => {
      req.flash('success_msg', 'Video idea updated')
      res.redirect('/ideas')
    })
  })
})

//Delete form process
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Idea.findByIdAndRemove(req.params.id).then(() => {
    req.flash('success_msg', 'Video idea removed')
    res.redirect('/ideas')
  })
})

module.exports = router