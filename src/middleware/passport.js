import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";

// Use the GitHub Strategy for Passport
passport.use(new GitHubStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/github/callback',
}, (accessToken, refreshToken, profile, done) => {
    return done(null, {profile: profile, token: accessToken});
}))

passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser((user, done) => {
    done(null, user);
})