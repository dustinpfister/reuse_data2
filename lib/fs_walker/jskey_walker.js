/********* **********
 https://github.com/dustinpfister/jskey-walk/tree/master
********** *********/
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';

// load a forFile Script
const load_script = (filePath)=>{
    // a filePath must be given
    if(!filePath){
        console.warn('no vaild file path given for a forFile method script. Running built in ForFile method.');
        return Promise.reject(new Error('no vaild script path'));
    }
    return new Promise((resolve, reject)=>{
        try{
            let forFile = require(path.resolve(filePath));
            // Must be a function or an object with a forFile method
            if(typeof forFile != 'function'){
                if(!forFile.forFile){
                    reject(new Error('If not a function must be an object with at least a forFile method'));
                }
            }
            resolve(forFile);
        }catch(e){
            reject(e);
        }
    });
};
// walk method
const walk = (opt) =>{
    // options
    opt = opt || {};
    opt.dir = opt.dir || process.cwd();
    opt.forFile = opt.forFile || function(item, next){
        console.log(item.path);
        next();
    };
    opt.recursive = opt.recursive || false;
    
    // readNext
    let i = 0;
    let readNext = (files) => {
        let fileName = files[i];
        if(i < files.length){

            let item = {
                fileName : fileName,
                path: path.join(opt.dir, fileName)
            };
            fs.stat(item.path, (e, stat)=> {
                i += 1;
                if(stat.isDirectory()){
                    if(opt.recursive){                    
                        walk(Object.assign({}, opt, { dir: item.path }));
                    }
                    readNext(files);
                }else{
                    item.stat = stat;
                    opt.forFile(item, function(){
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
// main method that is exported
const full_run = (opt) => {
   
   opt = opt || {};
   opt.beforeWalk = opt.beforeWalk || function(next, opt){next();};
   opt.onDone = opt.onDone || function(){};

   
   // load forFile
   load_script(opt.scriptPath)
   // deal with forFile script
   .then((forFile)=>{
       // assume just an object and merge
       opt = Object.assign(opt, forFile);
       // if just a function with no forFile prop
       if(typeof forFile === 'function' && !forFile.forFile){
           opt.forFile = forFile;
       }
       // if given bolth use bolth
       if(typeof forFile === 'function' && forFile.forFile){
           opt.forFile = function(item, next){
               forFile(item, next);
               forFile.forFile(item, next);
           };
       }
       // dir option in for file scripts is relative to the forFile script
       if(forFile.dir){
           let dir_forFile = path.dirname(path.resolve(opt.scriptPath));
           opt.dir = path.join(dir_forFile, opt.dir);
       }
       
       return Promise.resolve(opt);
    })
    // warn
    .catch((e)=>{
       console.warn(e.message);
       return Promise.resolve(opt);
    })
    // walk
    .then((opt)=>{
        // call onDone once on process exit
        process.on('exit', function(){
            opt.onDone();
        });  
       opt.beforeWalk(function(){
           walk(opt);
       }, opt);
        
    });
};

export { walk, load_script, full_run }
