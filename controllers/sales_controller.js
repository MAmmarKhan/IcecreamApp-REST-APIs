const express = require('express');
var router = express.Router();

var { Sales } = require('../models/sales');

class APIfeatures{
    constructor(query,queryString){
        this.query = query;
        this.queryString = queryString;
    }
    filtering(){
        const queryobj = {...this.queryString};
        const excludedfields = ['page','sort','limit'];
        excludedfields.forEach(element => delete queryobj[element]);
        let  querystr = JSON.stringify(queryobj);      
        querystr = querystr.replace(
            /\b(gte|gt|lt|lte)\b/g,
            match => `$${match}`
            );
        this.query.find(JSON.parse(querystr));
        return this;
    }
    sorting(){
        var gg = JSON.stringify(this.queryString);        
        if (!gg.includes("sort")) {
            return this;
        }
        if((this.queryString.sort[1] === '-price') || (this.queryString.sort[1] === ' price')) {
            const sortby = this.queryString.sort[1] +',' + this.queryString.sort[0];
            this.query = this.query.sort(sortby);
        } else if(this.queryString.sort){
            const sortby = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortby);
        }else{
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }
    paginating() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1|| 5;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

router.get('/',(req,res) => {
    Sales.find((err,docs) => {
        if (!err) {
            res.send(docs);
        }
        else
            console.log('Error while retirving');
    })
});

router.get('/g',async (req,res) => {
    try{
        const feature = new APIfeatures(Sales.find(),req.query).filtering().sorting();
        const sales = await feature.query;
        res.send(sales);
     }catch(e){
        res.send(e.message);
    }
});

router.post('/',(req,res)=> {
    console.log(req.body);
    var newRecord =  new Sales ({        
        flavour : req.body.flavour,
        type : req.body.type,
        quantity : req.body.quantity,
        price: req.body.price
    })

    newRecord.save((err,docs)=> {
        if (!err) res.send(docs);
        else
            console.log('Error while creating');     
    })
})

module.exports = router