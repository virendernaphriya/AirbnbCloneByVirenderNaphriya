const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utis/wrapAsync");
const ExpressError = require("../utis/ExpressError");
const { isLoggedIn, isOwner,validateListings } = require("../middleware");
const listingController = require("../controllers/listing");
const multer=require("multer");
const {storage}=require("../cloudconfig");
const upload = multer({ storage });




router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(upload.single("image"),validateListings, wrapAsync(listingController.createNewListing));

router.get("/new", isLoggedIn, listingController.renderNewForm);
router.route("/filter").get(wrapAsync(listingController.filterListings));

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .patch(upload.single("image"),isOwner, wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, isOwner, listingController.destroy);


  router.route("/category/:category").get(listingController.listingCategory);
  router.route("/category/:category/filter").get(listingController.filterListingsCategory);
//new Route
router.route("/search/").post(wrapAsync(listingController.listingSearch));

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);



module.exports = router;
