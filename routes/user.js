const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const  userController = require("../controllers/users.js");

// Utility function to wrap async routes
const wrapAsync = (fn) => {
    return function (req, res, next) {
        fn(req, res, next).catch(next);
    };
};


// Render the signup form
router.get("/signup", userController.renderSignupForm);

// Handle the signup form submission
router.post("/signup", wrapAsync(userController.signup));

//     // Log the username, salt, and hashed password
//     console.log("Username:", registeredUser.username);
//     console.log("Salt:", registeredUser.salt);
//     console.log("Hashed Password:", registeredUser.hash);
// }));

// Render the login form
router.get("/login", saveRedirectUrl, wrapAsync(userController.renderLoginForm));

// Handle the login form submission
router.post("/login",saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
}), userController.login);

// Handle logout
router.get("/logout", userController.logout)
module.exports = router;