import path from 'node:path';
import os from 'node:os';
import { walk } from './fs_walker.js'

walk({

   dir: path.join( os.homedir(), '.data2' ),
   recursive : true,
   before_walk: (next) => {
       console.log('time to start walking');
       next();
   },
   for_file: (item, next) => {
       console.log('File: ' + item.path)
       next();
   },
   on_done: () => {
       console.log('Walking done.');
   }
});
