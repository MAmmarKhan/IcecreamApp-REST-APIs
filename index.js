const dotenv = require('dotenv');
dotenv.config();
const Mongoose = require("mongoose")

Mongoose.connect(process.env.mongdbURL,{useNewUrlParser:true,useUnifiedTopology:true} ,err => 
{
    if(!err)
        console.log("Mongodb ATLAS Connection succeded");
    else
        console.log("Mongodb ATLAS Connection failed");
});  


