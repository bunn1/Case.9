// Nytt  22 feb- 23---------------------------------------------------------
import express from 'express';
import { ObjectId } from 'mongodb';
import { connectDatabase } from '../configurations/mongodb.js';
// import { updateTweetById } from '../routes/route-edit.js';

const router = express.Router();

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

   export async function updateTweetById(id, text) {
    try {
      const db = await connectDatabase();
      await db.collection('newTweets').updateOne({ _id: ObjectId(id) }, { $set: { text } });
    } catch (error) {
      console.error(error);
      throw new Error('Could not update tweet');
    }
  }

  router.get('/tweets/:id/edit', async (req, res) => {
    try {
      const tweet = await getTweetById(req.params.id);
      res.render('edit', { tweet });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error - could not get tweet');
    }
  });

  
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


