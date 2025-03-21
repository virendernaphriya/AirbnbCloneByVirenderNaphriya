const mongoose = require('mongoose');
const Listing = require('../models/listing');
const initData = require('../init/data.js');

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

main()
.then(()=>{console.log('Database connected')})
.catch((err)=>{console.log(err)});

const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:'67c28244c2e286ec4ab230a3'}));
    await Listing.insertMany(initData.data);
    console.log("Database initialized");
}
initDB();