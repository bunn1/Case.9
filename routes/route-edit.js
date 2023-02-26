// Nytt  22 feb- 23---------------------------------------------------------
import express from 'express';
import { ObjectId } from 'mongodb';
import { connectDatabase } from '../configurations/mongodb.js';
// import { updateTweetById } from '../routes/route-edit.js';

const router = express.Router();

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
  router.get('/tweets/:id/edit', async (req, res) => {
    try {
      const tweet = await getTweetById(req.params.id);
      res.render('edit', { tweet });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error - could not get tweet');
    }
  });

  // Routen triggas när en användare skickar in en edit form för en tweet med specifikt ID
  router.post('/tweets/:id/edit', async (req, res) => {
    try {
      await updateTweetById(req.params.id, req.body.text);
      res.redirect('/');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error - could not update tweet');
    }
  });

  export default router;


