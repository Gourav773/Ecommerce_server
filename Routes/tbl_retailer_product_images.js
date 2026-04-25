const express = require('express')
const retailerProductsImages = express.Router();

const {addRetailerProductsImages,updateRetailerProductsImage, viewRetailerProductsImages} = require("../Controller/tbl_retailer_product_images")

const { upload } = require('../multerS3/multer');

retailerProductsImages.post("/api/retailer/productimage/addnew", upload.single('image'), addRetailerProductsImages);                   
retailerProductsImages.patch("/api/retailer/productimage/update/:imgid", upload.single('image'), updateRetailerProductsImage);                   
retailerProductsImages.get("/api/retailer/productimage/viewimages/:pid", viewRetailerProductsImages);                   
  

module.exports = { retailerProductsImages }        
