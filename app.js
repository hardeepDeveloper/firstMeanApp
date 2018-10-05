const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const exphbs  = require('express-handlebars');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();

// Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/database');

//Connect to Mongoose
mongoose.connect(db.mongoURI,{ 
    useNewUrlParser: true 
}).then( () => console.log('MonogDB Connected...'))
.catch( err => console.log(err))

// Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Override middleware with POST having ?_method=DELETE/?_method=PUT
app.use(methodOverride('_method'));

// Express Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }));

// Passport Session Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash Middleware
app.use(flash());

// Global varriaables
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})

// Index Route
app.get('/', (req,res)=>{
    const title = "Welcome";
    res.render('index',{
        title: title
    });
});

// About Route
app.get('/about', (req,res)=>{
    res.render('about');
});

// Use routes
app.use('/ideas',ideas);
app.use('/users',users);

const port = process.env.PORT || 5000;

app.listen(port, ()=>{
    console.log(`Listening to port ${port}`);
})