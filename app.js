require("dotenv").config();
const express = require('express');
const expressLayout = require("express-ejs-layouts");
const connectDB = require('./server/config/db.js');
const cookieParser = require('cookie-parser');
const session = require('express-session'); 
const MongoStore = require('connect-mongo'); 

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
    //cookie: { maxAge:new Date (Date.now()+ (3600000) )} 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to Database
connectDB();

// Static Files & View Engine
app.use(express.static('public'));
app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

// Routes 
app.use('/', require('./server/routes/main.js'));
app.use('/', require('./server/routes/admin.js'));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
