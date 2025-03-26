const express = require('express');
const router = express.Router();
const post = require('../models/post.js');
const user = require('../models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Layout and JWT secret configuration
const adminlayout = '../views/layouts/admin';
const jwtsecret = process.env.JWT_SECRET;


//authmiddleware

const authmiddleware=(req,res,next)=>{
    const token=req.cookies.token;
    if(!token){
        return res.status(401).json({ message: 'Unauthorized access ' });
    }

    try {
        const decoded=jwt.verify(token,jwtsecret);
        req.userid=decoded.userid;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Unauthorized access' });
    }
}

// Admin Panel Route (GET)
router.get("/admin", async (req, res) => {
    try {
        const locals = {
            title: 'Admin Panel',
            description: 'Admin panel for the blog'
        };

        // Render the admin index page with layout
        res.render('admin/index', { locals, layout: adminlayout });
    } catch (error) {
        console.error(error);
        // Handle errors (for now, you can just log or send a response)
        res.status(500).json({ error: error.message });
    }
});

// Admin Login Route (POST)
router.post("/admin", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user exists
        const existinguser = await user.findOne({ username });

        if (!existinguser) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const ispasswordvalid = await bcrypt.compare(password, existinguser.password);

        if (!ispasswordvalid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ userid: existinguser._id }, jwtsecret, { expiresIn: '1h' });

        // Set the token as an HTTP-only cookie
        res.cookie("token", token, { httpOnly: true });

        // Redirect to the dashboard
        res.redirect("/dashboard");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Dashboard Route (GET)
router.get("/dashboard",authmiddleware, async (req, res) => {
    res.render("admin/dashboard");
});

// User Registration Route (POST)
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Hash the password before saving
        const hashedpassword = await bcrypt.hash(password, 10);

        // Try creating a new user
        try {
            const newuser = await user.create({
                username,
                password: hashedpassword
            });

            res.status(201).json({ message: 'User registered successfully', newuser });
        } catch (error) {
            // Handle duplicate username error
            if (error.code == 11000) {
                return res.status(400).json({ message: 'Username already exists' });
            }

            // Handle any other errors
            res.status(400).json({ error: error.message });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
