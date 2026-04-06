import { db }  from './db.js';
import path from 'node:path';
import os from 'node:os'

/*
db.get_dates_file({
   date: new Date(),
   file_name: 'items.json',
   file_data: { rec_num: 0, items: [] }
}).then((result) => {
    console.log(result.data);
});
*/

db.get_rel_file({
   dir_rel: '',
   file_name: 'conf.json',
   file_data: { id: 0, users: [] }
}).then((result) => {
    console.log(result.data);
});

