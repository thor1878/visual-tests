import { Router } from "express";
import { HOST } from "../config.js";

const router = new Router();

router.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.dashboardLoadingUrl = HOST + `loading?url=${encodeURIComponent(HOST + 'dashboard')}&message=Scanning+repositories`,
    next();
})

router.get('/', (req, res) => {
    res.render('home');
})

export default router;