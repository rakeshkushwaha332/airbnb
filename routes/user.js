const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");

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
router.post("/signup", wrapAsync(async (req, res, next) => {
    const { username, email, password } = req.body;

    // Create a new user
    const newUser = new User({ email, username });

    // Register the user using passport-local-mongoose
    const registeredUser = await User.register(newUser, password);

    // Auto-login after signup
    req.login(registeredUser, (err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Welcome to Wanderlust!");

        // Redirect to the saved URL or fallback to "/listings"
        const redirectUrl = req.session.redirectUrl || "/listings"; // Use the saved URL or fallback
        delete req.session.redirectUrl; // Clear the redirect URL after use
        res.redirect(redirectUrl);
    });

    // Log the username, salt, and hashed password
    console.log("Username:", registeredUser.username);
    console.log("Salt:", registeredUser.salt);
    console.log("Hashed Password:", registeredUser.hash);
}));

// Render the login form
router.get("/login", saveRedirectUrl, (req, res) => {
    res.render("users/login.ejs");
});

// Handle the login form submission
router.post("/login",saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
}), (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    const redirectUrl = res.locals.redirectUrl || "/listings"; // Use the saved URL or fallback
    console.log("Redirecting to:", redirectUrl); // Debugging
    delete req.session.redirectUrl; // Clear the redirect URL after use
    res.redirect(redirectUrl);
});

// Handle logout
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
});

module.exports = router;