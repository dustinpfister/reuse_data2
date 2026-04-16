import { mkdir, access, constants } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { Low } from 'lowdb';
//import { walk } from '../fs_walker/fs_walker.js'
// There should be a better way to do this
// import { JSONFileSyncPreset } from '../../node_modules/lowdb/lib/presets/node.js';
// looks like there is, just have to look at the exports of the package.json file
import { JSONFileSyncPreset } from 'lowdb/node';

const OPTIONS_DEFAULT = {
   dir : path.join( os.homedir(), '.data2' ),
   dir_rel: '',
   date: new Date(),
   date_start: new Date(), date_end: new Date(),
   file_name: 'data.json',
   file_data: {},
   items_per_page: 10
};

const chunk = function (arr=[], size=10) {
    var chunked = [];
    arr = arr || [];
    size = size === undefined ? 1 : size;
    for (var i = 0; i < arr.length; i += size) {
        chunked.push( arr.slice(i, i + size) );
    }
    return chunked;
};

const parse_opt = ( opt = {} ) => {
    return Object.assign({}, OPTIONS_DEFAULT, opt)
};

const make_dir = ( dir = OPTIONS_DEFAULT.dir ) => {
    return mkdir(dir, { recursive: true })
    .then( ( a ) => {
        return { dir : dir, e: null }
    });
};

const get_date_path = (opt) => {
    opt = parse_opt( opt );
    const year = opt.date.getFullYear();
    const month = String( opt.date.getMonth() + 1 ).padStart(2, '0');
    const day = String( opt.date.getDate() ).padStart(2, '0');
    return path.join( opt.dir, 'dates/' + year + '/' + month + '/' + day );
};

const make_dates_dir = ( opt = {} ) => {
    opt = parse_opt( opt );
    return make_dir( get_date_path(opt) );
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
};

const get_date_file_collection = (opt) => {
    opt = parse_opt( opt );
    const date = opt.date_start;
    const arr_dates = make_date_array(opt.date_start, opt.date_end);
    return Promise.allSettled( arr_dates.map( (date) => {
        const path = get_date_path( Object.assign( {}, opt, { date: date } ) );
        let pass = true;
        return access( path, constants.F_OK  )
        .catch(()=>{
            pass = false;
        })
        .then(()=>{
            return { path: path, date: date, pass: pass }
        });
    }))
    .then((result) => {
        const arr_good_dates = result.filter((obj)=>{
            return obj.value.pass;
        }).map((obj)=>{
            return obj.value.date;
        })
        return Promise.all( arr_good_dates.map( (date) => {
            return db.get_dates_file( Object.assign( {}, opt, { date: date } ) )
        }));
    });
};

/*
const get_date_file_collection = (opt) => {
    opt = parse_opt( opt );
    const date = opt.date_start;
    const arr_dates = make_date_array(opt.date_start, opt.date_end);
    return Promise.all( arr_dates.map( (date) => {
        return db.get_dates_file( Object.assign( {}, opt, { date: date } ) )
    } ) );
};
*/

const db = {};

db.parse_opt = parse_opt;

// get a file for a specific date in the .data2 folder
db.get_dates_file = ( opt = {} ) => {
    opt = parse_opt( opt );
    return make_dates_dir( opt )
    .then( ( result ) => {
        const file_path = path.resolve( result.dir, opt.file_name );
        const db_file = new JSONFileSyncPreset(file_path, opt.file_data);
        db_file.write();
        return db_file;
    });
};

// get a file relative to the .data2 folder location by way of the given dir_rel, and file_name options
db.get_rel_file = ( opt = {} ) => {
    opt = parse_opt( opt );
    //return make_dir(opt, opt.dir_rel).then( ( result ) => {
    return make_dir( path.join( opt.dir, opt.dir_rel ) ).then( ( result ) => {
        const file_path = path.resolve( result.dir, opt.file_name );
        const db_file = new JSONFileSyncPreset(file_path, opt.file_data);
        db_file.write();
        return db_file;
    });
};

db.get_pages = async ( opt={} ) => {
    opt = parse_opt( opt );
    return get_date_file_collection(opt)
    .then(( collection ) => {   
        const arr = collection.filter((obj)=>{
            return obj.data.items;
        })
        .map( (obj) => {
            return obj.data;
        })
        .reduce( (acc, el)=> {
            return acc.concat( el.items || [] ) ;
        }, []);
        
        return chunk( arr, opt.items_per_page );
    });
};

const TABULATOR_DEFAULT = (acc, el)=>{ 
    if(!el.data.items){
        return acc;
    }
    const total = el.data.items.reduce( (acc, item) => {
        return parseInt( item.count ) * parseFloat( item.price );
    }, 0 );
    return acc + total;
};

db.tabulate = ( opt={}, tabulator = TABULATOR_DEFAULT ) => {
    opt = parse_opt( opt );
    return get_date_file_collection(opt)
    .then(( collection ) => {
        return collection.reduce( tabulator, 0 )
    })
};

export { db }

