import express from "express";

// Middleware for creating a session id on server and a session cookie on client
import expressSession from "express-session";

// cors package prevents CORS errors when using client side API calls
import cors from "cors";

// Add http headers, small layer of security
import helmet from "helmet";

// Passport library and Github Strategy
import passport from "passport";
import passportGitHub from "passport-github2";
const GitHubStrategy = passportGitHub.Strategy;

// Knex instance
import createKnex from "knex";
import knexFile from "../knexfile.js";
const knex = createKnex(knexFile);

const app = express();
const PORT = process.env.PORT || 5050;

// Import .env files for environment variables (keys and secrets)
import dotenv from "dotenv";
dotenv.config();

// Enable req.body middleware
app.use(express.json());

// Initialize HTTP Headers middleware
app.use(helmet());

// Enable CORS (with additional config options required for cookies)
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Include express-session middleware (with additional config options required for Passport session)
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// =========== Passport Config ============

app.use(passport.initialize());

app.use(passport.session());

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    (_accessToken, _refreshToken, profile, done) => {
      console.log("GitHub profile:", profile);

      // First let's check if we already have this user in our DB
      knex("users")
        .select("id")
        .where({ github_id: profile.id })
        .then((user) => {
          if (user.length) {
            // If user is found, pass the user object to serialize function
            done(null, user[0]);
          } else {
            // If user isn't found, we create a record
            knex("users")
              .insert({
                github_id: profile.id,
                avatar_url: profile._json.avatar_url,
                username: profile.username,
              })
              .then((userId) => {
                // Pass the user object to serialize function
                done(null, { id: userId[0] });
              })
              .catch((err) => {
                console.log("Error creating a user", err);
              });
          }
        })
        .catch((err) => {
          console.log("Error fetching a user", err);
        });
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("serializeUser (user object):", user);

  // Store only the user id in session
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  console.log("deserializeUser (user id):", userId);

  // Query user information from the database for currently authenticated user
  knex("users")
    .where({ id: userId })
    .then((user) => {
      console.log("req.user:", user[0]);

      // The full user object will be attached to request object as `req.user`
      done(null, user[0]);
    })
    .catch((err) => {
      console.log("Error finding user", err);
    });
});
