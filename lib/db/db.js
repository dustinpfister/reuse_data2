import { mkdir } from 'node:fs/promises';
import path from 'node:path';

console.log(   )

const db = {}

db.make_date_dir = (dir_root = path.dirname( import.meta.url ), date = new Date() ) => {
    const year = date.getFullYear();
    const month = String( date.getMonth() + 1 ).padStart(2, '0');
    const day = String( date.getDate() ).padStart(2, '0');
    const dir_date = year + '/' + month + '/' + day;
    const dir  = path.join( dir_root, 'db/dates', dir_date  );
    return mkdir(dir, { recursive: true });
};

export { db }
