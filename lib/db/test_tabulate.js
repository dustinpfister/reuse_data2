import { db }  from './db.js';
import path from 'node:path';
import os from 'node:os'

db.tabulate({
   file_name: 'items.json',
   date_start: new Date(2026, 3, 6),
   date_end: new Date(2026, 3, 15)
}).then((result) => {
    console.log(result);
});

