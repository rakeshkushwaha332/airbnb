const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js"); // Adjust path for correct model import
const Review = require("../models/reviews");
// const {listingSchema} = require("./schema.js")
// Index route
router.get("/", async (req, res) => {
    const allListings = await Listing.find({});
    console.log(allListings);
    res.render("listings/index.ejs", { allListings });
});

// New route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

// Show route
router.get("/:id", async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if(!listing) {
        req.flash("error","Listing you requested for does not exist!")
        res.redirect("/listings")
    }
    res.render("listings/show.ejs", { listing });
});

// Create route
router.post("/", async (req, res, next ) => {
    try{
        const listing = new Listing(req.body.listing);
    await listing.save();
    req.flash("success","New Listing Created!")
    res.redirect(`/listings`);
    } catch(err){
        next(err);
    }
});

// Edit route
router.get("/:id/edit", async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    req.flash("success","Listing Edited!")
    res.render("listings/edit.ejs", { listing });
});

// Update route
router.put("/:id", async (req, res) => {
    await Listing.findByIdAndUpdate(req.params.id, req.body.listing);
    req.flash("success"," Listing Updated!")
    res.redirect(`/listings/${req.params.id}`);
});

// Delete route
router.delete("/:id", async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success"," Listing Deleted!")
    res.redirect("/listings");
});


// review route
// post route
router.post("/:id/reviews", async (req, res) => {
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
