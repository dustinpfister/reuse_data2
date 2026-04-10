import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';

const DEFAULT_OPT = {
    dir: os.homedir(),
    on_file: ( (result) => { 
    
        console.log(result.item_path);
    
    }),
    on_error: ( (result, e) => {
    
    })
};

const walk = function ( opt = {} ) {
    opt = Object.assign( {}, DEFAULT_OPT, opt );
    const dir = opt.dir || process.cwd();
    fs.readdir(dir, (e, items) => {
    
        if(e || !items){
            opt.on_error(e, {});
            return;
        }
    
        items.forEach((item) => {
            let item_path = path.join(dir, item);
            fs.stat(item_path, (e, stats) => {
                const result = {
                    dir: dir, item: item, item_path: item_path
                };
                if(e || !stats){
                    opt.on_error(e, {});
                    return;
                }
                result.stats = stats;
                if ( stats.isFile() ) {
                    opt.on_file(result);
                }
                if ( stats.isDirectory() ) {
                    walk( Object.assign( {}, opt, { dir: item_path } ) );
                }
            });
        });
    });
};


export { walk }
