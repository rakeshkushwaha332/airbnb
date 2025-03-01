const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const listingRoutes = require("./routes/listing"); // Import the listings router
const { console } = require("inspector");

const MONGO_URL = "mongodb://localhost:27017/wonderlust";

main().then(() => console.log("Database connected")).catch((err) => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

app.use(express.static('public'));
app.use(express.static(__dirname + '/public/css/'));

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitalized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};


app.use(session(sessionOptions));
app.use(flash());


// flash message 
app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    console.log(res.locals.success)
    next();
});
// Home route
app.get("/", (req, res) => {
    res.send("Hi, I am root");
});

// Use listings routes
app.use("/listings", listingRoutes);

app.listen(8080, () => {
    console.log("Server started on port 8080");
});
