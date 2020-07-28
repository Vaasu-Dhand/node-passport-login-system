const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
// require('dotenv').config()

const app = express()

// Passport config
require('./config/passport')(passport)

// DB Config
const db = process.env.MongoURI;

// Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.error(err))

// 3rd Parth Middleware comes with the next method already invoked

// Bodyparser
app.use(express.urlencoded({ extended: false }))

// Express Session Middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}))

// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

// Connect Flash
app.use(flash())

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})

// EJS (Order matters)
app.use(expressLayouts)
app.set('view engine', 'ejs')

// Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

app.listen(process.env.PORT || 3000, console.log(`Server started on port ${3000}`))