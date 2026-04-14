

## jskey_walker

This code is based off of the code for my old ['jskey-walk' project]( https://github.com/dustinpfister/jskey-walk/tree/master). The file system walker that I made for that project seems to work okay at least in the sense that the basic functionality that I want is there. That is that I can give a before walk, for file, and on done methods all of which call in order as desired. For the data2 project I just made a few improvements.

## fs_walker

This is a new file system walker that I started for the data2 project based off of the simple walker example that I made for my [blog post on this subject back in 2018](https://dustinpfister.github.io/2018/07/20/nodejs-ways-to-walk-a-file-system/). The example there is very basic, and does not cover things that come up such as error handing. I started to make something that is more in line with what I started working on for my [post on the fs.readdir method of the nodejs file system module specifically](https://dustinpfister.github.io/2018/07/20/nodejs-walking-a-file-system-with-fs-readdir/). 

