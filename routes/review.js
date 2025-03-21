const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utis/wrapAsync");
const ExpressError=require("../utis/ExpressError");
const {listingSchema,reviewSchema} = require("../schema");
const { isLoggedIn, isOwner, isReviewAuthor } = require("../middleware");
const reviewController=require("../controllers/review");



const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
      let errMsg=error.details.map(el=>el.message).join(",");
        throw new ExpressError(400,errMsg );
    }else{
        next();
    }
}


router.route("/")
.get(
  isLoggedIn,
  wrapAsync(reviewController.showReview)
)
.post(
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createNewReview)
)

//Delete Review Route 
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports=router;
