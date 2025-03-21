const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { saveredirectUrl } = require("../middleware");
const userController = require("../controllers/users");

// Route for login-required page is no longer needed as we're using index.ejs

router
  .route("/signup")
  .post(
    saveredirectUrl,
    userController.signupUser
  );

router
  .route("/login")
  .post(
    saveredirectUrl,
    passport.authenticate("local", {
      failureFlash: true, // Redirect to index with showLogin parameter
    }),
    userController.loginUser);

router.get("/logout", userController.logoutUser);

module.exports = router;
