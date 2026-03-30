import express from 'express';
import bodyParser from 'body-parser';
import { parseArgs } from 'node:util';
import path  from 'node:path';
import { Low } from 'lowdb';
import { JSONFileSyncPreset } from './node_modules/lowdb/lib/presets/node.js';
import ejs from 'ejs';
import passport from 'passport';
import passport_local from 'passport-local';

import cookieParser from 'cookie-parser';
import session from 'express-session';

const LocalStrategy = passport_local.Strategy;

const db = new JSONFileSyncPreset('db.json', { rec_num: 0, items: [] });

const db_users = new JSONFileSyncPreset('users.json', { users: [
    {
        id:0,
        username: 'dustin',
        password: 'letmein'
    }
] });
db_users.write();

// parse options
const args = parseArgs({
  options:{
    port: {
        type: 'string',
        short: 'p',
        default: process.env.PORT || '8080'
    }
  }
});

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

/********* **********
 COLOR SYSTEM - based on R7 of reuse color tag fix code ( https://github.com/dustinpfister/reuse_color_tag_fix/ )
********** *********/
const COLOR_CONF = {  // hard coded color conf default
  array : [
    {
      first_tuesday: new Date(2025, 9 - 1, 9, 0, 0, 0, 0),
      first_index: 0,
      ascending: true,
      discounts: [ [25, 3], [50, 2] ],
      cull: 1,
      data: [  
        { i: 0, desc: 'Green',  web: '#00ff00' },
        { i: 1, desc: 'Blue',   web: '#0000ff' },
        { i: 2, desc: 'Yellow', web: '#ffff00' },
        { i: 3, desc: 'Orange', web: '#ff8800' },
        { i: 4, desc: 'Red',    web: '#ff0000' }
      ]
    }
  ]
};

const parse_color_object = ( COLOR={} ) => {
    const new_color = Object.assign({}, COLOR_CONF.array[0], COLOR);
    new_color.color = new_color.data[ new_color.first_index ].desc;
    return new_color;
};

const parse_color_array = ( COLOR_ARRAY=[] ) => {
    return COLOR_ARRAY.map( (COLOR) => {
        return parse_color_object( COLOR );
    });
};

const mod = function(x, m) {
    return (x % m + m) % m;
};

const get_index_by_date = (COLOR, delta = 0, DATE=new Date()) => {
    const time = DATE.getTime();
    const ms = Math.round( time  - COLOR.first_tuesday.getTime() );
    const week_count = Math.floor( ms  / ( 1000  * 60 * 60 * 24 * 7) );
    const week_delta = week_count * ( COLOR.ascending ? 1 : -1 );
    return mod(COLOR.first_index + week_delta + delta, COLOR.data.length);
};

const get_color_status = ( COLOR_CONF={}, now = new Date() ) => { 
    let i_array = 0;
    const ca_len = COLOR_CONF.array.length;
    if( ca_len > 1 ){
        let i = 0;
        while(i < ca_len){
            const cb = COLOR_CONF.array[ i ];
            if( now.getTime() >= cb.first_tuesday.getTime()){
               i_array = i;
            }
            i += 1;
        }
    }
    const colorObj = COLOR_CONF.array[ i_array ];
    const cs = {
       array: i_array
    };
    cs.print = get_index_by_date( colorObj, 0, now );
    cs.disc = colorObj.discounts.map(( disc )=>{
        return get_index_by_date( colorObj, disc[1], now );
    });
    cs.cull = get_index_by_date( colorObj, colorObj.cull, now );
    return cs;
};

// STATIC SERVER
const app = express()

app.set('views', path.join( import.meta.dirname , 'views'));
app.set('view engine', 'ejs');
app.set('json spaces', 2);

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  // there is a memeory store that should work for just getting started
  //store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' })
}));
app.use(passport.authenticate('session'));

app.use( express.static('html') );

app.use( bodyParser.json() )

passport.use(new LocalStrategy(
  (username, password, done) => {
  
    console.log('This has fired at least');
    console.log(username, password);
    
    console.log('so just calling done with null for error');
    done(null, { username: 'dustin', id: 0, password: 'letmein' })
    
    // use lowdb to look up user
  
    // done(err ); // fail    
    // done(null, user); // Success
    
  }
));

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});


app.get('/login', (req, res) => {
  res.render('login', { });
});
app.post('/login',
  passport.authenticate('local', { 
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true 
  })
);

app.post('/login/password', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureMessage: true
}));

app.get('/signup', (req, res) => {
  res.render('signup', {  });
});

app.get('/', (req, res) => {
  res.render('index', {  });
});


// check if the user is logged in
// and redirect if needed
app.get(/.*/, (req, res, next) => {

  console.log('get request for: ' + req.url);
  
  //console.log(req.user)
  
  /*
  if(!req.user){
     console.log('the user is not logged in!');
     //res.redirect('/login');
  }else{
      next()
  }
  */
  
  next();
});

// json path for making queries to the db
app.get('/json', (req, res, next) => {
    const q = req.query;
    //const config_mode = (q.config === 'true' || q.config == '1' ) ? true : false; 
    const mode = ( q.mode || 'db').toLowerCase();
    
    let obj = db.data;
    
    // if /json?mode=config then send config data
    if(mode == 'config' ){
        obj = {
            COLOR_CONF: COLOR_CONF,
            color_status: get_color_status( COLOR_CONF, new Date() ),
            PRICE_OPTIONS: PRICE_OPTIONS.join(','),
            COUNT_OPTIONS: COUNT_OPTIONS.join(','),
            DEPT_OPTIONS: DEPT_OPTIONS.join(',')
        };
    }
    
    if(mode == 'color' ){
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
            color_status: get_color_status( COLOR_CONF, date ),
            COLOR_CONF: COLOR_CONF
        }
    }
    
    res.json( obj );
    
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
        
        let username = null;
        if(req.user){
            username = req.user.username || 'foo';
        }
        
        
        let item = {
            rec_num: db.data.rec_num, t: t, 
            depart_index: depart_index, 
            price: price, count: count, price_type: price_type, 
            user: username
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
