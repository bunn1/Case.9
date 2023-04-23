import{ connectDatabase } from '../configurations/mongodb.js';
import Tweet from '../models/tweets.js'
import { ObjectId} from 'mongodb'

let db = await connectDatabase();

// Hämtar en tweet från en MongDB-databas baserat på dess ID och visar sedan makeTweet vyn på websidan
async function getTweetById(req, res) {
    const tweetId = req.params.id;
    const tweet = await db .collection('newTweets').findOne({ _id:ObjectId(tweetId) }); 
    res.render('makeTweet', { tweet });
}

// Skapar en ny tweet och sätter in den i databasen
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

        // Efter att den nya tweeten har satts in i databasen fångas alla tweets från newTweets genom find metoden och omvandlar resultat till en array. Därefter renderas en tweet med ny data eller error.
        let newTweets = await db.collection("newTweets").find({}).toArray()
        console.log(newTweets);
        res.render("tweet", {
            success: true,
            message: "Create tweet success",
            data: newTweets
        })
        // res.redirect("/user/createTweet")
    } catch (error) {
        res.render("index", {
            success: false,
            message: "Create tweet failed"
        })
    }
}

async function getTweet(){
    return await db.collection("newTweets").find({}).toArray()
}

// Delete en tweet
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

// Uppdatera befintlig tweet med hjälp av Mongoose. tweetId och tweetText extraheras från req.body. findOneAndUpdate söker efter tweeten med matchande tweetId och uppdaterar dess text och returnerar  den nya tweeten
// const updateTweet = async (req, res) => {
//     const { tweetId, tweetText  } = req.body;

//     try {
//         const updatedTweet = await Tweet.findOneAndUpdate(
//             { _id: tweetId },
//             { $set: { text: tweetText } },
//             { new: true }
//         );

//         res.redirect('/');
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Serverfel - försök igen senare!')
//     }
// }

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

export {createTweet, deleteTweet, getTweetById , updateTweetById, getTweet}