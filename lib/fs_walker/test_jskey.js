import path from 'node:path';
import os from 'node:os';
import { walk, full_run } from './jskey_walker.js';


full_run({
   dir: path.join( os.homedir(), '.data2'),
   recursive: true,
   beforeWalk : (next) => {
       console.log('this should call before walking starts');
       next();
   },
   onDone : () => {
       console.log('done with walk of file system')
   },
   forFile : (item, next) => {
   
       console.log(item.path)
   
       next();
   }
})

