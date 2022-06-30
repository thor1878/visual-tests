import fetch from "node-fetch";
import { Router } from "express";
import passport from "passport";
import '../middleware/passport.js';

const router = new Router();

router.get('/login', (req, res, next) => {
    
    next();
}, passport.authenticate('github', { scope: ['repo'] }));

router.get('/auth/github/callback', passport.authenticate('github', {
    successRedirect: '/',
    failureRedirect: '/'
}))

router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    })
})

export default router;
