// dependencies 
// ========================================
import express from "express";
import session from "express-session";
import { ObjectId } from 'mongodb';
import flash from "connect-flash";


// local modules§
import { config, SITE_NAME, PORT, SESSION_SECRET, SESSION_MAXAGE } from "./configs.js";
import routeStart from './routes/route-start.js';
import routeUser from './routes/route-user.js';

import { getTweetById , updateTweetById} from './controllers/controller-tweet.js';

import bodyParser from 'body-parser';


// express app environment
// ========================================
const app = express();

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// express template engine
// ========================================
app.set("view engine", "ejs");

// sessions
// ========================================
app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: SESSION_MAXAGE },
    }));

// handle method post - request body as json 
// if app uses upload files - route actions before this step...
// ========================================
app.use(express.json());
app.use(express.urlencoded({extended: true}));


// Hämtar ut alla funktioner från routeEdit

// app.use('/tweets', tweetRouter);

// routes
// ========================================

app.get('*', (req, res, next) => {
    req.session.views ? req.session.views++ : req.session.views = 1;
    console.log("req.session.views", req.session.views);
    console.log(req.session, req.session.id);
    next();
});

app.get('/user/createTweet/:id/edit', getTweetById);

// update a tweet by id
app.post('/user/createTweet/:id/edit', updateTweetById);
// app.post('tweets/:id/edit', updateTweetById);

// use local routes ...
app.use('/', routeStart);
app.use('/start', routeStart); 
app.use('/home', routeStart);
app.use('/user', routeUser);

// a. Renderar sidan makeTweet
app.get('/makeTweet', (req, res) => {
    res.render("makeTweet", { tweet: {} });
});

// Middleware flash
app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

// Rendera sidan login
app.get('/user', (req, res) => {
    res.render("login", { message: req.flash('message') });
});



// Route-handling för att visa login-vyn
app.get('/user', (req, res) => {
    const success_msg = req.flash('success_message');
    res.render('login', { success_msg }); // skickar med meddelandet till vyn
});



// app.get('/about', getAllTweets)
// static files | folders
// ========================================
app.use(express.static("./public"));


app.use((req, res) => res.status(404).send("Sry - nothing to display"));


// 500 server error
// ========================================
app.use((err, req, res, next) => {
    
    // log server error server-side
    console.log("Error", err); 

    res.status(500).send("Server error - please return later");
    next();
});


// listen on server requests
// ========================================

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));