import express from "express";
import { SITE_NAME } from "../configs.js";


// 
const router = express.Router();

import { listUsers, addUser, loginUser, getAllTweets, createTweet } from "../controllers/controller-user.js";

router.get("/", (req, res) => {
    res.render("user", { site: SITE_NAME, username: req.session.username });
});

router.get("/register", (req, res) => {
    res.render("register", { site: SITE_NAME, username: req.session.username });
});

router.get("/login", (req, res) => {
    res.render("login", { site: SITE_NAME, username: req.session.username });
});

router.get("/logout", (req, res) => {

    
    req.session.destroy();
    res.render("index", { site: SITE_NAME, username: "" });
});



// nytt 30/11 -----------------------------
router.get("/about", getAllTweets)
// router.post('/createtweet', createTweet) ;

router.post('/createTweet', createTweet)



router.post("/register", (req, res) => {

    // prepare obj reply
    let reply = { result: "", message: "" };
console.log(req.body)

    addUser(req.body)
    
        .then((data) => {
          
            console.log("data", data);
            if (data.error !== undefined) {
                reply.result = "fail";
                reply.message = data.error;
            } else {
                reply.result = "success";
                reply.message = "Användare sparad";
            }
           
        })
        .catch((error) => {
            console.log("error");
        })
        .finally((data) => {
            res.json(reply);
        });
});

router.post("/login", (req, res) => {

    let reply = { result: "", message: "" };

    loginUser(req.body).then((data) => {

        if (data.error !== undefined) {
            reply.result = "fail";
            reply.message = data.error;
        } else {
            reply.result = "success";
            reply.message = "Du har loggat in - <a href='/'>startsida</a>";
            
            // session
            req.session.username = data.user.username;
        }

    }).catch(error => {
        console.log("error loginUser method", error);
    }).finally(() => {
        res.json(reply);
    });
});

export default router;