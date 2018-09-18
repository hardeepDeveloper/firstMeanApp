const express = require('express');
var exphbs  = require('express-handlebars');

const app = express();

const port = 5000;

// Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

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

app.listen(port, ()=>{
    console.log(`Listening to port ${port}`);
})