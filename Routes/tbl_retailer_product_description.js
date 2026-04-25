const express = require('express')
const retailerProductsDescription = express.Router();

const {addRetailerProductsDes,updateRetailerProductUpdateDesc,getRetailerProductsDesc} = require("../Controller/tbl_retailer_product_description")




retailerProductsDescription.post("/api/retailer/productdescription/adddescription",addRetailerProductsDes);                                 
retailerProductsDescription.patch("/api/retailer/productdescription/updatedesc/:pid", updateRetailerProductUpdateDesc);
retailerProductsDescription.get("/api/retailer/productdescription/viewdescription/:pid", getRetailerProductsDesc);     
 


module.exports = { retailerProductsDescription }    



