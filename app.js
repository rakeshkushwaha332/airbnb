const express = require("express");
const app = express();
const mongoose = require("mongoose");
const  Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const MONGO_URL = "mongodb://localhost:27017/wonderlust";
const ejsMate = require("ejs-mate");
const session = require ("express-session")
const flash = require("connect-flash")

main()
.then(() => {
    console.log("database connected");
})
.catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("database connected");
}

app.set("view engine", "ejs");
 app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

app.use(express.static('public'));
app.use(express.static(__dirname + '/public/css/'));



const sessionOptions ={
    secret: "mysupersecretcode",
    resave: false,
    saveUninitalized : true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }


}
app.use (session(sessionOptions));
app.use(flash());

app.get("/", (req, res) => {
    res.send("hii i am root ");
})
// Index route

app.get("/listings", async (req, res) =>
 {
        const  allListings = await Listing.find({});
        console.log(allListings);
        res.render("listings/index.ejs",{allListings});


});
//new route
app.get("/listings/new", (req, res) => {

    res.render("listings/new.ejs");


    })

//show route
app.get("/listings/:id", async (req, res) => {

    const listing = await Listing.findById(req.params.id);
    res.render("listings/show.ejs", { listing });

})

//create route
app.post("/listings", async (req, res) => {
    const listing = new Listing(req.body.listing);
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
})
//edit route
app.get("/listings/:id/edit", async (req, res) => {
const listing = await Listing.findById(req.params.id);
res.render("listings/edit.ejs", { listing });
})

//update route
app.put("/listings/:id", async (req, res) => {
    const listing = await Listing.findByIdAndUpdate(req.params.id, req.body.listing);
    res.redirect(`/listings/${listing._id}`);
})
//delete route
app.delete("/listings/:id", async (req, res) => {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    console.log(listing);
    res.redirect("/listings");
})

app.get("/testlisting", async (req, res) => {

    let sample = new Listing({
        tittle: "my bnew villa",
        description: "by the beach",
        Image: "https://images.unsplash.com/photo-1728988914134-c14e15f91d8a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D link",
        price: 1200,
        locatin : "india, goa",
        country: "india",
    });

    await sample.save();
    console.log("listing saved");
    res.send("successfull testing");


})



app.listen(8080, () => {
    console.log("Server started on port 8080");
})