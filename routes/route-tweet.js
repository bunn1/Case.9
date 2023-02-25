import express from 'express';
import { ObjectId } from 'mongodb';
import { getTweetById, updateTweet } from '../controllers/controller-tweet.js';

const router = express.Router();

router.get('/tweets/:id/makeTweet', async (req, res) => {
try {
const tweet = await getTweetById(req.params.id);
res.render('makeTweet', { 
tweet: tweet
});
} catch (err) {
console.error('Error getting tweet', err);
res.redirect('/tweets');
}
});

router.get('/tweets/:id/edit', async (req, res) => {
    try {
    const tweet = await getTweetById(req.params.id);
    res.render('edit', {
    tweet: tweet
    });
    } catch (err) {
    console.error('Error getting tweet', err);
    res.redirect('/tweets');
    }
    });

router.post('/tweets/:id/edit', updateTweetById);

router.post('/tweets/:id', async (req, res) => {
    try {
      await updateTweetById(req.params.id, req.body.text);
      res.redirect('/tweets');
    } catch (err) {
      console.error('Error updating tweet', err);
      res.redirect('/tweets');
    }
  });

export default router;