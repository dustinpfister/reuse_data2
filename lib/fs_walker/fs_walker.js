/********* **********
 https://github.com/dustinpfister/jskey-walk/tree/master
********** *********/
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';

// walk method
const walk_item = (opt) =>{
    // options
    opt = opt || {};
    opt.dir = opt.dir || process.cwd();
    opt.for_file = opt.for_file || function(item, next){
        next();
    };
    opt.for_dir = opt.for_dir || function(item, next){
        next();
    };
    opt.for_error = opt.for_error || function(e, next){
        console.log(e);
        next();
    }; 
    opt.recursive = opt.recursive || false;
    
    // readNext
    let i = 0;
    const readNext = (files) => {
        let fileName = files[i];
        if(i < files.length){
            let item = {
                fileName : fileName,
                path: path.join(opt.dir, fileName)
            };
            fs.stat(item.path, (e, stat)=> {
                i += 1;
                if(e){
                    opt.for_error(e, function(){
                        readNext(files);
                    });
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
const walk = (opt) => { 
    opt = opt || {};
    opt.before_walk = opt.before_walk || function(next, opt){next();};
    opt.on_done = opt.on_done || function(){};
    process.on('exit', function(){
        opt.on_done();
    });  
    opt.before_walk(function(){
        walk_item(opt);
    }, opt);
};

export { walk }
