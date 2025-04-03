const Joi = require('joi');
module.exports.listingSchema=Joi.object({
    title:Joi.string().min(3).max(100).required(),
    description:Joi.string().min(3).max(1000).required(),
    price:Joi.number().min(0).required(),
    location:Joi.string().min(3).max(30).required(),
    country:Joi.string().min(3).max(30).required(),
    image:Joi.object({
        filename:Joi.string(),
        url:Joi.string().allow(null)
    }),
    category: Joi.string().valid("Treehouse", "Farm", "Cabin", "Countryside", "Beach", "HistoricalHome", "Castles", "Lakefront", "Beachfront", "TinyHome", "TopCities", "Camping", "Desert", "AmazingPools", "Arctic").required(),
    placeType: Joi.array().items(Joi.string().valid("Any Type", "Room", "Entire Home")),
    essentials: Joi.array().items(Joi.string().valid("WiFi", "Pool", "Parking"))
})

module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().min(1).max(5).required(),
        comment:Joi.string().required()
    }).required()
})