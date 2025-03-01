const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");

// Utility function to wrap async routes
const wrapAsync = (fn) => {
    return function (req, res, next) {
        fn(req, res, next).catch(next);
    };
};

// Render the signup form
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

// Handle the signup form submission
router.post("/signup", wrapAsync(async (req, res) => {
    const { username, email, password } = req.body;

    // Create a new user
    const newUser = new User({ email, username });

    // Register the user using passport-local-mongoose
    const registeredUser = await User.register(newUser, password);

    // Log the username, salt, and hashed password
    console.log("Username:", registeredUser.username);
    console.log("Salt:", registeredUser.salt);
    console.log("Hashed Password:", registeredUser.hash);

    // Set a success flash message
    req.flash("success", "Welcome to Wanderlust!");

    // Redirect to the listings page
    res.redirect("/listings");
}));

// Render the login form
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

// Handle the login form submission
router.post("/login", passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
}), (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect("/listings");
});

module.exports = router;