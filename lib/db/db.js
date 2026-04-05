import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { Low } from 'lowdb';
//!!! There should be a better way to do this
import { JSONFileSyncPreset } from '../../node_modules/lowdb/lib/presets/node.js';

const DIR_DEFAULT = path.join( path.dirname( import.meta.dirname ) , 'db'); 

const db = {}

db.make_date_dir = ( dir_root = DIR_DEFAULT, date = new Date() ) => {
    const year = date.getFullYear();
    const month = String( date.getMonth() + 1 ).padStart(2, '0');
    const day = String( date.getDate() ).padStart(2, '0');
    const dir_date = year + '/' + month + '/' + day;
    const dir  = path.join( dir_root, 'db/dates', dir_date  );
    return mkdir(dir, { recursive: true })
    .then((a)=>{
        return {
            dir : dir,
            dir_root: dir_root
        }
    });
};

db.get_date_file = ( dir_root = DIR_DEFAULT, date = new Date(), fn='data.json', def = { } ) => {
    return db.make_date_dir( dir_root, date ).then( ( result ) => {
        const file_path = path.resolve( result.dir, fn );
        const db_file = new JSONFileSyncPreset(file_path, def);
        db_file.write();
        return db_file;
    });
};

db.get_items = ( dir_root = DIR_DEFAULT, date = new Date() ) => {
    return db.get_date_file(dir_root, date, 'items.json', { rec_num: 0, items: [] } )
};

export { db }
