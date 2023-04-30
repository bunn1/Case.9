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

        const author = req.session.username
        console.log(author)
        if (!author ) {
            throw new Error("Not Logged In!")
        }

        const newTweet = await db.collection('newTweets').insertOne({
            author: req.session.username,
            createdAt: new Date().toLocaleString("sv-SE"),
            userName: username,
            textContent: textContent,
            status: status
        })

        // Efter att den nya tweeten har satts in i databasen fångas alla tweets från newTweets genom find metoden och omvandlar resultat till en array. Därefter renderas en tweet med ny data eller error.
        let newTweets = await db.collection("newTweets").find({}).toArray()

        req.flash('create_msg', 'Good Created Tweet!');
        res.redirect("/user/seeTweet")
    } catch (error) {
        console.log(error)
    }
}

async function getAllTweet(author){
    return await db.collection("newTweets").find({
        $or: [
          { status: "public" },
          { author: author }
        ]
      }).toArray();
      
}

async function getAuthor(id){
  return await db.collection("newTweets").findOne(
    { _id: ObjectId(id) },
    { author: 1 }
  );
}

async function getPublicTweet(){
    

    return await db.collection("newTweets").find({ status: "public" }).toArray();

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

// Uppdater tweet i tweets collection med specifikt id genom att använda $set operator. Den uppdaterar tweets username, textcontent och status fältet.
// Sen omdirigeras användaren till den uppdaterade tweets details sidan.
const updateTweetById = async (body) => {

    // const { id } = req.params;
    const { id, name, tweet, status } = body;
    console.log(typeof id);
   
      const result = await db.collection("newTweets").updateOne(
     
        { _id: ObjectId (id) },
        
        {
          $set: {
            userName: name,
            textContent: tweet,
            status: status
          },
        }
      );
      console.log(result)
  };

export {createTweet, deleteTweet, getTweetById , updateTweetById, getAllTweet, getPublicTweet, getAuthor}