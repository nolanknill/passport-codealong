import express from "express";
const router = express.Router();

import passport from "passport";
import dotenv from "dotenv";
dotenv.config();

// GET /auth/github
router.get("/github", passport.authenticate("github"));

// GET /auth/github/callback
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: `${process.env.CLIENT_URL}/auth-fail`,
  }),
  (_req, res) => {
    // Successful authentication, redirect to client-side application
    console.log("Successfully logged in with GitHub");
    res.redirect(process.env.CLIENT_URL);
  }
);

router.get('/success-callback', (req, res) => {
    if (req.user) {
      res.status(200).json(req.user);
    } else {
      res.status(401).json({ message: 'User is not logged in' });
    }
});

// Export the router module
export default router;
