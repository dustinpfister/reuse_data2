import { mkdir, access, constants } from 'node:fs/promises';
import { db }  from './db.js';
import path from 'node:path';
import os from 'node:os'

db.get_pages({
   file_name: 'items.json',
   date_start: new Date(2026, 3, 1),
   date_end: new Date(2026, 3, 20),
   items_per_page: 3
}).then((collection) => {
    console.log(collection);
});

