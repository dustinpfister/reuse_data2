# Reuse Data2 Pricing System changelog

## () - R0 - Starting with node.js, express.js, passport.js, lowdb, and R7 Color Tag Fix Code

The goal with R0 is to just have a crude, yet functional start of the project. I do not intend to get everything working just the way that it should right away, but everything that needs to work should work right off the bat. For example what I mean by that is that I do not need to go with a database solution that is appropriate for a production environment, but I do still need to use a database solution of some kind at least. The same should go for things like user authentication where logging in with a google account can be a pass for now, but I will still need at least a local authentication strategy. These are the two major road blocks that I want to at least get started with in R0, and refine in later revisions.

An additional thing that I would like to get up and running right away will be reusing the code that I worked out for the data1 color tag fix as the color tag system for data2. This hot fix has all ready proven itself in production, and as such should work well as the color tag system for the data2 backend. Additional changes can be made right off the bat to help address any future changes with the color tag system as well. This is something that I was all ready working on with the latest revision of the data1 color tag hot fix anyway.

* ( done ) - working on top of nodejs 24.x
* ( done ) - using express.js 5.x for a sever side web app framework on top of nodejs.
* ( done ) - using lowdb as a local nodejs only database solution
* ( done ) - have a /json path that will send the db as json, and can also be used to handle post requests
* ( done ) - start a client system for posting, and getting pricing data
* ( done ) - record numbers and department fields for each item
* ( done ) - can select a price and count when pricing items
* ( done ) - can use url params for /json path to change what the json response is starting with a config list option
* ( done ) - use the /json config list to get current departments, prices, and counts in client system
* ( done ) - post and store department index for items
* ( done ) - can delete an item by posing to /json path using a new delete mode
* ( done ) - can select color tag type when posting an item

<!-- price type selection -->
* (      ) - include color tag system used for Reuse Color tag Fix

<!-- passport.js user auth -->
* (      ) - use passport.js as way to log into data2 using a local authentication strategy.
* (      ) - tag all pricing data with a user name that made the post
* (      ) - only display items for the current user that is logged in

<!-- server side sanitation -->
* (      ) - post request body values need to be subject to sanitation
* (      ) - the json response should contain a mess the explains why sanitation fails 
* (      ) - valid values for price_type are unit, white, and color any other posted will result in an error

<!-- database design -->
* (      ) - can use /json?sd=20260325&rows=10 to give a start date and number of items to display per page
* (      ) - have a database file for each day of the year
```js
// https://stackoverflow.com/a/40975730
function daysIntoYear(date){
    return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
}
```
* (      ) - see about converting db.json files to db.csv files
* (      ) - have a conf.json for setting up departments and pricing options


