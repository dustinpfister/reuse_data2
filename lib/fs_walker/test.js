import path from 'node:path';
import os from 'node:os';
import { walk } from './fs_walker.js'

//const opt = db.parse_opt();

walk.get_list( path.join( os.homedir(), '.data2') )

/*
walk.real_time( {
   dir: path.join( os.homedir(), '.data2'),
   on_file: (result) => {
       //console.log(result.item_path)
       //const arr = result.item_path.split('/');
       //const date_str = arr.slice(arr.length - 4, arr.length - 1).join('/')
       //console.log( date_str )
   }
});
*/
