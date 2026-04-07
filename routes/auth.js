import express from 'express';
import passport from 'passport';
import passport_local from 'passport-local';

const LocalStrategy = passport_local.Strategy;

const router_auth = express.Router();

import  { db } from '../lib/db/db.js';

const db_users = await db.get_rel_file({
    dir_rel: '',
    file_name: 'users.json',
    file_data: {
        id_num: 0, 
        users: [
            {
                id:0,
                username: 'dustin',
                password: 'letmein'
            }
        ]
    }
});

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

router_auth.use(passport.authenticate('session'));

router_auth.get('/login', (req, res) => {
  res.render('login', { });
});

router_auth.post("/login", (req, res) => {
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

router_auth.get('/signup', (req, res) => {
  res.render('signup', {  });
});

router_auth.post('/signup', (req, res) => {

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

router_auth.post('/logout', (req, res, next) => {
  req.logout( (err) => {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});

// check if the user is logged in and redirect if needed
router_auth.get(/.*/, (req, res, next) => {
  if(!req.user){
     res.redirect('/login');
  }else{
      next();
  }
});

export { router_auth };

