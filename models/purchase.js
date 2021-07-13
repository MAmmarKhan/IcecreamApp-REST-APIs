const mongoose = require("mongoose");

var Purchase = mongoose.model('Purchase',
{
    date: {type:Date, default: Date.now},
    flavour : {type:String},
    company : {type:String, required:true, minLenght:3, maxLenght:25},
    quantity : {type:Number, min: 1},
})

module.exports = { Purchase }

