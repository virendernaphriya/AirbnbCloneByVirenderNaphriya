const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const { all } = require("../routes/listing");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  try {
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs", { 
      allListings,
      currentCategory: null,
      newUser: req.user
    });
  } catch (error) {
    console.error("Error fetching listings:", error);
    req.flash("error", "Failed to load listings");
    res.send("Error fetching listings");
  }
};

module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};

//filter in index for listings  
module.exports.filterListings = async (req, res) => {
  try {
    const { minPrice, maxPrice, placeType, essentials, category } = req.query;
    let filter = {};

    // Add category filter if provided
    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }

    if (placeType && placeType.length > 0 ) {
      filter.placeType = { $in: Array.isArray(placeType) ? placeType : [placeType] };
    }

    if (essentials && essentials.length > 0) {
      filter.essentials = { 
        $all: Array.isArray(essentials) ? essentials : [essentials] 
      };
    }

    const filteredListings = await Listing.find(filter);
    
    res.render("listings/filter.ejs", { 
      filteredListings,
      currentCategory: category || null,
      filters: {
        minPrice,
        maxPrice,
        placeType: Array.isArray(placeType) ? placeType : placeType ? [placeType] : [],
        essentials: Array.isArray(essentials) ? essentials : essentials ? [essentials] : []
      },
      newUser: req.user
    });
  } catch (error) {
    console.error("Error in filter listings:", error);
    req.flash("error", "Error applying filters");
    res.redirect("/listings");
  }
};

//filter in category for listings 
module.exports.filterListingsCategory = async (req, res) => {
  try {
    const { minPrice, maxPrice, placeType, essentials } = req.query;
    const category = req.params.category;
    
    // Build filter object starting with category
    let filter = { category: category };
    
    // Add price filter if provided
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    // Add place type filter if provided
    if (placeType && placeType.length > 0) {
      if (Array.isArray(placeType)) {
        filter.placeType = { $in: placeType };
      } else {
        filter.placeType = placeType;
      }
    }
    
    // Add essentials filter if provided
    if (essentials && essentials.length > 0) {
      if (Array.isArray(essentials)) {
        filter.essentials = { $all: essentials };
      } else {
        filter.essentials = essentials;
      }
    }
    
    // Single query with all filters
    const filteredListings = await Listing.find(filter);
    
    // Prepare filter data for the template
    const filterData = {
      minPrice: minPrice || "",
      maxPrice: maxPrice || "",
      placeType: Array.isArray(placeType) ? placeType : placeType ? [placeType] : [],
      essentials: Array.isArray(essentials) ? essentials : essentials ? [essentials] : []
    };
    
    res.render("./listings/category.ejs", { 
      categoryListings: filteredListings,
      filters: filterData,
      newUser: req.user
    });
  } catch (error) {
    console.error("Error filtering listings:", error);
    req.flash("error", "Error filtering listings");
    res.redirect("/listings");
  }
};



module.exports.createNewListing = async (req, res, next) => {
  try {
    let response = await geocodingClient
      .forwardGeocode({
        query: req.body.location,
        limit: 2,
      })
      .send();

    const { title, description, price, location, country, category, placeType } = req.body;
    const essentials = Array.isArray(req.body.essentials) ? req.body.essentials : [];
    const url = req.file.path;
    const filename = req.file.filename;

    let listing = new Listing({
      title,
      description,
      price,
      location,
      country,
      category,
      placeType,
      essentials
    });
    
    listing.image.url = url;
    listing.image.filename = filename;
    listing.owner = req.user._id;
    listing.geometry = response.body.features[0].geometry;
    
    const savedListing = await listing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created Successfully");
    res.redirect("/listings");
  } catch (error) {
    console.error("Error creating listing:", error);
    req.flash("error", "Something went wrong while creating the listing");
    res.redirect("/listings/new");
  }
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  let oringinalImgUrl = listing.image.url;
  oringinalImgUrl = oringinalImgUrl.replace("/upload", "/upload/w_200");
  res.render("./listings/edit.ejs", { listing, oringinalImgUrl });
};

module.exports.updateListing = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.location,
      limit: 2,
    })
    .send();

  let { id } = req.params;
  const { title, description,category, price, location, country ,placeType,essentials} = req.body;

  // const url = req.body.image.url || "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60";
  // //req.body.image returns an object that is our image object in which filename and url two key value pairs we can also write it like this const {url}=req.body.image; this is also a valid syntax

  let listing = await Listing.findByIdAndUpdate(
    id,
    { title, description,category,price, location, country ,placeType,essentials},
    { new: true }
  );
  if (response.body.features.length > 0) {
    listing.geometry = response.body.features[0].geometry;
    
  } else {
    console.log("Geocoding failed: No coordinates found");
  }


  if (req.file) {
    const url = req.file.path;
    const filename = req.file.filename;
    listing.image.url = url;
    listing.image.filename = filename;
  }
  
  await listing.save();
  console.log(listing);
  req.flash("success", "Listing Updated Successfully");
  res.render("./listings/show.ejs",{listing});
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Cannot find that listing");
    return res.redirect("/listings");
  }
  res.render("./listings/show.ejs", { listing });
};

module.exports.destroy = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted Successfully");
  res.redirect("/listings");
};

module.exports.listingCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const categoryListings = await Listing.find({ category: category });
    
    // Build filter data
    const filterData = {
      minPrice: req.query.minPrice || '',
      maxPrice: req.query.maxPrice || '',
      placeType: Array.isArray(req.query.placeType) ? req.query.placeType : req.query.placeType ? [req.query.placeType] : [],
      essentials: Array.isArray(req.query.essentials) ? req.query.essentials : req.query.essentials ? [req.query.essentials] : []
    };

    res.render("listings/category.ejs", { 
      categoryListings, 
      currentCategory: category,  // Pass the exact category name
      filterData,
      newUser: req.user 
    });
  } catch (error) {
    console.error("Error in listing category:", error);
    req.flash("error", "Error loading category listings");
    res.redirect("/listings");
  }
};

module.exports.listingSearch = async (req, res) => {
  try {
    const searchValue = req.body.search;
    console.log("Search value:", searchValue);

    const searchListings = await Listing.find({
      location: { $regex: new RegExp(searchValue, 'i') }
    });
    
    console.log("Search results:", searchListings);
    
    res.render("./listings/searchListings.ejs", { 
      searchListings,
      currentCategory: searchListings.length > 0 ? searchListings[0].category : null,
      newUser: req.user
    });
  } catch(error) {
    console.error("Error in search:", error);
    req.flash("error", "Something went wrong in listing search");
    res.redirect("/listings");
  }
};


