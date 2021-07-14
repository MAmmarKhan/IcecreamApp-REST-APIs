require('./index');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
var port = process.env.PORT || 3000;

var app = express();
app.use(cors());
app.get("/", (req, res) => {
    res.json({ message: "Welcome to CRUD application." });
  });
var salesRoutes = require('./controllers/sales_controller');
var purchasesRoutes = require('./controllers/purchases_controller');
app.use(bodyParser.json());
app.use('/sales',salesRoutes);
app.use('/purchase',purchasesRoutes);

app.listen(port,()=>console.log('Server Started at 4000'));
