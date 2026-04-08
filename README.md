# Reuse Data2 Pricing System

The aim here is to create a 'data2' pricing system as a potential alterative option to the aging 'data1' system that is in use at Finger lakes Reuse. Although data1 is still working okay for what we have been using if for, there is a list of concerns. Two general ways of addressing these concerns are to refactor the data1 source code that is all ready in place, or start over from the ground up. With that said data2 is the later rather than the former.

* future proofed color tag system that allows for seamless changes
* a unit pricing database that can be updated/extended per user
* add, remove, and update locations ( IRC, MEGA, warehouse, ect )
* theme changes per location and department to help reduce data input errors
* customization on per department level ( housewares unit pricing displayed when housewares selected )

## Database

In time I would like to support at least two database options, one that is a local solution that will work with nodejs alone, and at least one more that might prove to be better for use in production. For the local solution I am going with [lowdb](https://github.com/typicode/lowdb) which will work just fine for the simple to set up and use solution for database. Although this might not be the most professional solution to handle database needs, it might still work well enough.

