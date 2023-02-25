import{ connectDatabase } from '../configurations/mongodb.js';
import Tweet from '../models/tweets.js'
import { ObjectId} from 'mongodb'

let db = await connectDatabase();

async function getTweetById(req, res) {
    const tweetId = req.params.id;
    const tweet = await db .collection('newTweets').findOne({ _id:ObjectId(tweetId) }); 
    res.render('makeTweet', { tweet });
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

const updateTweet = async (req, res) => {
    const { tweetId, tweetText  } = req.body;

    try {
        const updatedTweet = await Tweet.findOneAndUpdate(
            { _id: tweetId },
            { $set: { text: tweetText } },
            { new: true }
        );

        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Serverfel - försök igen senare!')
    }
}

// Uppdater tweet i tweets collection med specifikt id genom att använda $set operator. Den uppdaterar tweets username, textcontent och status fältet.
// Sen omdirigeras användaren till den uppdaterade tweets details sidan.
const updateTweetById = async (req, res) => {
    const { id } = req.params;
    const { username, textContent, status } = req.body;
  
    try {
      const result = await db.collection("tweets").updateOne(
        { _id: ObjectId(id) },
        {
          $set: {
            username,
            textContent,
            status,
          },
        }
      );
      res.redirect(`/user/${result.upsertedId || id}`);
    } catch (error) {
      console.log(error);
      res.status(500).send("Something went wrong.");
    }
  };

export {createTweet, deleteTweet, getTweetById , updateTweetById}