# Reuse Data2 Pricing System changelog

## () - R0 - Starting with node.js, express.js, passport.js, lowdb, and R7 Color Tag Fix Code

The main thing I would like to get up and running right away will be reusing the code that I worked out for the data1 color tag fix as the color tag system for data2. This patch has all ready proven itself in production, and as such should work well as the color tag system for the data2 backend. Additional changes can be made right off the bat to help address any future changes which was something that I was all ready working on with the latest revision of the color tag patch anyway.

After that additional goals with R0 is to just have a crude, yet functional start of the project. This means for example that I do not need to go with a database solution that is appropriate for a production environment, but I do still need to use a database solution of some kind at least. The same should go for things like user authentication where logging in with a google account can be a pass for now, but I will still need at least some kind of local authentication strategy in place. These are the two major road blocks that I want to tackle right away out of the gate with R0.

<!-- Done -->
* global
  * working on top of nodejs 24.x LTS
  * using express.js 5.x for a sever side web app framework.
  * using lowdb as a 'local only' database solution
  * using passport.js with passport-local authentication strategy.
  * using ejs for sever side rendering of HTML.
* /html, /views
  * client system started using just vanilla js ( no front end framework used )
  * can select a price and count when pricing items
  * can select color tag type when posting an item
  * display current printing color in client, and encoding current color into price type
  * started ejs templates for root, login, and signup
  * display user name on index
  * have a logout option on the index page
  * displaying error messages on login page if there is a problem
  * display discount and cull colors in client
* /app.js 
  * have a /json path that will respond to GET requests for database, and config data for the client system
  * the /json path can also handle POST requests for sending data to the sever form the client system
  * record numbers and department fields for each item record in the items database
  * can use url params for /json path to change what the json response when using a GET request
  * can use /json?mode=config to get current departments, prices, and so forth
  * can delete an item by using a POST request to /json path using a new delete mode with proper request body format
  * have a /json?mode=color path to get the current color status
  * have a /json?mode=color&y=yyyy&m=mm&d=dd path to get color status for any date
  * redirect to login page if not signed in
  * check username and password when logging in
* /lib/color_cycle: 
  * new color tag system based on source code from R7 of 'Reuse Color tag Fix' project
  * have a method to create and return a 'color status object'
  * for color conf have an automatic boolean and a manual color to use when automatic is to to false
* /lib/db:
  * started a /lib/db/db.js library that will serve as the current database solution
  * have a db.make\_date\_dir method to create a /db/yyyy/mm/ folder

<!-- lib/db -->
* use new db folder to hold users at /db/users.conf
* use new db folder to hold users at /db/conf.conf
* 

<!-- /json path -->
* can use /json?mode=items&sd=20260325&&sd=20260325&rows=10 to give a start date, end date, and item count per page
* can use /json?mode=users&username=username to display info about a user

<!-- database import and export -->
* see about converting db.json files to db.csv files
* have a conf.json for setting up departments and pricing options

<!-- /conf path -->
* start a /conf path that can be used to configure conf.json and user settings
* can add and remove locations to the conf.json file
* can set what a default location for a user is in the conf.json file
* can change aspects of the theme by way of location setting
* can update color tag settings for conf.json

<!-- /conf/users?username=name -->
* can set user settings for any user by using ?username=name query string
* can update the password for the current user
* can update the location for the current user
* can get a list of all users by using ?list=true query string

<!-- /users path -->
* started a users path that can be used to explore info about users

<!-- color tag outlook -->
* have a color tag outlook view for the last month, current month, and next month in root


<!-- nav, /, and /departments -->
* start a nav ejs part and use that for root and pricing paths
* /departments?current=households&mode=pricing&location=irc
* have a /db/items/yyyy/mm/dd/donation_ticks.json file

## () - R1 - QR codes, Printing price tags, main nodejs lib folder

<!-- do not use memory store -->
* (      ) - connect lowdb for session store https://www.npmjs.com/package/connect-lowdb
* (      ) - have a db_session.json file to store all current user sessions

<!-- login, signup, and auth -->
* (      ) - using crypto.pbkdf2Sync with 64-bit sha-512 digest for hashing passwords
* (      ) - inform the user as to what went wrong if a mistake is made when signing up

<!-- server side sanitation -->
* (      ) - post request body values need to be subject to sanitation
* (      ) - the json response should contain a mess the explains why sanitation fails 
* (      ) - valid values for price_type are unit, white, and color any other posted will result in an error

<!-- qr codes -->
```
https://github.com/soldair/node-qrcode/tree/master
```

<!-- printing  -->
* (     ) - when adding items to db, have the option to print
```js
//https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries/Printing
document.getElementById("print_external").addEventListener("click", () => {
  const hideFrame = document.createElement("iframe");
  hideFrame.onload = setPrint;
  hideFrame.style.display = "none"; // hide iframe
  hideFrame.src = "external-page.html";
  document.body.appendChild(hideFrame);
});
```

