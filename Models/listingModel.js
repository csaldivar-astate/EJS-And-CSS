"use strict";
const db = require("./db");

function getNumberOfListings (word) {
    const sql = `SELECT count(*) as count FROM CarListings`;
    const stmt = db.prepare(sql);
    const numListings = stmt.get();
    return numListings.count;
}

function getAllListings () {
    // It's fine to hardcode this into the sql string rather than using a const
    // like this. I'm just doing it to show that you can parameterize any data
    // in the sql string. You'll need to for the pagination code.
    const limit = 20;
    const sql = `SELECT * FROM CarListings JOIN Users ON userID=seller ORDER BY listingID LIMIT @limit`;
    const stmt = db.prepare(sql);
    const rows = stmt.all({"limit": limit});
    return rows;
}

function getListingByID (listingID) {
    const sql = `SELECT * FROM CarListings JOIN Users ON userID=seller and listingID=@listingID`;
    const stmt = db.prepare(sql);
    const row = stmt.get({listingID});
    return row;
}

module.exports = {
    getNumberOfListings,
    getAllListings,
    getListingByID,
};