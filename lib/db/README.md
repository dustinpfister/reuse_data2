# db lib for data2

This is a lib to help work with the local database solution that i started out with in R0 of the project. At some point in the future this might end up being replaced with something else such as mongodb, or some sql solutuon. Unless this local solution works out okay for the long term in which case this is the final database solution for data2.

The database system works by creating a main 'db' folder, there is then a years folder that will contain nested folders for all dates where items where added by users. A main users and conf database files are also placed at the root of the database folder.
