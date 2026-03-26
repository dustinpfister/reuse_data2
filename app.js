const express = require('express');
const bodyParser = require('body-parser')

// parse options
const { parseArgs } = require('node:util');
const args = parseArgs({
  options:{
    port: {
        type: 'string',
        short: 'p',
        default: process.env.PORT || '8080'
    }
  }
});

// local json db
let low = require('lowdb');
const JSONFileSyncPreset = require('./node_modules/lowdb/lib/presets/node.js').JSONFileSyncPreset;
const db = new JSONFileSyncPreset('db.json', { rec_num: 0, items: [] })

const PRICE_OPTIONS = [
  0.05, 0.10, 0.25, 0.50, 0.75,
  1, 2, 3, 4, 5, 6, 7, 8, 9,
  10, 12, 15, 
  20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95,
  100, 125, 150, 175, 
  200, 225, 250, 275,
  300, 325, 350, 375,
  400, 425, 450, 475,
  500, 525, 550, 575,
  600, 625, 650, 675,
  700, 725, 750, 775,
  800, 825, 850, 875,
  900, 925, 950, 975,
  1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900,
  2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900,
  3000, 3100, 3200, 3300, 3400, 3500, 3600, 3700, 3800, 3900,
  4000, 4100, 4200, 4300, 4400, 4500, 4600, 4700, 4800, 4900,
  5000, 5100, 5200, 5300, 5400, 5500, 5600, 5700, 5800, 5900
];
const COUNT_OPTIONS = [
  1,2,3,4,5,6,7,8,9,10,
  15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95,
  100, 200, 300, 400, 500
];
const DEPT_OPTIONS = ['housewares', 'electronics', 'building materials', 'furniture'];

// STATIC SERVER
const app = express()

app.set('json spaces', 2)

app.use( express.static('html') )
app.use( bodyParser.json() )


// json path for making queries to the db
app.get('/json', (req, res, next) => {
    const q = req.query;
    const del_items = q.del === 'true' ? true : false;
    const config_mode = (q.config === 'true' || q.config == '1' ) ? true : false; 
    // if /json?config=true then send config data
    if(config_mode){
        res.json({
            PRICE_OPTIONS: PRICE_OPTIONS.join(','),
            COUNT_OPTIONS: COUNT_OPTIONS.join(','),
            DEPT_OPTIONS: DEPT_OPTIONS.join(',')
        });
    }
    if(!config_mode){
        res.json(db.data);
    }
});


app.post('/json', (req, res, next) => {

    const mode = req.body.mode || 'null';
    
    
    if(mode === 'del_items'){
       const rec_nums = req.body.rec_nums || [];
       db.data.items = db.data.items.filter( (item) => {
           return !rec_nums.find((purge_num)=>{ return purge_num === item.rec_num  });
       });
       db.write();
       res.json({
          mode: mode,
          pass: true
       });
    }
    
    if(mode === 'post_item'){
        const t = (new Date()).getTime();
        const depart_index = req.body.depart_index || 0;
        const price_index = req.body.price_index || 0;
        const price = PRICE_OPTIONS[ price_index ];
        const price_type = req.body.price_type || 'unit';
        
        
        
        const count = req.body.count || 1;
        let item = {
            rec_num: db.data.rec_num, t: t, 
            depart_index: depart_index, 
            price: price, count: count, price_type: price_type, 
            user: null
        };
        db.data.rec_num += 1;
        db.data.items.push( item );
        db.write();
        res.json({
            mode: mode,
            pass: true
        });
    }
    
    if(mode === 'null'){
        res.json({
            mode: mode,
            pass: false,
            mess: 'please give a mode that is supported'
        });
    }
});

// 404
// this can be used as a way to catch any get request for a url that is not resolved by 
// the static server or any additional middleware above.
app.get(/.*/, (req, res, next) => {
  console.log('get request for ' + req.url);
  res.send('404 file not found');
})


app.listen(args.values.port, () => {
  console.log('data2 is alive.')
  console.log('listening on port: ' + args.values.port )
})
