import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import pgSession from 'connect-pg-simple';
import cors from 'cors';

import db from './db/db.js';
import setupDB from './db/setupDB.js';
import { isAuthenticated } from './middleware/isAuthenticated.js';

import authRouter from './routes/auth.js';
import homeRouter from './routes/home.js';
import loadingRouter from './routes/loading.js'
import dashboardRouter from './routes/dashboard.js';
import testsRouter from './routes/tests.js';

import util from 'util';
util.inspect.defaultOptions.depth = null;

const app = express();
const PORT = process.env.PORT || 3000;

// Setup database
setupDB();

app.set('view engine', 'pug');
app.set('views', 'src/views');

app.use(cors());

// Session
app.use(session({
    store: new (pgSession(session))({
        pgPromise: db,
        createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        // secure: true,
    }
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/static', express.static('src/static'));

// Routes
app.use(homeRouter);
app.use(authRouter);
app.use(isAuthenticated);
app.use(loadingRouter);
app.use(dashboardRouter);
app.use(testsRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
})