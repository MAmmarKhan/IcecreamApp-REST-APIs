const express = require('express');
var router = express.Router();

var { Purchase } = require('../models/purchase');

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
        if(this.queryString.sort){
            const sortby = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortby);
        }else{
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }
    paginating() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 10;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

router.get('/',(req,res) => {
    Purchase.find((err,docs) => {
        if (!err) {
            res.send(docs);
        }
        else
            console.log('Error while retirving');
    })
});

router.get('/filtered', async(req,res) => {
    try{
        const feature = new APIfeatures(Purchase.find(),req.query).filtering().sorting();
        const purcahses = await feature.query;
        res.send(purcahses);
     }catch(e){
        res.send(e.message);
    }
});

router.post('/',(req,res)=> {
    console.log(req.body);
    var newRecord =  new Purchase ({                
        flavour : req.body.flavour,
        company : req.body.company,
        quantity: req.body.quantity        
    })

    newRecord.save((err,docs)=> {
        if (!err) res.send(docs);
        else
            console.log('Error while creating');     
    })
})

module.exports = router