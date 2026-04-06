import express from 'express';
import bodyParser from 'body-parser';
import { parseArgs } from 'node:util';
import path  from 'node:path';
import { Low } from 'lowdb';
import { JSONFileSyncPreset } from './node_modules/lowdb/lib/presets/node.js';
import ejs from 'ejs';

import { color_cycle } from './lib/color_cycle/color_cycle.js';

import passport from 'passport';
import passport_local from 'passport-local';

import cookieParser from 'cookie-parser';
import session from 'express-session';

const LocalStrategy = passport_local.Strategy;

const db_items = new JSONFileSyncPreset('db.json', { rec_num: 0, items: [] });

const db_users = new JSONFileSyncPreset('users.json', { id_num: 0, users: [
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
const DEPT_OPTIONS = ['housewares', 'electronics', 'building_materials', 'furniture'];

/********* **********
 COLOR SYSTEM - based on R7 of reuse color tag fix code ( https://github.com/dustinpfister/reuse_color_tag_fix/ )
********** *********/
const db_conf = new JSONFileSyncPreset('conf.json', { 
    color_tags : color_cycle.default_conf
});
db_conf.write();

const COLOR_CONF = color_cycle.parse_conf( db_conf.data.color_tags );

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
    const user = db_users.data.users.find( (user) => {
        return user.username === username;
    } );
    if(!user){
        done(null, false, { code: 521, message: 'the given user was not found.' } );
    }else{
        if(user.password === password){
            done(null, user, { code: 200, message: 'login successful.' } );
        }else{
            done(null, false, { code: 520,  message: 'The given user was found, but the password does not match.' });
        }
    }    
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

app.post("/login", (req, res) => {
  passport.authenticate("local",
      (err, user, options) => {
        if ( user ) {
          req.login(user, (error)=>{
            if( error ) { res.send(522); }
            if( !error ){ res.send(200); }
          });
        }
        if( !user ){
          const code_status = options.code || 522;
          res.status(code_status).end();
        };
  })(req, res)
});

app.get('/signup', (req, res) => {
  res.render('signup', {  });
});

app.post('/signup', (req, res) => {

    const id = db_users.data.id_num += 1;
    const username = req.body.username || '';
    const password = req.body.password || '';
  
    const t1 = username.length >= 1; 
    const t2 = password.length >= 3;
    
    if(!t1 || !t2 ){
        res.statusMessage = 'one or more server side tests failed';
        return res.status(500).end();
    }
    
    const t3 = db_users.data.users.filter((user)=>{
        return user.username === username;
    });
    if(t3.length >= 1){
        res.statusMessage = 'The username is all ready in the database';
        return res.status(500).end();
    }
    
    db_users.data.users.push({
        id: id,
        username: username,
        password: password
    });
    db_users.write();
    res.statusMessage = "new user : " + username + ' was added to the database';
    res.status(200).end();
    
});

app.post('/logout', (req, res, next) => {
  req.logout( (err) => {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});

// check if the user is logged in and redirect if needed
app.get(/.*/, (req, res, next) => {
  if(!req.user){
     res.redirect('/login');
  }else{
      next();
  }
});

app.get('/', (req, res) => {
  res.render('index', { username: req.user.username });
});

// json path for making queries to the db
app.get('/json', (req, res, next) => {

    const q = req.query;
    const mode = ( q.mode || 'db').toLowerCase();
    
    let obj = db_items.data;
    
    // only for current logged in user
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


app.post('/json', (req, res, next) => {

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
