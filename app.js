const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');

const app = express();

const port = 5000;

//Connect to Mongoose
mongoose.connect('mongodb://localhost/vidjot-dev',{ 
    useNewUrlParser: true 
}).then( () => console.log('MonogDB Connected...'))
.catch( err => console.log(err))

//Load Idea Model
require('./models/idea');
const Idea = mongoose.model('ideas');

// Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Override middleware with POST having ?_method=DELETE/?_method=PUT
app.use(methodOverride('_method'));

// Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }));

// Connect Flash Middleware
app.use(flash());

// Global varriaables
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
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

// Idea Index Page
app.get('/ideas', (req,res)=>{
    Idea.find({})
    .sort({date:"desc"})
    .then( ideas => {
        res.render('ideas/index',{
            ideas: ideas
        });
    })    
});

// Add Idea Route
app.get('/ideas/add', (req,res)=>{
    res.render('ideas/add');
});

// Edit Idea Route
app.get('/ideas/edit/:id', (req,res)=>{
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea=>{
        res.render('ideas/edit',{
            idea: idea
        });
    });  
});

// Process Form
app.post('/ideas', (req,res)=>{
    let errors = [];

    if(!req.body.title){
        errors.push({text: "Please add a title"});
    }
    if(!req.body.details){
        errors.push({text: "Please add details"});
    }

    if(errors.length > 0){
        res.render('ideas/add',{
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newUser)
            .save()
            .then(idea=>{
                req.flash('success_msg','Videa idea added');
                res.redirect('/ideas');
            });
    }
});

// Edit Form Process
app.put('/ideas/:id', (req,res)=>{
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea=>{
        // New Values
        idea.title = req.body.title;
        idea.details = req.body.details;

        idea.save(idea=>{
            req.flash('success_msg','Videa idea updated');
            res.redirect('/ideas');
        })
    })
});

// Delete Idea
app.delete('/ideas/:id', (req,res)=>{
    Idea.deleteOne({
        _id: req.params.id
    })
    .then(()=>{
        req.flash('success_msg','Videa idea removed');
        res.redirect('/ideas');
    });
});

app.listen(port, ()=>{
    console.log(`Listening to port ${port}`);
})