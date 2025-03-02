const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js"); // Adjust path for correct model import
const Review = require("../models/reviews");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");
const{saveRedirectUrl} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const wrapAsync = require("../utils/wrapAsync.js");

// const {listingSchema} = require("./schema.js")
// Index route
router.get("/", wrapAsync(listingController.index) );

// New route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show route
router.get("/:id", wrapAsync(listingController.showListing));

// Create route
router.post("/", isLoggedIn, wrapAsync(listingController.createListing));

// Edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm)); 

// Update route
router.put("/:id",isLoggedIn,isOwner, wrapAsync(listingController.updateListing));


// Delete route
router.delete("/:id",isOwner,isLoggedIn, wrapAsync(listingController.destroyListing));




// review route
// post route
router.post("/:id/reviews",isLoggedIn, async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview._id);
    await listing.save();
await newReview.save();
console.log("new review saved");

res.redirect(`/listings/${listing.id}`);   // Correct - Only one response

});
// 






// Test listing route (optional - you can remove it if not needed)
router.get("/testlisting", async (req, res) => {
    let sample = new Listing({
        tittle: "my new villa",
        description: "by the beach",
        Image: "https://images.unsplash.com/photo-1728988914134-c14e15f91d8a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: 1200,
        locatin: "india, goa",
        country: "india",
    });

    await sample.save();
    console.log("listing saved");
    res.send("successful testing");
});

module.exports = router;
