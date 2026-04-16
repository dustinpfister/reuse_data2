# Reuse Data2 Pricing System

The aim here is to create a 'data2' pricing system as an alternative backup/replacement option to the aging 'data1' system that is in use at Finger lakes Reuse. 

Although data1 is still working okay for what we have been using it for, there is a list of known issues, and the system is not being actively maintained. Two general ways of addressing these concerns are to refactor the data1 source code that is already in place, or start over from the ground up. With that said data2 is a total rebuild rather than a hack job of what is already in place.

Working Features in place thus far :

* Authentication by way of passport.js local strategy
* In house database solution that stores data as json files in nested folders at ~/.data2
* Future proofed color tag system that allows for seamless changes

## Database

The long term plan is to look into both SQL, and non-SQL options for database solutions. However there is a lot to take in with this subject, so for the moment I have started to put together my own solution for database software. The in house database solution works by creating a hidden ‘.data2’ folder in the home directory of the servers file system under the user to which data2 is running. There is then a dates folder within .data2 which in turn contains additional nested folders for each day of each month of each year. This .data folder is also being used to store configuration data for the deployment, and in time all other locally stored data.



