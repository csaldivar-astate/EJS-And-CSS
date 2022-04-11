# EJS & CSS

This mock project is for a car reselling web app. Users can list cars for sale and prospective buyers can search them. I have already included mock data for 500 user accounts and 1,000 listed cars. I've also included the file `hydrate-db.js` and npm scripts that will hydrate the database with this data when you run `start-dev`. 

I've also included the completed `schema.sql` be sure to read it so you can familiarize yourself with the application's data model.

To help you, I've already written the controller, model and view (full MVC implementation) for the endpoints for displaying "listings". `listingController.js`, `listingModel.js`, `listingsPage.ejs`, `singleListingPage.ejs` and `welcomePage.ejs` are all written for you. Use these as examples for the rest of the assignment. **Do not modify them.** (unless you implement paging)

## Setup

Don't forget to enable the `ejs` view engine. Review the slides on server-side rendering. `app.set("view engine", "ejs");` Place this line of code before route handling endpoints but after all global middleware has been registered.

Once this line is added you should be able to run the server and view the welcome page, listings page and individual listing pages.

## Step 1: User Model


Create a new file called `userModel.js` and create 3 functions.

### `getAllUsers`

This function takes no parameters and should return an array of all user accounts in the database.

### `getUserById`

This function takes the `userID` as a parameter and returns the user account with the matching id or `undefined` if the account is not found.

### `updateBio`

This function takes the `userID` and `newBio` as parameters. It will update the `bio` column of the user account with the matching id. It returns nothing.

## Step 2: User Controller

Create a new file called `userController.js` and create 3 functions.

### `renderDirectory`

This function will get all of the user accounts from the database and render them using the `directoryPage` view. Pass the array in an object using the key `"users"`;

### `renderAccount`

This function will get a specific user account using the `userID` from the database and render it using the `accountPage` view. The user id will be a **route parameter** and it will use the key `userID`. Pass the account info in an object using the key `"user"`;

### `updateBio`

This function will update the bio of a specific account using the `userID`. The user id will be a **route parameter** and it will use the key `userID`. The `bio` will be in the **request body** and will use the key `bio`. Redirect the user back to the account page using `res.redirect()`.

Keep in mind that the "account page" URL path is: 

```
             ┌─────── Assuming their user ID is: 0b6f15e7-8d93-4dc6-a463-39c14d612eb2
             ▼
/users/0b6f15e7-8d93-4dc6-a463-39c14d612eb2
```

You **should not** hardcode this specific userID. Rather use a template literal to inject the userID from the request into the URL path.


## Step 3: The Views

Use the EJS files I provided as a guide.

### `directoryPage.ejs`

Create a new file in the `Views` directory called `directoryPage.ejs`. This template file will be used to display all of the user accounts. Add a `link` element for the css file `users.css` in the `head` element. This will give your page the default styling so you can compare your page to the correct page. **DO NOT MODIFY THE CSS FILE.**

Look back at the `renderDirectory` function in `userController.js`. You will be able to access the array by using `users`.


**This is not HTML code! It is just an example outline.**
```
ul class="usersContainer"
    a href="/users/USER_ID" class="user"
     li
        div class="row"
            p
                FIRST_NAME LAST_NAME
            p
                EMAIL
        <If the user account has a bio>
            p class="bio"
                BIO
        <if they don't have a bio>
            p class="bio"
                No bio
        p
            User since: CREATED_ON
```
Replace the bits in all uppercase with the appropriate info from each user account. You will need to use a for loop to iterate over each user account in the `users` array. 

If the user account has a bio then display it; otherwise, display the text `No bio`.

### `accountPage.ejs`

Create a new file in the `Views` directory called `directoryPage.ejs`. This template file will be used to display all of the user accounts. Add a `link` element for the css file `users.css` in the `head` element. This will give your page the default styling so you can compare your page to the correct page. **DO NOT MODIFY THE CSS FILE.**

Look back at the `renderDirectory` function in `userController.js`. You will be able to access the array by using `users`.


**This is not HTML code! It is just an example outline.**
```
div class="row"
    p
        FIRST_NAME LAST_NAME
    p
        EMAIL

form action="/users/USER_ID" method="post"
    div
        textarea name="bio"
            USER_BIO || ""
    button
        Save Bio
    
```
Replace the bits in all uppercase with the appropriate info from each user account. `USER_BIO || ""` means either insert the user's bio or the empty string if they don't have the bio. You can use the `||` operator for this (you really just need to replace `USER_BIO`);

## Step 4: The validator

Create a new file called `validators.js` and make a validation middleware function for the update bio endpoint. It will need to ensure that the `bio` property is in the body and that it is a string. You must allow the empty string (this is not allowed by default).

I've added a file called `validatorGenerator.js` (**DO NOT MODIFY THIS FILE**) that exports a `makeValidator` function. This function takes two parameters: the schema and a string. The string **must be** `"body"`, `"query"`, or `"params"`. If you feel comfortable then you can use this function or you can ignore it and just do `joi` validation as shown in the slides and previous videos/assignments.

## Step 5: Bringing it all together

Now in your `app.js` file you will need to add the following three endpoints:

- `GET /users`
- `GET /users/:userID`
- `POST /users/:userID/bio`

Use the appropriate controller route handler for each endpoint. Don't forget to validate the request for `POST /users/:userID/bio`.

## Challenge: Implementing Pagination

You may have noticed that in `listingModel.js` the `getAllListings()` functions actually only returns the first `20` listings and the welcome page says there are `1,000` listings total.

You could remove the `LIMIT` clause from the sql query; however, this would not be a very good idea. Imagine wasting your server bandwidth (and the user's bandwidth) loading 1,000 listings every time they click on the listings page. What if we had 10,000 or 100,000 listings? The problem just gets worse.

We **should** implement "pagination" or "paging". Paging means we split the data into "pages" and send only one page worth of data at a time. 

You may be more familiar with the common UI element used for paging. 
![https://miro.medium.com/max/638/1*F4X8aQyw3Ik7iINPg4AAbQ.png](https://miro.medium.com/max/638/1*F4X8aQyw3Ik7iINPg4AAbQ.png)

The client request will include the page number and the server will use that to calculate the offset in the data.

For example, let's say we want to restrict the data to 50 listings per page. If the user is on the first page then we use the query:

```sql
-- You should include the ORDER BY clause so the database always uses the same ordering
SELECT * 
FROM 
    CarListings 
JOIN 
    Users ON userID=seller 
ORDER BY listingID 
LIMIT 50 OFFSET 0
```

However, when they move to the next page we need to skip the **first** `50` listings and get the **next** `50` listings.

```sql
-- You should include the ORDER BY clause so the database always uses the same ordering
SELECT * 
FROM 
    CarListings 
JOIN 
    Users ON userID=seller 
ORDER BY listingID 
LIMIT 50 OFFSET 50
```

This will skip the first `50` elements and give us the next `50` elements. Now on the third page we need to skip the first `100` listings and get the next `50` listings.

```sql
-- You should include the ORDER BY clause so the database always uses the same ordering
SELECT * 
FROM 
    CarListings 
JOIN 
    Users ON userID=seller 
ORDER BY listingID 
LIMIT 50 OFFSET 100
```

And on and on; you get the idea. Essentially, only the offset changes between pages. We need to know with the requested page is and the limit amount to calculate the offset. For example, here the page number is `3` and the limit size is `50` so the offset is `(3 - 1) * 50 = 100`.

### Modify the controller

In `listingController.js`, modify the `renderListings()` function so that it gets the `page` and `limit` keys from the **request query** (recall that GET requests cannot use the body). `page` will be the page number (starting from `1`) and `limit` will be the limit amount (so the user can choose how many listings to see per page).

The `page` and `limit` query parameters are optional. So if they aren't included then just send back the first `20` listings like normal. Otherwise, use pagination.

### Validating the request

You'll need to validate the query parameters for this function. So create a new middleware function in `validators.js` but be sure to validate the `req.query` and not `req.body`.

The parameters are:

- `page`
  - number
  - integer
  - minimum value of 1
- `limit`
  - number
  - integer
  - minimum value of 5
  - maximum value of 250
- If either parameter is present then the other must be present too
  
The last bullet means:

```
These URLs are valid:
localhost:8080/listings
localhost:8080/listings?page=1&limit=20
localhost:8080/listings?limit=20&page=4

These URLs are not valid:
localhost:8080/listings?page=1
localhost:8080/listings?limit=20
```

You can use joi's `object.and()` validation to implement the last bullet: https://joi.dev/api/?v=17.6.0#objectandpeers-options


### Update the model

In `listingModel.js` create a new function called `getListingsByPage()`. It should take two parameters: `pageNumber` and `limit`. Then calculate the correct offset and use the paginated query shown previously to get the appropriate data.

### Updating the UI

Now you need to add an HTML form in the `listingsPage.ejs`. This form will allow the user to enter the page number and the limit amount. When they click submit you will send a GET request to the appropriate endpoint and render the page.


## Final Directory Structure

By the end of the assignment this should be your directory structure (`package-lock.json`, `node_modules/`, `tests/`, `.git/`, `README.md` and `.vscode/` are not listed)

```
.
├───Controllers
│   ├───listingController.js       
│   └───userController.js
├───Database
│   ├───CarStacks.db
│   ├───hydrate-db.js
│   ├───hydrateCars.sql
│   ├───hydrateUsers.sql
│   ├───init-db.js
│   └───schema.sql
├───Models
│   ├───db.js
│   ├───listingModel.js
│   └───userModel.js
├───public
│   └───css
│       ├───listings.css
│       └───users.css
├───Validators
│   ├───validatorGenerator.js
│   └───validators.js
├───Views
│   ├───accountPage.ejs
│   ├───directoryPage.ejs
│   ├───listingsPage.ejs
│   ├───singleListingPage.ejs
│   └───welcomePage.ejs
├───.env
├───app.js
├───package.json
└───server.js
```