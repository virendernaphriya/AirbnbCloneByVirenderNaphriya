const User = require('../models/user');

module.exports.signupUser=async (req,res)=>{
    try {
        const {email,username,password}=req.body;
        const user=new User({email,username});
        const newUser=await User.register(user,password); 
        console.log(newUser);  
        req.logIn(newUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust");
            
            // Get redirectUrl from the form body, locals or session, with a fallback to /listings
            let redirectUrl = req.body.redirectUrl || res.locals.redirectUrl || req.session.redirectUrl || "/listings";
            
            // Ensure redirectUrl is a string (not an array)
            if (Array.isArray(redirectUrl)) {
                redirectUrl = redirectUrl[0]; // Take the first value if it's an array
            }
            
            console.log("Signup - Redirecting to:", redirectUrl);
            
            // Clear the redirectUrl from session to prevent future unwanted redirects
            delete req.session.redirectUrl;
            
            res.redirect(redirectUrl);
        });
    } catch (e) {
        console.log("error in signup",e);
        req.flash("error",e.message);
        res.redirect("/listings");
    }
};

module.exports.loginUser=(req,res)=>{
    req.flash("success","Welcome back");
    
    // Get redirectUrl from form body, locals or session, with a fallback to /listings
    let redirectUrl = req.body.redirectUrl || res.locals.redirectUrl || req.session.redirectUrl || "/listings";
    
    // Ensure redirectUrl is a string (not an array)
    if (Array.isArray(redirectUrl)) {
        redirectUrl = redirectUrl[0]; // Take the first value if it's an array
    }
    
    console.log("Redirecting after login to:", redirectUrl);
    
    // Clear the redirectUrl from session to prevent future unwanted redirects
    delete req.session.redirectUrl;
    
    res.redirect(redirectUrl);
}

module.exports.logoutUser=(req,res,next)=>{
    req.logOut((err)=>{
     if(err){
         return next(err);
     }
     req.flash("success","you logged out");
     res.redirect("/listings");
    }) 
 };