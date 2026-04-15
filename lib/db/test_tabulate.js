import { db }  from './db.js';
import path from 'node:path';
import os from 'node:os'

db.tabulate({
   file_name: 'items.json',
   date_start: new Date(2026, 3, 6)
}).then((result) => {
    console.log(result);
});

