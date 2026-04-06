import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os'
import { Low } from 'lowdb';
//!!! There should be a better way to do this
import { JSONFileSyncPreset } from '../../node_modules/lowdb/lib/presets/node.js';

const OPTIONS_DEFAULT = {
   dir : path.join( os.homedir(), '.data2' ),
   date: new Date(2026, 0, 1, 0, 0, 0, 0, 0),
   file_name: 'data.json',
   file_data: {}
};

const parse_opt = ( opt = {} ) => {
    return Object.assign({}, OPTIONS_DEFAULT, opt)
};

const db = {}

db.make_date_dir = ( opt = {} ) => {
    opt = parse_opt( opt );
    const year = opt.date.getFullYear();
    const month = String( opt.date.getMonth() + 1 ).padStart(2, '0');
    const day = String( opt.date.getDate() ).padStart(2, '0');
    const dir_date = year + '/' + month + '/' + day;
    const dir  = path.join( opt.dir, 'dates', dir_date  );
    return mkdir(dir, { recursive: true })
    .catch( (e) => {
        return { dir : dir, opt: opt, e: e }    
    })
    .then( ( a ) => {
        return { dir : dir, opt: opt, e: null }
    });
};

db.get_date_file = ( opt = {} ) => {
    opt = parse_opt( opt );
    return db.make_date_dir( opt ).then( ( result ) => {
        const file_path = path.resolve( result.dir, opt.file_name );
        const db_file = new JSONFileSyncPreset(file_path, opt.file_data);
        db_file.write();
        return db_file;
    });
};

export { db }
