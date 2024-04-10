const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const expressHbs = require("express-handlebars");

const app = express();

// To connect the app engine to use handbar to parse to html code
app.engine(
    'hbs',
    expressHbs({
        layoutsDir: 'views/layouts/',
        defaultLayout: 'main-layout',
        extname: 'hbs'
    })
)

// Lets us set any value golbally on our express application
// app.set('view engine', 'pug'); // set view engine to pug
app.set('view engine', 'hbs') // Set view engine to hbs
app.set('views', 'views');
// To get access to the public folder and link static files like css
app.use(express.static(path.join(__dirname, 'public')));

// This allows you to access form data submitted in POST requests via req.body in your route handlers
app.use(bodyParser.urlencoded({extended: false}));

app.use('/admin', adminData.router);

app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).render('404', {
        docTitle: 'Page Not Found'
    });
});

app.listen(3000);
