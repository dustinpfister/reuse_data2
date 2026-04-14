

## jskey_walker

This code is based off of the code for my old ['jskey-walk' project]( https://github.com/dustinpfister/jskey-walk/tree/master). The file system walker that I made for that project seems to work okay at least in the sense that the basic functionality that I want is there. That is that I can give a before walk, for file, and on done methods all of which call in order as desired. 

## fs_walker

This is a new file system walker that I started for the data2 project based off of the simple walker example where. For the data2 project I started with my old jskey\_walker project, and then just made a few improvements for things like what is being exported, additional options, default options, and info that is given in the on done method. I also removed code that I do n ot think I will be using for the data2 project, or should just be code that is additional code that uses this project, mainly the load script method.

```js
import path from 'node:path';
import os from 'node:os';
import { walk } from './fs_walker.js'
walk({
   dir: path.join( os.homedir() ),
   recursive : true,
   before_walk: (next) => {
       console.log('time to start walking');
       next();
   },
   for_file: (item, next) => {
       console.log('File: ' + item.path)
       next();
   },
   on_done: (t) => {
       const secs = t / 1000;
       console.log('Walking done. ' + secs.toFixed(4));
   }
});
```

