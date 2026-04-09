import express from 'express';

import  { db } from '../lib/db/db.js';
import { color_cycle } from '../lib/color_cycle/color_cycle.js';

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
const DEPT_OPTIONS = ['housewares', 'electronics', 'building_materials', 'furniture'];


const db_items = await db.get_dates_file({
   date: new Date(),
   file_name: 'items.json',
   file_data: { rec_num: 0, items: [] }
});

const db_conf = await db.get_rel_file({
   dir_rel: '',
   file_name: 'conf.json',
   file_data: { color_tags : color_cycle.default_conf }
});


const COLOR_CONF = color_cycle.parse_conf( db_conf.data.color_tags );


const router_json = express.Router();

// json path for making queries to the db
router_json.get('/json', (req, res, next) => {
    const q = req.query;
    const mode = ( q.mode || 'db').toLowerCase();
    let obj = db_items.data;
    
    if( mode === "db" && req.user ){
        obj = {
            items: db_items.data.items.filter( (item) => {
                return item.user_id === req.user.id;
            })
        }
    }
    
    // if /json?mode=config then send config data
    if( mode == 'config' ){
        obj = {
            COLOR_CONF: COLOR_CONF,
            color_status: color_cycle.get_status( COLOR_CONF, new Date() ),
            PRICE_OPTIONS: PRICE_OPTIONS.join(','),
            COUNT_OPTIONS: COUNT_OPTIONS.join(','),
            DEPT_OPTIONS: DEPT_OPTIONS.join(',')
        };
    }
    if( mode == 'color' ){
        const y = parseInt( q.y || '2026');
        const m = parseInt( q.m || '1' );
        const d = parseInt( q.d || '1' );
        const h = parseInt( q.h || '0');
        const min = parseInt( q.min || '0');
        const s = parseInt( q.s || '0');
        const ms = parseInt( q.ms || '0');
        const date = new Date(y, m - 1, d, h, min, s, ms );
        obj = {
            date : date,
            color_status: color_cycle.get_status( COLOR_CONF, date ),
            COLOR_CONF: COLOR_CONF
        }
    }
    res.json( obj );    
});

router_json.post('/json', (req, res, next) => {
    const mode = req.body.mode || 'null';
    if(mode === 'del_items'){
       const rec_nums = req.body.rec_nums || [];
       db_items.data.items = db_items.data.items.filter( (item) => {
           return !rec_nums.find((purge_num)=>{ return purge_num === item.rec_num  });
       });
       db_items.write();
       res.end()
    }
    if(mode === 'post_item'){
        const t = (new Date()).getTime();
        const depart_index = req.body.depart_index || 0;
        const price_index = req.body.price_index || 0;
        const price = PRICE_OPTIONS[ price_index ];
        const price_type = req.body.price_type || 'unit';
        const count = req.body.count || 1;
        let username = null;
        if(req.user){
            username = req.user.username || 'foo';
        }   
        let item = {
            rec_num: db_items.data.rec_num, t: t, 
            depart_index: depart_index, 
            price: price, count: count, price_type: price_type, 
            user_id: req.user.id
        };
        db_items.data.rec_num += 1;
        db_items.data.items.push( item );
        db_items.write();
        res.end()
    }
    if(mode === 'null'){
        res.statusMessage = "no mode given/ unknown mode";
        res.status(500).end();
    }
});


export { router_json };
