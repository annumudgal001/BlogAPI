require("dotenv").config();
const express=require('express')
const expresslayout=require("express-ejs-layouts")
const connectdb = require('./server/config/db.js');

const app=express();
const PORT=5000||process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

connectdb();

app.use(express.static('public'))
app.use(expresslayout);
app.set("layout","./layouts/main")
app.set("view engine","ejs")


// Routes 
app.use(require('./server/routes/main.js'))

app.listen(PORT,()=>{
    console.log(`Server is running on  http://localhost:${PORT}`);
})