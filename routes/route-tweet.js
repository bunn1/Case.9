// import {Router} from 'express';
// import { ObjectId } from 'mongodb';
// import { getTweetById, updateTweetById } from '../controllers/controller-tweet.js';

// const router = Router();

// // Hitta tweet med id från databasen. Därefter renderas makeTweet sidan och tweeten skickas som ett objekt till sidan
// router.get('/tweets/:id/makeTweet', async (req, res) => {
// try {
// const tweet = await getTweetById(req.params.id);
// res.render('makeTweet', { 
// tweet: tweet
// });
// } catch (err) {
// console.error('Error getting tweet', err);
// res.redirect('/tweets');
// }
// });

// // Tweeten hämtas från databasen mha getTweetById(). Hittas tweeten i databasen en edit vy till klienten där informationen kan redigeras i ett formulär.
// router.get('/tweets/:id/edit', async (req, res) => {
//     try {
//     const tweet = await getTweetById(req.params.id);
//     res.render('edit', {
//     tweet: tweet
//     });
//     } catch (err) {
//     console.error('Error getting tweet', err);
//     res.redirect('/tweets');
//     }
//     });




//   router.post('/tweet/:id', async (req, res) => {
//     console.log(req.body)
//     try {
//       await updateTweetById(req.params.id, req.body.text);
//       res.redirect('/tweets');
//     } catch (err) {
//       console.error('Error updating tweet', err);
//       res.redirect('/user/createTweet');
//     }
//   });


//   // router.post('/tweets/:id', updateTweetById);

//   // router.post('/tweets/:id/edit', updateTweetById);

// export default router;