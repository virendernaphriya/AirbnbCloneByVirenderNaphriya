
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
    (req, res, next) => {
      passport.authenticate("local", (err, user, info) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          // Authentication failed - return JSON response with error message
          req.flash("error", "Incorrect username or password");
          return res.redirect("/listings");
        }
        // Authentication succeeded - proceed with login
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          // Call the loginUser controller
          userController.loginUser(req, res);
        });
      })(req, res, next);
    }
  );

router.get("/logout", userController.logoutUser);

module.exports = router;
