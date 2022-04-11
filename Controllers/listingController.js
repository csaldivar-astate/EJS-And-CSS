"use strict";

const listingModel = require("../Models/listingModel");

function renderWelcome (req, res) {
    const numListings = listingModel.getNumberOfListings();

    res.render("welcomePage", {"numListings": numListings});
}

function renderListings (req, res) {
    const listings = listingModel.getAllListings();

    res.render("listingsPage", {"listings": listings});
}

function renderSingleListing (req, res) {
    const listing = listingModel.getListingByID(req.params.listingID);

    if (!listing) {
        // Set the status to 404 Not Found if the listing wasn't found
        // but don't send the response yet.
        res.status(404);
    }

    // Regardless of the status code we will still render the same page
    // but the EJS template renders an error message if the listing wasn't found
    res.render("singleListingPage", {"listing": listing});
}

module.exports = {
    renderWelcome,
    renderListings,
    renderSingleListing,
};