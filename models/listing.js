// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const listingSchema = new Schema({
//     title:{
//         type: String,
//         required: true
//     },
//     description: {
//         default: "https://images.unsplash.com/photo-1728988914134-c14e15f91d8a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         type: String,
//         set: (v) => v === "" ? "https://images.unsplash.com/photo-1728988914134-c14e15f91d8a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D " : v
//     },
//     Image: String,
//     price: Number,
//     locatin : String,
//     country: String,
// });
//  const Listing = mongoose.model("Listing", listingSchema);
//  module.exports = Listing;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        filename: {
            type: String, // You can store the filename or a descriptive name if needed.
            required: true
        },
        url: {
            type: String, // URL of the image
            required: true
        }
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    }
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
