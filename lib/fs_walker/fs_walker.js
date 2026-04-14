/********* **********
 https://github.com/dustinpfister/jskey-walk/tree/master
********** *********/
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';

const OPT_DEFAULT = {
    dir: os.homedir(),
    recursive: true,
    before_walk : function(next, opt){next();},
    on_done : function(){},
    for_file : function(item, next){
        next();
    },
    for_dir : function(item, next){
        next();
    },
    for_error : function(e, next){
        console.warn(e);
        next();
    }
};

// walk method
const walk_item = (opt = {} ) =>{
    opt = Object.assign( {}, OPT_DEFAULT, opt );
    // readNext
    let i = 0;
    const readNext = (files) => {
        let file_name = files[i];
        if(i < files.length){
            let item = {
                file_name : file_name,
                path: path.join(opt.dir, file_name)
            };
            fs.stat(item.path, (e, stat)=> {
                i += 1;
                if(e){
                    opt.for_error(e, function(){
                        readNext(files);
                    });
                    return;
                }
                if(stat.isDirectory()){
                    opt.for_dir(item, function() {
                        if(opt.recursive){                    
                            walk_item(Object.assign({}, opt, { dir: item.path }));
                        }
                        readNext(files);
                    });
                }
                if(stat.isFile()){
                    item.stat = stat;
                    opt.for_file(item, function(){
                        readNext(files);
                    });
                }
            });
        }
    };
    // read dir
    fs.readdir(opt.dir, (e,files)=>{
        if(files){
            readNext(files);
        }
    });
};

// main walk that is exported
const walk = (opt = {} ) => { 
    opt = Object.assign( {}, OPT_DEFAULT, opt );
    let st = 0;
    process.on('exit', function(){
        const now = new Date();
        opt.on_done( now.getTime() - st );
    });  
    opt.before_walk(function(){
        st = (new Date).getTime();
        walk_item(opt);
    }, opt);
};

export { walk }
