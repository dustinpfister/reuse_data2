import express from 'express';

import  { db } from '../lib/db/db.js';
import { color_cycle } from '../lib/color_cycle/color_cycle.js';

const PRICE_OPTIONS = [
  0.05, 0.10, 0.25, 0.50, 0.75,
  1, 2, 3, 4, 5, 6, 7, 8, 9,
  10, 12, 15, 
  20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95
];
const COUNT_OPTIONS = [
  1,2,3,4,5,6,7,8,9,10,
  15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95,
  100, 200, 300, 400, 500
];
const DEPT_OPTIONS = ['housewares', 'electronics', 'building_materials', 'furniture'];

const get_db_items = async ( now = new Date() ) => {
    return db.get_dates_file({
        date: now,
        file_name: 'items.json',
        file_data: { rec_num: 0, items: [], date: now }
    });
};

const parse_date_str = (str='') => {
    if(typeof str != 'string'){
        return false;
    }
    if(str.length != 8 || !str.match(/^\d+$/)){
        return false;
    }
    const m = parseInt( str.substring(4, 6) ) - 1;
    return new Date( str.substr(0, 4), m, str.substring(6, 8) );
}

const get_db_conf = async ( ) => {
    return db.get_rel_file({
        dir_rel: '',
        file_name: 'conf.json',
        file_data: { color_tags : color_cycle.default_conf }
    });
};

const router_json = express.Router();

// json path for making queries to the db
router_json.get('/json', async (req, res, next) => {
    const now = new Date();
    const db_conf = await get_db_conf();
    const db_items = await get_db_items( now );
    const COLOR_CONF = color_cycle.parse_conf( db_conf.data.color_tags );
    const q = req.query;
    const mode = ( q.mode || 'db').toLowerCase();
    let obj = {};
    // default 'db' mode that will return item info for the current day and user
    if( mode === "db" && req.user ){
        Object.assign(obj, {
            date: db_items.data.date,
            items: db_items.data.items.filter( (item) => {
                return item.user_id === req.user.id;
            })
        });
    }
    //
    if( mode === "items" && req.user ){
        const ds = parse_date_str(q.ds) || now;
        const de = parse_date_str(q.de) || now;
        const ipp = parseInt(q.ipp) || 3;
        const au = q.au || false;
        const pages = await db.get_pages({
            date : now, date_start : ds, date_end : de,
            file_name: 'items.json',
            items_per_page: ipp
        }, (item)=>{
            return au === 'true' || item.user_id === req.user.id;
        });
        Object.assign(obj, {
            all_users: au,
            items_per_page: ipp,
            date_start: ds,
            date_end: de,
            pages: pages
        });
    }
    // if /json?mode=config then send config data
    if( mode == 'config' ){
        Object.assign(obj, {
            COLOR_CONF: COLOR_CONF,
            color_status: color_cycle.get_status( COLOR_CONF, new Date() ),
            PRICE_OPTIONS: PRICE_OPTIONS.join(','),
            COUNT_OPTIONS: COUNT_OPTIONS.join(','),
            DEPT_OPTIONS: DEPT_OPTIONS.join(',')
        });
    }
    // if /json?mode=color send color cycle info
    if( mode == 'color' ){
        const y = parseInt( q.y || '2026');
        const m = parseInt( q.m || '1' );
        const d = parseInt( q.d || '1' );
        const h = parseInt( q.h || '0');
        const min = parseInt( q.min || '0');
        const s = parseInt( q.s || '0');
        const ms = parseInt( q.ms || '0');
        const date = new Date(y, m - 1, d, h, min, s, ms );
        Object.assign(obj,{
            date : date,
            color_status: color_cycle.get_status( COLOR_CONF, date ),
            COLOR_CONF: COLOR_CONF
        })
    }
    res.json( obj );    
});

router_json.post('/json', async (req, res, next) => {
    const db_items = await get_db_items( new Date() );
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
