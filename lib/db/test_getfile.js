import { db }  from './db.js';
import path from 'node:path';
import os from 'node:os'

db.get_rel_file({
   dir_rel: '',
   file_name: 'conf.json',
   file_data: { id: 0, users: [] }
}).then((result) => {
    console.log(result.data);
});

