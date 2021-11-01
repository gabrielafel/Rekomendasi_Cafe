const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require("connect-flash");

const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// body-parser to parse request body
app.use(bodyParser.urlencoded());

// static files
app.use(express.static('public'));

// express session middleware
app.use(
  session({
    secret: "rahasia",
    resave: true,
    saveUninitialized: true,
  })
);

//connect flash
app.use(flash());

// global var
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// place all styles block in the layout at the head
app.set("layout extractStyles", true)

// place all scripts block in the layout at the end
app.set("layout extractScripts", true)

// routes
const index = require('./routes/index');

app.use('/', index);

let PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log('Server runs at port 3000...');
