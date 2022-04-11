"use strict";

require('dotenv').config()          // Don't forget to set up environment variables
const fs = require("fs");           // fs module grants file system access
const db = require("../Models/db"); // We need our db connection

// First hydrate the Users table
let sql = fs.readFileSync(__dirname + "/hydrateUsers.sql", "utf-8");

// Now just run the sql file
db.exec(sql);

// And then the CarListings Table
sql = fs.readFileSync(__dirname + "/hydrateCars.sql", "utf-8");

// Now just run the sql file
db.exec(sql);