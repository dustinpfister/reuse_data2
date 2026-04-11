import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';

const DEFAULT_OPT = {
    dir: os.homedir(),
    item_count: 0,
    on_file: ( (result) => { 
    
        console.log(result.item_path);
    
    }),
    on_error: ( (result, e) => {
    
    })
};

const walk = {};

walk.get_list = function (dir = DEFAULT_OPT.dir, list=[] ) { 

    const process_item = () => {
    
}

    fs.readdir(dir, (e, items) => {
        if(e || !items){
            return;
        }        
        items.forEach((item) => {
            let item_path = path.join(dir, item);
            fs.stat(item_path, (e, stats) => {
                const result = {
                    dir: dir, item: item, item_path: item_path
                };    
                if(e || !stats){
                    return;
                }
                result.stats = stats;
                if ( stats.isFile() ) {
                    list.push(item_path);
                }
                if ( stats.isDirectory() ) {
                    list.push(item_path);
                    walk.get_list( item_path, list );
                }
                console.log( list.length );
            });           
        });
    });
};

// real time file system walking
walk.real_time = function ( opt = {} ) {
    opt = Object.assign( {}, DEFAULT_OPT, opt );
    //opt.item_count = opt.item_count === undefined ? 0 : opt.item_count;
    const dir = opt.dir || process.cwd();
    fs.readdir(dir, (e, items) => {
        if(e || !items){
            opt.on_error(e, {});
            return;
        }
        opt.item_count += items.length;
        let i_ct = items.length;
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
                opt.item_count -= 1;
                i_ct -= 1;
                result.stats = stats;
                if ( stats.isFile() ) {
                    opt.on_file(result);
                }
                if ( stats.isDirectory() ) {
                    walk.real_time( Object.assign( {}, opt, { dir: item_path } ) );
                    //opt.dir = item_path;
                    //walk(opt)
                }
                //if(opt.item_count ===  0){
                    console.log('done', opt.item_count, i_ct)
                //}
            });
            
            
        
            
        });
    });
};


export { walk }
