# Reuse Data2 Pricing System changelog

## () R1 - 

<!-- Pending -->


## () R0 - Starting with node.js, express.js, passport.js, lowdb, and R7 Color Tag Fix Code

The main thing I would like to get up and running right away will be reusing the code that I worked out for the data1 color tag fix as the color tag system for data2. This patch has all ready proven itself in production, and as such should work well as the color cycle system for the data2 backend. Additional changes can be made right off the bat to help address any future changes with the color cycle. This was something that I was all ready working on with the latest revision of the color tag patch anyway.

After the color tag system another important aspect is the database software and design. For now I am going to start off with a simple in house database solution that works on top of something called 'lowdb'. This in house database solution is a bit of a place holder while I do more research on database software as there is a lot to take it with that. So for now all production data, user info, and configuration settings are all stored as json files off of a '.data' folder that is stored in the home folder of the posix system user account in which data2 runs. If this database solution actually does work okay in production, great, otherwise a more professional SQL or non-SQL solution will be used in future revisions.

As for authentication 'passport.js' is being used, however thus far only with the local authentication strategy in place. With this strategy User credentials are then stored in the '.data2' home folder along with all other local data. Authentication by way of a google account, or any OAuth provider for that matter is another matter that may be addressed in future revisions.

<!-- pending changes -->

<!-- Settings in vanilla client system -->
* can create a new color cycle object in in settings and post it to the server
* display color status object info as relative positioned dives rather than a table

<!-- server side validation of color status objects -->
* have server side validation of posted color status objects
* remove front end DEFAULT\_CONF in json tools file of vanilla system

<!-- index.ejs  -->
* make it so that index.ejs is used for all page requests and the current page is a part of the local object

<!-- Done -->
* global
  * working on top of nodejs 24.x LTS
  * using express.js 5.x for a sever side web app framework.
  * using lowdb as a 'local only' database solution
  * using passport.js with passport-local authentication strategy.
  * using ejs for sever side rendering of HTML.
* /public, /views
  * client system started using just vanilla js ( no front end framework used )
  * can select a price and count when pricing items
  * can select color tag type when posting an item
  * display current printing color in client, and encoding current color into price type
  * started ejs templates for root, login, and signup
  * display user name on index
  * have a logout option on the index page
  * displaying error messages on login page if there is a problem
  * display discount and cull colors in client
  * started a part view folder and a header ejs part
  * start a nav ejs part and use that for root and department paths
  * sub folders in views to support more than one client system option by calling the current view 'vanilla'
  * started a common json_tools.js file for vanilla client system
  * vanilla client system can be used to set a date range for pages in pricing
  * started a settings route that will be used to update the main conf.json
  * can view current color cycle status in settings
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
  * create items database at ~/.data2/dates/yyyy/mm/dd/items.json
  * can create files like '~/data2/conf.json' with new db lib method
  * started a db.tabulate method that can be used to add up the value of items
  * started a db.get_pages method that uses fs walker to create a custom data collection for a date range
* /lib/fs\_walker:
  * started a new file system walker lib that I will want for walking over the .data2 folder.
  * default options for js walker such as recursive walking by default
  * added time info for jskey walker that is given to the on done method
  * have it so that get pages will not create new folders for dates that are not there
* /routes
  * started a /routes folder made an index.js for it to use for root path in app.js 
  * using /routes/auth.js for auth logic
  * started a /routes/json.js file
  * calling new get db items method on each call for json, rather than having a local variable
  * can use a /json?mode=items&ds=20260325&&de=20260325&ipp=10 to give a start date, end date, and item count per page
  * can use /json?mode=items&au=true&ds=20260325&&de=20260325&ipp=10 to get items in date range for all users
  * started a /routes/pricing.js file, and with it separate client javascript for root and pricing paths
  * updated pricing client system so that pages of items can be explored
