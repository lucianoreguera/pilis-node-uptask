const express = require('express');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const dotenv  = require('dotenv');
const passport = require('./config/passport');
const routes = require('./routes');
const db = require('./config/db');
const helpers = require('./helpers');
require('./models/Proyecto');
require('./models/Tarea');
require('./models/Usuario');


dotenv.config();

db.sync()
    .then(() => console.log('Conectado a la BD'))
    .catch(error => console.log(error));

const app = express();

app.use(express.static('public'));

app.set('view engine', 'pug');

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.set('views', path.join(__dirname, './views'));

app.use(flash());

app.use(cookieParser());

app.use(session({ 
    secret: 'supersecret', 
    resave: false, 
    saveUninitialized: false 
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
});

app.use('/', routes());

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
    console.log(`El servidor está funcionando en el puerto ${port}`);
});

require('./handlers/email');
