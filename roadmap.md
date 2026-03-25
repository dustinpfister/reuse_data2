# Reuse Data2 Pricing System roadmap

## RX - Color Tag System

I have all ready wrote some code that works well as a way to provide a color tag system with my color tag patch that was in use for a few months to address the issue with data1 when lavender tags where removed. The first version of this patch would just set the color manually to a given color by injecting the code directly into the javaScript console, later revisions of the patch provided bookmarket and chrome extension forms of the patch that automated the process of setting the proper color. The more advanced revisions of the patch allowed for not only automation of setting the the tag color, but also configuration of the color tag system itself. Allowing for easy configuration of the system, will help to prevent future problems that have to do with changes such as the number of colors, the order of colors, the direction in which they cycle, and the start date, and frequency of change form one color to the next. 

## RX - 

## RX - User Permissions

There should be levels of permissions for various features of the data2 pricing system. For example most users should just have permission to post production data items to the database, but they should not be allowed preform any kind of task that has to do with backing up, or dropping the database. For now I think there should be three permission levels ( 0 - admin, 1 - manager, 2 - associate )

## RX - Race condition handling with item records

A problem may occur when two users post items at the same time. It might result in a situation in which two objects in a db.data.items will have the same record number. One way to resolve this would be to have some kind of lock variable that will be set to true the very moment that a request comes in, and then have it set back to false when the database is finished updating. Any additional requests that come in while the lock variable is true, will be pushed to a queue that will be checked each time an update finishes and will result in an additional update if there are in fact any times in the queue.

https://stackoverflow.com/questions/25297906/dealing-with-race-condition-in-transactional-database-table

## RX - database abstraction api

In time I would like to support more than one option when it comes to database solutions. The general idea I have here is to have a central main API that is used throughout the body of my back end code to make database calls. This central api will have core methods like createItem, deleteItem, ect, but it is the underlying code of the api that will work directly with whatever database solution is being used. This way the process of supporting a new database will just be a matter of creating a new set of functions for these core methods.

To start to have some idea as to why this is needed just look at the lnegth of this video: 
https://www.youtube.com/watch?v=4cWkVbC2bNE&t=137s

<!-- pending -->
* started a common api that will be used for the current lowdb database solution, as well as any future database solutions
* abstract lowdb specific code into the first example of an adapter that provides a 'core set of database method implementations'
* use new common database api for all back end code that makes calls to the database
* start an experimental mondodb adapter
* start an experimental PostgreSQL adapter

## RX - Authenticate with Google

At reuse we use google accounts as a way to log into the existing data1 pricing system.
