const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const Review=require("./reviews");
const User=require("./user");

const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    price:{
        type:Number,
        required:true
    },
    location:{
        type:String
    },
    image:{
        // type:String,
        // default:"https://unsplash.com/photos/waves-of-body-of-water-splashing-on-sand-mBQIfKlvowM",
        // set:(v)=>v===""? "https://unsplash.com/photos/waves-of-body-of-water-splashing-on-sand-mBQIfKlvowM":v

        filename: {
            type: String,
            default: "default_image"
        },
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
        }
    },
    country:{
        type:String
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
        },
        coordinates: {
          type: [Number],
        }
    },
    category:{
        type:String,
        enum:["Treehouse","Farm","Cabin","Countryside","Beach","Historical home","Castles","Lakefront","Beachfront","Tiny home","Top cities","Camping","Desert","Amazing pools","Arctic"]
    },
    placeType: {
        type: [String],
       enum:["Any Type","Room","Entire Home"]
    },
    essentials: [{
        type: String,
        enum: ["WiFi", "Pool", "Parking"]
    }]
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}});
  }
})

const Listing=mongoose.model('Listing',listingSchema);
module.exports=Listing;