import express from 'express';
import { SITE_NAME } from '../configs.js';
const router = express.Router();

// render page using ejs
router.get("/", (req, res) => {
        res.render("start", {site: SITE_NAME});
});




// render page using ejs
router.get("/makeTweet", (req, res) => {
        res.render("makeTweet", {site: SITE_NAME});
});

export default router;