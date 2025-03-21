const Listing=require("../models/listing")
const Review=require("../models/reviews")
module.exports.showReview=async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/review.ejs", { listing });
  };

module.exports.createNewReview=async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    newReview.author=req.user._id;

    await listing.save();
    await newReview.save(); 

    console.log(newReview);
    req.flash("success", "Review Added");
    res.redirect(`/listings/${listing.id}`);
  };

module.exports.destroyReview=async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
  };