const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/404')

// const expressHbs = require("express-handlebars");

const app = express();

// To connect the app engine to use handbar to parse to html code
// This configures the hbs 
// app.engine(
//     'hbs',
//     expressHbs({
//         layoutsDir: 'views/layouts/',
//         defaultLayout: 'main-layout',
//         extname: 'hbs'
//     })
// )

// Lets us set any value golbally on our express application
// app.set('view engine', 'pug'); // set view engine to pug
// app.set('view engine', 'hbs') // Set view engine to hbs
app.set('view engine', 'ejs') // Set view engine to ejs
app.set('views', 'views');
// To get access to the public folder and link static files like css
app.use(express.static(path.join(__dirname, 'public')));

// This allows you to access form data submitted in POST requests via req.body in your route handlers
app.use(bodyParser.urlencoded({extended: false}));

app.use('/admin', adminRoutes);

app.use(shopRoutes);

app.use(errorController.error);

app.listen(3000);
