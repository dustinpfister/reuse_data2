import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { Low } from 'lowdb';
import { walk } from '../fs_walker/fs_walker.js'
// There should be a better way to do this
// import { JSONFileSyncPreset } from '../../node_modules/lowdb/lib/presets/node.js';
// looks like there is, just have to look at the exports of the package.json file
import { JSONFileSyncPreset } from 'lowdb/node';

const OPTIONS_DEFAULT = {
   dir : path.join( os.homedir(), '.data2' ),
   dir_rel: '',
   date: new Date(2026, 0, 1, 0, 0, 0, 0, 0),
   file_name: 'data.json',
   file_data: {}
};

const parse_opt = ( opt = {} ) => {
    return Object.assign({}, OPTIONS_DEFAULT, opt)
};

const make_dir = ( opt={}, rel_path="/foo" ) => {
    opt = parse_opt( opt );
    const dir = path.join( opt.dir, rel_path  );
    return mkdir(dir, { recursive: true })
    .catch( (e) => {
        return { dir : dir, opt: opt, e: e }    
    })
    .then( ( a ) => {
        return { dir : dir, opt: opt, e: null }
    });
};

const make_dates_dir = ( opt = {} ) => {
    opt = parse_opt( opt );
    const year = opt.date.getFullYear();
    const month = String( opt.date.getMonth() + 1 ).padStart(2, '0');
    const day = String( opt.date.getDate() ).padStart(2, '0');
    return make_dir(opt, 'dates/' + year + '/' + month + '/' + day );
};
 
const db = {};

db.parse_opt = parse_opt;

// get a file for a specific date in the .data2 folder
db.get_dates_file = ( opt = {} ) => {
    opt = parse_opt( opt );
    return make_dates_dir( opt ).then( ( result ) => {
        const file_path = path.resolve( result.dir, opt.file_name );
        const db_file = new JSONFileSyncPreset(file_path, opt.file_data);
        db_file.write();
        return db_file;
    });
};

// get a file relative to the .data2 folder location by way of the given dir_rel, and file_name options
db.get_rel_file = ( opt = {} ) => {
    opt = parse_opt( opt );
    return make_dir(opt, opt.dir_rel).then( ( result ) => {
        const file_path = path.resolve( result.dir, opt.file_name );
        const db_file = new JSONFileSyncPreset(file_path, opt.file_data);
        db_file.write();
        return db_file;
    });
};

const make_date_array = ( sd, ed ) => {
    let day_delta = 0;
    let d = new Date( sd.getTime() );
    const dates = [];
    while( d.getTime() <= ed.getTime()   ){
        dates.push( d );
        day_delta += 1;
        d = new Date( sd.getFullYear(), sd.getMonth(), sd.getDate() + day_delta );
    }
    return dates;
}

db.tabulate = (opt={}) => {
    opt = parse_opt( opt );
    const date = opt.date_start;

    return db.get_dates_file( Object.assign( {}, opt, { date: date } ) )
    .then(( result )=>{
        return result;
    })

};

export { db }

