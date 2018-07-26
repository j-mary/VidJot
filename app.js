const express = require('express')
const exphbs  = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

const app = express()

//Express middleware for static files
app.use(express.static(__dirname + '/public'))

//Load ideas/users routes
const ideas = require('./routes/ideas')
const users = require('./routes/users')

// Passport Config
require('./config/passport')(passport)

// Database Config
const db = require('./config/database')

// Map global promise - get rid of warning
mongoose.Promise = global.Promise

//Connect to Mongoose
mongoose.connect(db.mongoURI, {useNewUrlParser: true})
.then(() => console.log(`MongoDB Connected...`))
.catch(err => console.error(err))

//Express Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars')

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Method override middleware
app.use(methodOverride('_method'))

//Express Session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect-flash middleware
app.use(flash())

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  res.locals.user = req.user || null
  next()
})

//Index Route
app.get('/', (req, res) => {
  const title = 'Welcome'
  res.render('index', {
    title
  })
})

//About Route
app.get('/about', (req, res) => {
  res.render('about')
})

//Use Ideas/Users routes
app.use('/ideas', ideas)
app.use('/users', users)

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Server Started on PORT ${port}`)
})