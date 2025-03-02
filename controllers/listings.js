const Listing = require("../models/listing")







module.exports.index =async (req, res) => {
    const allListings = await Listing.find({});
    // console.log(allListings);
    res.render("listings/index.ejs", { allListings });
};



module.exports.renderNewForm =  (req, res) => {
   
    
    res.render("listings/new.ejs");
};


module.exports.showListing = async (req, res) => {
    const listing = await Listing.findById(req.params.id).populate({path:"reviews", populate:{ path: "author",},}) .populate("owner");
    if(!listing) {
        req.flash("error","Listing you requested for does not exist!")
        res.redirect("/listings")
    } 
    console.log(listing);
    res.render("listings/show.ejs", { listing });
};



module.exports.createListing = async (req, res, next) => {
   

    try {
        let url = req.file.path;
        let filename = req.file.filename;
        // Create a new listing using the data from the request body
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image ={url, filename};

        


      

        // Save the listing to the database
        await newListing.save();

        // Flash a success message
        req.flash("success", "New Listing Created!");

        // Redirect to the listings page
        res.redirect("/listings");
    } catch (err) {
        // Pass any errors to the error handler
        next(err);
    }
};

module.exports.renderEditForm = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    req.flash("success","Listing Edited!")
    res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing =  async (req, res) => {
    let {id} =req.params;
    await Listing.findByIdAndUpdate(req.params.id, req.body.listing);
    req.flash("success"," Listing Updated!")
    res.redirect(`/listings/${req.params.id}`);
};


module.exports.destroyListing =async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success"," Listing Deleted!")
    res.redirect("/listings");
};








