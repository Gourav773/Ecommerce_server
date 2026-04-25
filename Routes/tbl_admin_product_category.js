const express = require('express')
const AdminProduct = express.Router();

const { addCategory, viewCategory, updateCategory, viewCategoryByName } = require("../Controller/tbl_admin_product_category")

AdminProduct.post("/api/admin/category/addcategory", addCategory);                                  
AdminProduct.get("/api/admin/category/viewcategory", viewCategory);  
AdminProduct.patch("/api/admin/category/updatecategory/:Pcategoryid", updateCategory);                                  
AdminProduct.get("/api/admin/category/findcat/:Categoryname", viewCategoryByName);  

module.exports = { AdminProduct }    

 