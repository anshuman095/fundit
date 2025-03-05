import passport from "passport";
import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";
import dotenv from "dotenv";
import { saveAccessToken } from "../../Controller/linkedInController.js";

dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: process.env.LINKEDIN_REDIRECT_URI,
      scope: ["w_member_social"],
      state: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      // Save accessToken and profile information to the database
      try {
        const user = { id: profile.id, accessToken };
        await saveAccessToken(profile.id, accessToken);
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;
