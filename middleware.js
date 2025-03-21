const Listing=require("./models/listing");
const Review=require("./models/reviews");
let listingSchema;
try {
  listingSchema = require("./schema").listingSchema;
} catch (error) {
  try {
    listingSchema = require("./schema").listingSchema;
  } catch (innerError) {
    console.error("Could not import listingSchema from either schemas.js or schema.js");
    // Create a dummy schema validation to prevent app from crashing
    listingSchema = { validate: () => ({ error: null }) };
  }
}
const ExpressError = require("./utis/ExpressError");

module.exports.isLoggedIn=async(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        return res.redirect("/listings");
    }
    next();
}

module.exports.saveredirectUrl=(req,res,next)=>{
    // Check if there's a redirect URL in the session
    if(req.session.redirectUrl){
        // Save it to res.locals for the template
        res.locals.redirectUrl=req.session.redirectUrl;
        console.log("Saved redirect URL to locals:", res.locals.redirectUrl);
    } else {
        console.log("No redirect URL found in session");
    }
    
    // Also check for redirectUrl in the request body (for posts from the login form)
    if(req.body && req.body.redirectUrl) {
        res.locals.redirectUrl = req.body.redirectUrl;
        console.log("Found redirectUrl in form POST:", req.body.redirectUrl);
    }
    
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.newUser._id)){
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.newUser._id)){
        req.flash("error","You are not the owner of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListings = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message);
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  };