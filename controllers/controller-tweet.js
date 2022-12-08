import connectDatabase from '../configurations/mongodb.js';
let db = await connectDatabase();

import {tweetSchema} from '../models/tweets.js'

import objId from 'mongodb'

async function getAllTweets(req, res) {
    let newTweets = await db.collection("newTweets").find({}).toArray()

    res.render('makeTweet', newTweets);
}

async function createTweet(req, res) {
    try {
        const {
            username,
            textContent,
            status
        } = req.body;
        console.log(req.body);

        const newTweet = await db.collection('newTweets').insertOne({
            createdAt: new Date().toLocaleString("sv-SE"),
            userName: username,
            textContent: textContent,
            status: status
        })

        let newTweets = await db.collection("newTweets").find({}).toArray()
        // console.log(newTweets);
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

async function deleteTweet(id) {

    try {

        console.log(id);

        const objId = new ObjectId(id)

        console.log(objId);

        const result = await db.collection("newTweets").deleteOne({_id: objId})

        if (result.deletedCount == 0) {

            throw {message: "no delete was made"};

        }

        return result;

        return {success: true, message: "tweet Deleted id: objId:"};

    } catch (err) {
        console.log(err.message);
    } finally {
        // res.redirect("/")

        // meddelar klienten att nu är tweeten raderad
        return {success: true, message: "tweet Deleted id: objId:"};
    }
}

// async function editTweet(id) {

//     try {

//         console.log(id);

//         const objId = new ObjectId(id)

//         console.log(objId);

//         const result = await db.collection("newTweets").findOneAndUpdate({_id: objId})

//         // if (result.deletedCount == 0) {

//         //     throw {message: "no delete was made"};

//         // }

//         return result;

//         return {success: true, message: "tweet Deleted id: objId:"};

//     } catch (err) {
//         console.log(err.message);
//     } finally {
//         // res.redirect("/")

//         // meddelar klienten att nu är tweeten raderad
//         return {success: true, message: "tweet Deleted id: objId:"};
//     }
// }



export {createTweet, deleteTweet, getAllTweets}