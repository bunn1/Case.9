import express from 'express';
import { ObjectId } from 'mongodb';
import { getTweetById, updateTweetById } from '../controllers/controller-tweet.js';

const router = express.Router();

// Hitta tweet med id från databasen. Därefter renderas makeTweet sidan och tweeten skickas som ett objekt till sidan
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

// Tweeten hämtas från databasen mha getTweetById(). Hittas tweeten i databasen en edit vy till klienten där informationen kan redigeras i ett formulär.
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


// Routen tar hand om formulärdata och skickar den till updateTweetById funktionen för att uppdatera tweeten i databasen.
router.post('/user/createTweet', async (req, res) => {
    try {
      await updateTweetById(req.params.id, req.body.text);
      res.redirect('/tweets');
    } catch (err) {
      console.error('Error updating tweet', err);
      res.redirect('/user/createTweet');
    }
  });

  router.put('/tweets/:id', updateTweetById);

  // router.post('/tweets/:id/edit', updateTweetById);

export default router;