const express = require('express')
const retailerProducts = express.Router();

const {addRetailerProducts,getRetailerProduct,updateRetailerProductsPrice,updateRetailerProductsDiscount,updateRetailerProductsQuantity, getAdminAllProducts} = require("../Controller/tbl_retailer_products")
retailerProducts.post("/api/retailer/product/addnew", addRetailerProducts);                                 
retailerProducts.get("/api/retailer/product/productlist/:regno", getRetailerProduct);
retailerProducts.patch("/api/retailer/product/updateprice/:pid", updateRetailerProductsPrice);                                                   
retailerProducts.patch("/api/retailer/product/updatediscount/:pid", updateRetailerProductsDiscount);                   
retailerProducts.patch("/api/retailer/product/updatequantity/:pid", updateRetailerProductsQuantity);                   
retailerProducts.get("/api/admin/retailer/product/allproducts", getAdminAllProducts);      ///use pagination on backend
// retailerProducts.get("/api/admin/retailer/total", getRetailerTotal);                        ////76



module.exports = { retailerProducts }   
  