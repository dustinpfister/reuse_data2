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
  10, 12, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95,
  100, 125, 150, 175, 200
];
const COUNT_OPTIONS = [1,2,3,4,5,6,7,8,9,10];
const DEPT_OPTIONS = ['housewares', 'electronics', 'building materials', 'furniture'];

// STATIC SERVER
const app = express()

app.set('json spaces', 2)

app.use( express.static('html') )
app.use( bodyParser.json() )


// json path for making queries to the db
app.get('/json', (req, res, next) => {

    const q = req.query
    const config_mode = (q.config === "true" || q.config == "1" ) ? true : false; 

    // if /json?config=true then send config data
    if(config_mode){
        res.json({
            PRICE_OPTIONS: PRICE_OPTIONS.join(','),
            COUNT_OPTIONS: COUNT_OPTIONS.join(',')
        });
    }
    
    if(!config_mode){
        res.json(db.data);
    }
});


app.post('/json', (req, res, next) => {

    const t = (new Date()).getTime();
    const price_index = req.body.price_index || 0;
    const price = PRICE_OPTIONS[ price_index ];
    const count = req.body.count || 1;
    
    let item = {
        rec_num: db.data.rec_num, t: t, price: price, count: count, color: 'white', user: null
    };
    db.data.rec_num += 1;
    db.data.items.push( item );
    db.write();
    res.end();
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
