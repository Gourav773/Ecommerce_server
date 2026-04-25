const express = require('express')
const AdminProductSubcategory = express.Router();
const { upload } = require('../multerS3/multer');

const { addSubCategory,viewSubCategory, updateSubCategory,  viewSubCategoryByName, viewSubCategoryByPcategoryid } = require("../Controller/tbl_admin_subcategory")

AdminProductSubcategory.post("/api/admin/subcategory/addsubcat",upload.single('photo'), addSubCategory); 
AdminProductSubcategory.get("/api/admin/subcategory/viewsubcat", viewSubCategory);  
AdminProductSubcategory.put("/api/admin/subcategory/updatesubcat/:Subcategoryid",upload.single('photo'), updateSubCategory);                                  
AdminProductSubcategory.get("/api/admin/subcategory/findsubcat/:Subcategoryname", viewSubCategoryByName);  
AdminProductSubcategory.get("/api/admin/subcategory/viewsubcat/:Pcategoryid", viewSubCategoryByPcategoryid);  

 
module.exports = { AdminProductSubcategory }       
    
  