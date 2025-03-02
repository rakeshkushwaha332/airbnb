const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn ,isReviewAuthor} = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync"); // Import wrapAsync
const Listing = require("../models/listing.js"); // Import Listing model
const Review = require("../models/reviews.js"); // Import Review model

// Post Review Route
router.post(
    "/",
    isLoggedIn,
    validateReview,
    isReviewAuthor,
    wrapAsync(async (req, res) => {
        let listing = await Listing.findById(req.params.id);
        let newReview = new Review(req.body.review);
        newReview.author = req.user._id;

        newReview.author = req.user._id;
        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();

        req.flash("success", "New Review Created!");
        res.redirect(`/listings/${listing._id}`);
    })
);

module.exports = router;