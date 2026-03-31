# Reuse Data2 Pricing System roadmap

## RX - custom error messages for login page

I tried to find a way to have custom error messages sent when auth does not work, but it seems like passport will always send a response that does not contain any custom data.

```
     app.get('/protected', function(req, res, next) {
       passport.authenticate('local', function(err, user, info) {
         if (err) { return next(err) }
         if (!user) { return res.redirect('/signin') }
         res.redirect('/account');
       })(req, res, next);
     });
```

## RX - edit items

It might be nice to be able to edit an item in place rather than delete and add back again

* (      ) can edit an item action

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
