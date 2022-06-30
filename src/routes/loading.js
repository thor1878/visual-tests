import { Router } from "express";

const router = new Router();

router.get('/loading', (req, res) => {
    const { url, content_type } = req.query;
    res.render('loading', { submitUrl: url });
})


export default router;