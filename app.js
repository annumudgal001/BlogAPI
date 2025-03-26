require("dotenv").config();
const express = require('express');
const methodOverride = require('method-override');
const expressLayout = require("express-ejs-layouts");
const connectDB = require('./server/config/db.js');
const cookieParser = require('cookie-parser');
const session = require('express-session'); 
const MongoStore = require('connect-mongo'); 
const isActiveRoute = require('./server/helpers/routehelpers.js');

const app = express();
const PORT = process.env.PORT || 5000; 

// Middleware
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ 
        mongoUrl: process.env.MONGODB_URI, 
        collectionName: 'sessions'
    }),
    cookie:{ maxAge: 3600000 }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Method Override

app.use(methodOverride('_method'));

// Connect to Database
connectDB();

// Static Files & View Engine
app.use(express.static('public'));
app.set("view engine", "ejs");
app.set("layout", "./layouts/main");
app.use(expressLayout);

app.locals.isActiveRoute=isActiveRoute;

// Routes 
app.use('/', require('./server/routes/main.js'));
app.use('/', require('./server/routes/admin.js'));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
