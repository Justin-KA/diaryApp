const path =require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const connectDB = require('./config/db')

//Load config
dotenv.config({ path: './config/config.env'})

// Passport config
require('./config/passport')(passport)

connectDB()

const app = express()


// Body Parser
app.use(express.urlencoded({ extended: false}))
app.use(express.json())

//Logging
if (process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
}

// Handlebar Helpers
const { formatDate } = require('./helpers/hbs')


//Handlebars
app.engine('.hbs', exphbs.engine({
    helpers: {
        formatDate,
    },
    defaultLayout: 'main', 
    extname: '.hbs'
    })
);
app.set('view engine', '.hbs');

// Session middlware (needs to be before passport)
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI
        })
  }))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Static folder
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/diaries', require('./routes/diaries'))

const PORT = process.env.PORT || 5000

app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
    )