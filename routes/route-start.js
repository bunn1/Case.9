import express from 'express';
import { SITE_NAME } from '../configs.js';
const router = express.Router();

// render page using ejs
router.get("/", (req, res) => {
        res.render("index", {site: SITE_NAME, username: req.session.username });
});

export default router;