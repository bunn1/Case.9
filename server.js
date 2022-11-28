// dependencies - import => package.json "type": "module",
// ========================================
import express from "express";
import session from "express-session";

// local modules
import { config, SITE_NAME, PORT, SESSION_SECRET, SESSION_MAXAGE } from "./configs.js";
import routeStart from './routes/route-start.js';
import routeUser from './routes/route-user.js';


// express app environment
// ========================================
const app = express();


// express template engine
// ========================================
app.set("view engine", "ejs");


// middleware
// ========================================


// sessions
// ========================================
app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: SESSION_MAXAGE },
    })
);




// handle method post - request body as json 
// if app uses upload files - route actions before this step...
// ========================================
app.use(express.json());
app.use(express.urlencoded({extended: true}));



// routes
// ========================================

// check sessions
// make sure using next as 3rd argument
app.get('*', (req, res, next) => {

    // oneliner if condition - ternary operator  ? :  ;
    req.session.views ? req.session.views++ : req.session.views = 1;
    
    // show number of times users navigates before session been destroyed
    console.log("req.session.views", req.session.views);

    // authenticated user...should be a property "username" i req.session
    console.log(req.session, req.session.id);

    next();
});

// use local routes ...
app.use('/', routeStart);
app.use('/start', routeStart);
app.use('/home', routeStart);
app.use('/user', routeUser);



// pass server-side content to render engine - res.locals, app.locals, object as 2 arg res.render(,{})
// apples, pears, plums, berries

app.locals.berries = "Strawberry"

app.get('/apples', (req, res) => {
    res.locals.pears = "Clara Frijs"; 
    res.render("apples", {site: SITE_NAME, apples: "Ingrid Marie", id: req.session.id })
});


// static files | folders
// ========================================
app.use(express.static("./public"));


// 404 not found
// ========================================
app.use((req, res, next) => {
    res.status(404).send("Sry - nothing to display");
    next();
});


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
app.listen(PORT, (req, res) => {
    console.log(`Server running on port ${PORT}`);
});
