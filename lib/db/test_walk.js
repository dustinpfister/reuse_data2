import { db }  from './db.js';
import path from 'node:path';
import os from 'node:os'
import fs from 'node:fs';

/*
db.get_dates_file({
   date: new Date(),
   file_name: 'items.json',
   file_data: { rec_num: 0, items: [] }
}).then((result) => {
    console.log(result.data);
});
*/

let walk = function (opt = {} ) {
    const dir = opt.dir || process.cwd();
    fs.readdir(dir, (e, items) => {
        items.forEach((item) => {
            let item_path = path.join(dir, item);
            fs.stat(item_path, (e, stats) => {
                if ( stats.isFile() && opt.on_file ) {
                    opt.on_file({
                        dir: dir, item: item, item_path: item_path, stats: stats
                    });
                }
                if ( stats.isDirectory() ) {
                    walk( Object.assign( {}, opt, { dir: item_path } ) );
                }
            });
        });
    });
};


const opt = db.parse_opt();
walk( {
   dir: path.join( opt.dir, 'dates'),
   on_file: (result) => {
       const arr = result.item_path.split('/');
       const date_str = arr.slice(arr.length - 4, arr.length - 1).join('/')
       console.log( date_str )
   }
});

