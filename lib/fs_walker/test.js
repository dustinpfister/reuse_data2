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
