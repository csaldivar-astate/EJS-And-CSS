"use strict";
require("dotenv").config();

const express = require("express");
const app = express();

// Allow access to static resources in the public directory
app.use(express.static("public", {index: "index.html", extensions: ["html"]}));

// The maximum request body size is 100 kilobytes; however, my word list was
// ~150kb. So I just doubled the request body size limit
app.use(express.json({limit: '200kb'}));
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

// Load controllers
const listingController = require('./Controllers/listingController');

// Listing Endpoints
app.get("/", listingController.renderWelcome);
app.get("/listings", listingController.renderListings);
app.get("/listings/:listingID", listingController.renderSingleListing);


module.exports = app;