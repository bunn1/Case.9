import express from 'express';
import { SITE_NAME } from '../configs.js';
const router = express.Router();

// render page using ejs
router.get("/", (req, res) => {
        res.render("start", {site: SITE_NAME});
});


export default router;