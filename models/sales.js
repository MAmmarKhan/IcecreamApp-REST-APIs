const mongoose = require("mongoose");

var Sales = mongoose.model('Sales',
{
    date: {type:Date, default: Date.now},
    flavour : {type:String},
    type : {type:String},
    quantity : {type:Number, min: 1},
    price: {type:Number}
})
module.exports = { Sales }

