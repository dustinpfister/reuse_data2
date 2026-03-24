# Reuse Data2 Pricing System changelog

## () - R0 - Started using express.js, lowdb, Color Tag Fix Code, and passport.js local authentaction strategy

The goal with R0 is to just have a crude, yet functional start of this project. I do not intend to get everything working just the way that it should right away, but everything that needs to work should work right off the bat. For example what I mean by that is that I do not need to go with a database solution that is appropriate for a production environment, but I do still need to use a database solution of some kind at least. The same should go for things like user authentication where logging in with a google account can be a pass for now, but I will still need at least a local authentication strategy. These are the two major road blocks that I want to at least get started with in R0, and refine in later revisions.

An additional thing that I would like to get up and running right away will be reusing the code that I worked out for the data1 color tag fix as the color tag system for data2. This hot fix has all ready proven itself in production, and as such should work well as the color tag system for the data2 backend. Additional changes can be made right off the bat to help address any future changes with the color tag system as well. This is something that I was all ready working on with the latest revision of the data1 color tag hot fix anyway.

* ( done ) using express.js 5.x for a sever side web app framework on top of nodejs.
* ( done ) using lowdb as a local nodejs only database solution
* ( done ) have a /json path that will sent the current state of the db as json, and can also be used to handle post requests as well
* ( done ) start a client system for posting, and getting pricing data
* ( done ) record numbers and department fields for each item
* ( done ) can select a price and count when pricing items
* ( done ) can use url params for /json path to change what the json response is starting with a config list option
* ( done ) use the /json config list to get current departments, prices, and counts in client system
* ( done ) post and store department index for items

<!-- pending -->


* (      ) can delete an item
* (      ) Include color tag system used for Reuse Color tag Fix
* (      ) have a conf.json for setting up departments and pricing options
* (      ) use passport.js as way to log into data2 using a local authentication strategy.
* (      ) tag all pricing data with a user name that made the post


