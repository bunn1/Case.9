import express from "express";
import { SITE_NAME } from "../configs.js";
import flash from "connect-flash";
const router = express.Router();

import { listUsers, addUser, loginUser  } from "../controllers/controller-user.js";

 import {  getTweetById, createTweet, deleteTweet,  updateTweetById, getAllTweet, getPublicTweet, getAuthor} from "../controllers/controller-tweet.js";


router.get("/", (req, res) => {
    res.render("user", { site: SITE_NAME, username: req.session.username });
});

router.get("/register", (req, res) => {
    res.render("register", { site: SITE_NAME, username: req.session.username });
});

router.use(flash());

// A. Början på login - Kommer tillbaka hit efter genomgången loop på fel lösenord
router.get("/login", (req, res) => {
    const success_msg = req.flash('success_msg');
    const error_msg = req.flash('error_msg');  // Har ett värde om man har skrivit fel lösenord 
  
    // letar efter login.ejs fil 
    res.render("login", { site: SITE_NAME, username: req.session.username, success_msg: success_msg, error_msg: error_msg });
});

router.get("/logout", (req, res) => {

    
    req.session.destroy();
    res.render("start", { site: SITE_NAME, username: "" });
});


// 1. Vid tryck på knapp börjar funktionen köras / hämtar alla tweet eller public tweet beroende på situationen. Körs igen vid res.redirect (tillbaka till steg 1)
// g. Kommer ifrån controller-tweet efter man skapat en tweet
router.get("/seeTweet", async (req, res) => {
    const create_msg = req.flash('create_msg');
    let data = await getPublicTweet()
  const user =  req.session.username
  if (!!user ) {
     data = await getAllTweet(user)
  } 
   
// 3. Letar efter fil som ligger i views /tweet.ejs
    res.render("../views/tweet", {
        success: true,
        message: "Create tweet success",
        data:data, 
        create_msg: create_msg
    })
   
});

// d. Funktionen körs från makeTweet.ejs 
router.post('/createTweet', createTweet)


router.put('/deleteTweet', (req, res) => {

    console.log(req.body);

    deleteTweet(req.body.id).then((data) => {

        console.log(data);

        res.json({result: "success", message: "tweet delete"})

    });

});

router.put("/tweets/:id/edit", async (req, res) => {
    try {
      // Använd req.body.name, req.body.tweet och req.body.status
      // istället för req.body.text
      await updateTweetById(req.params.id, req.body.tweet, req.body.name, req.body.status);
      res.redirect("/user/createTweet");
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error - could not update tweet");
    }
  });

// Registrera användare
router.post("/register", (req, res) => {

    // prepare obj reply
    let reply = { result: "", message: "" };
console.log(req.body)

    // Initierar registrerings processen för användare
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

// 7. När du trycker på submit knappen körs den här funktionen. Kontaktar databasen 119 o 123 

router.post("/editTweet", async (req, res) => {
   
    try {
        
    const {author} = await getAuthor(req.body.id)
console.log(author)

if (author === req.session.username) {
    await updateTweetById(req.body);
    // 8. Kör funktion router.get seeTweet och går tillbaka till steg 1.
    res.redirect("/user/seeTweet");
} else{
    res.status(403).send("Not Logged In")
}
      
      
    } catch (error) {
        res.status(500).send(error.message);
    }
})

// D. Funktionen körs när login knappen trycks.
router.post("/login", (req, res) => {

    let reply = { result: "", message: "" };
// Funktion som körs i controller-user
    loginUser(req.body).then((data) => {

        if (data.error !== undefined) {
            reply.result = "fail";
            reply.message = data.error;
            req.flash('error_msg', 'Error not logged in!');
          
        } else {
            reply.result = "success";
            reply.message = "Du har loggat in! - <a href='/'>startsida</a>";
          
            // session
            req.session.username = data.user.username;
            req.flash('success_msg', 'Successfully logged in');
        
        }

    }).catch(error => {
        req.flash('error_msg', 'Error not logged in!');
        // F. Kör en get funktion beroende på om man lyckades logga in eller inte och tillbaka till steg A
    }).finally(() => {
        if (reply.result === "success") {
          res.redirect("/makeTweet");
        } else {
          res.redirect("/user/login");
        }
      });
});

export default router;