// import database
import connectDatabase from '../configurations/mongodb.js';
let db = await connectDatabase();

// models | Schemas
import { UserSchema } from '../models/UserSchema.js';
import bcrypt from 'bcrypt';
// import { postSchema } from '../models/tweets.js';
import {tweetSchema } from '../models/tweets.js'


const saltRounds = 10;
// Hitta specifik user i databasen och sen returneras den.
async function listUsers() {
    let users = await db.collection("users").find({}).toArray();

    return users;
}
// hej
async function addUser(obj) {

    // check if obj passes schema validation
    // https://www.npmjs.com/package/validate
    // Kollar om rätt antal bokstäver 
    const errors = UserSchema.validate(obj);

    // console.log("errors", errors);
    // big no-no to store password in plain text....
    // https://www.npmjs.com/package/bcrypt

    // return
    if (errors.length > 0) {
        return {error: errors[0].message};
    }

    const user = await getUsername(obj.username);

    if (!user) {

        // hash
        const hash = bcrypt.hashSync(obj.password, saltRounds);
        obj.password = hash;

        // if no errors - save to database, return result    
        return await db.collection("users").insertOne(obj);

     } else {
         return {error: "Användare finns redan!"};
 }
}

async function loginUser(obj) {

    // check if users exists
    const user = await getUsername(obj.username);

    if (!user) {
        return {error: "Login fail"};
    }

    // compare hashed obj.password | hashed password in database
    const matchPassword = bcrypt.compareSync(obj.password, user.password);

    if (!matchPassword) {
        return {error: "Login fail"};
    } else {
        return {result: "success", message: "Password match", user: user}
    }
}

async function getUsername(username) {
    return await db.collection("users").findOne({username: username});
};

async function getAllTweets(req, res) {
    let newTweets = await db.collection("newTweets").find({}).toArray()
    console.log(newTweets);
    res.render('about', newTweets);
}


async function createTweet (req, res) {
    try {
        const { username, textContent, status } = req.body;
console.log(req.body);

        const newTweet = await db.collection('newTweets').insertOne({
            createdAt: new Date().toLocaleString("sv-SE"),
            userName: username,
            textContent: textContent,
            status: status
        })

   let newTweets = await db.collection("newTweets").find({}).toArray()
        console.log(newTweets);
        res.render("tweet", {
            success: true,
            message: "Create tweet success",
            data: newTweets
        })
    } catch (error) {
        res.render("index", {
            success: false,
            message: "Create tweet failed"
        })
    }
}


export { listUsers, addUser, loginUser, getAllTweets, createTweet };