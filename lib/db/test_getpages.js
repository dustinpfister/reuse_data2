import { mkdir, access, constants } from 'node:fs/promises';
import { db }  from './db.js';
import path from 'node:path';
import os from 'node:os'

/*
access( path.join( os.homedir(), '.data3' ), constants.F_OK )
.then((a)=>{
    console.log('this still calls')
})
.catch((e)=>{
    console.log(e.code)
})
*/


db.get_pages({
   file_name: 'items.json',
   date_start: new Date(2026, 3, 16),
   date_end: new Date(2026, 3, 20)
}).then((collection) => {
    console.log(collection);
});

