import { db }  from './db.js';
import path from 'node:path';
import os from 'node:os'

db.get_date_file({
   date: new Date(),
   file_name: 'items.json',
   file_data: { rec_num: 0, items: [] }
}).then((result) => {
    console.log(result);
});


//console.log( path.join( os.homedir(), '.data2' ) );
