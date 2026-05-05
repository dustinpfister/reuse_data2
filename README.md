# Reuse Data2 Pricing System

The aim here is to create a 'data2' pricing system as an alternative software option to the aging 'data1' system that is in use at Finger lakes Reuse. Although data1 is still working okay, there are a few known issues, and the system is not being actively maintained. Two general ways of addressing these concerns are to refactor the data1 source code that is already in place, or start over from the ground up. With that said data2 is a total rebuild rather than starting to support a fork of data1.

Working Features in place thus far as of R0 :

* working on top of nodejs and express.js when it comes to the back end system.
* support for more than one front end system starting with the 'vanilla' system
* Authentication by way of passport.js local strategy
* In house database solution that stores data as json files in nested folders at ~/.data2
* Future proofed color tag system that allows for seamless changes

## Database

The long term plan is to look into both SQL, and non-SQL options for database solutions. However there is a lot to take in with this subject, so for the moment I have started to put together my own solution for database software. The in house database solution works by creating a hidden ‘.data2’ folder in the home directory of the servers file system under the user to which data2 is running. There is then a dates folder within .data2 which in turn contains additional nested folders for each day of each month of each year. This .data folder is also being used to store configuration data for the deployment, and in time all other locally stored data.

## Client Systems

I have started to structured the data2 web application in a way that will allow for more than one client system. I have done so because I think it is important to have at least two options, if not more for client systems that make use of the same common back end system. This way of there is a problem with one system, but the other is still working okay, one can just switch to the one that is working fine.

### vanilla

For now I am just working on the development of what I have called the 'vanilla' client system that is just a basic, no thrills, boring yet function client system that is built up with what front end developers often refer to as 'vanilla javaScript'. This vanilla javaScript is a term that is used to when a client system is built up from the ground up, without the use of any kind of front end framework such as vue.js or react. Apart from that the aim with this client system option is to create a simple, tired yet true option for a client system, rather than a system that is packed to the brim with features, but might prove to be a little buggy.

