import express from 'express';
import bodyParser from 'body-parser';
import { parseArgs } from 'node:util';
import path  from 'node:path';
import ejs from 'ejs';
import cookieParser from 'cookie-parser';
import session from 'express-session';

import { router_auth } from './routes/auth.js';
import { router_index } from './routes/index.js';
import { router_json } from './routes/json.js';

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

app.use( express.static('html') );
app.use( bodyParser.json() )

app.use('/', router_auth );
app.use('/', router_index );
app.use('/', router_json );

// 404
// this can be used as a way to catch any get request for a url that is not resolved by 
// the static server or any additional middleware above.
app.get(/.*/, (req, res, next) => {
  console.log('get request for ' + req.url);
  res.send('404 file not found');
});

app.listen(args.values.port, () => {
  console.log('data2 is alive.')
  console.log('listening on port: ' + args.values.port )
});
