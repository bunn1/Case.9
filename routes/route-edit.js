
import express from 'express';
import { ObjectId } from 'mongodb';
import { connectDatabase } from '../configurations/mongodb.js';

export const tweetRouter = express.Router();

// Hämtar tweet från databasen baserat på Id. Den ansluter till databasen och sen hämtar den tweeten med hjälp av findOne()
export async function getTweetById(id) {
    try {
        const db = await connectDatabase();
        const tweet = await db.collection('newTweets').findOne({ _id: ObjectId(id) });
        return tweet;
    } catch (error) {
        console.error(error);
        throw new Error('Could not find tweet');
    }
}

// Funktionen uppdaterar text fältet av en tweet med rätt id i databasen
export async function updateTweetById(id, text) {
    try {
      const db = await connectDatabase();
      await db.collection('newTweets').updateOne({ _id: ObjectId(id) }, { $set: { text } });
    } catch (error) {
      console.error(error);
      throw new Error('Could not update tweet');
    }
}

// GET rutt skapas för att hämta tweet baserat på id och sedan visas en vy för att redigera tweeten.
tweetRouter.get('/tweets/:id/edit', async (req, res) => {
  try {
    const tweet = await getTweetById(req.params.id);
    res.render('edit', { tweet });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error - could not get tweet');
  }
});

// Tar hand om formulärdata och skickar den till updateTweetById funktionen för att uppdatera tweeten i databasen. ID hämtas från req.params.id
// Sen skickas användaren tillbaka till huvudsidan.
tweetRouter.post('/tweets/:id/edit', async (req, res) => {
    try {
      await updateTweetById(req.params.id, req.body.text);
      res.redirect('/user/createTweet');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error - could not update tweet');
    }
  });

// PUT-rutt tar hand om formulärdata och skickar den till updateTweetById funktionen för att uppdatera tweeten i databasen.
tweetRouter.put('/tweets/:id/edit', async (req, res) => {
  try {
    await updateTweetById(req.params.id, req.body.text);
    res.redirect('/tweets');
  } catch (error) {
    console.error('Error updating tweet', error);
    res.redirect('/tweets');
  }
});

// Rutt för att hämta en tweet för att skapa en ny tweet baserat på den befintliga tweeten.
tweetRouter.get('/tweets/:id/makeTweet', async (req, res) => {
  try {
    const tweet = await getTweetById(req.params.id);
    res.render('makeTweet', { 
      tweet: tweet
    });
  } catch (error) {
    console.error('Error getting tweet', error);
    res.redirect('/tweets');
  }
});

export default tweetRouter;