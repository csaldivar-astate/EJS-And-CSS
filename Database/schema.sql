CREATE TABLE IF NOT EXISTS Users (
    userID TEXT PRIMARY KEY,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    createdOn TEXT NOT NULL,
    bio TEXT
);

CREATE TABLE IF NOT EXISTS CarListings (
    listingID TEXT PRIMARY KEY,
    seller TEXT NOT NULL,
    price REAL NOT NULL CHECK (price > 0),
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL CHECK (year > 1884),
    FOREIGN KEY (seller)REFERENCES Users(userID)
);