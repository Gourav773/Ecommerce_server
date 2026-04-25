// const express = require('express')
// const Retailer = express.Router();
// const jwt = require('jsonwebtoken')
// const config = require('../config');


// const {Login, addRetailer, getRetailerByRegNo, updateRetailer, updateStatus, updatePassword, updateDocuments, viewAllShops,getdata,Logout  } = require("../Controller/tbl_retailer_register")

// const { upload } = require('../multerS3/multer');

// const maybeUploadDocshop = (req, res, next) => {
//     const contentType = req.headers['content-type'] || '';
//     if (contentType.includes('multipart/form-data')) {
//         return upload.single('docshop')(req, res, next);
//     }
//     return next();
// };

// Retailer.post("/api/retailer/newshopregister", maybeUploadDocshop, addRetailer);
// // Retailer.post("/api/retailer/newshopregister", upload.array('images',3), addRetailer); 

// // Retailer.post('/api/retailer/newshopregister', upload.fields([
// //     { name: 'document_reg_no' },
// //     { name: 'docpan' }, 
// //     { name: 'docshop' } 
// // ]), addRetailer);
      
// const verifyUser = (req, res, next) => {
//     const token = req.cookies.token 
//     console.log(req.cookies.token);
//     if (!token) {
//         return res.status(401).json({ message: "Unauthorized: No token provided" });
//     } else {
//         jwt.verify(token, config.jwt.secret, (err, decoded) => {
//             if (err) {
//                 return res.status(401).json({ message: "Unauthorized: Invalid token" });
//             } else {
//                 req.email = decoded.email;
//                 req.regno = decoded.regID;
//                 next();
//             }
//         });
//     }
// };

// Retailer.get('/api/retailer/viewshop/:regno', getRetailerByRegNo);  
// Retailer.put("/api/retailer/updateshop/:regno", updateRetailer );                 
// Retailer.put("/api/retailer/updatestatus", updateStatus );                               ////old by sr    Retailer.put("/api/retailer/updatestatus/:regno", updateStatus );              
// Retailer.patch("/api/retailer/updatepwd/:regno", updatePassword );               
// // Retailer.patch("/api/retailer/updatepwd/:regno", upload.array('docshop', 3), updatePassword );               
// Retailer.patch("/api/retailer/updatedocuments/:regno", updateDocuments );               
// Retailer.get("/api/admin/viewshops", viewAllShops );   

// // Retailer.post("/api/retailer/userLogin",userLogin);

// Retailer.post("/api/retailer/login",Login);

// Retailer.get("/api/retailer/getdata", verifyUser ,getdata);

// Retailer.get("/api/retailer/logout",Logout);
// // Retailer.get("/api/retailer/getData",getData);


// module.exports = { Retailer }       
     

const express = require('express');
const Retailer = express.Router();

const verifyUser = require("../middleware/retailerAuth"); // ✅ ONLY ONE

const {
  Login,
  addRetailer,
  getRetailerByRegNo,
  updateRetailer,
  updateStatus,
  updatePassword,
  updateDocuments,
  viewAllShops,
  getdata,
  Logout
} = require("../Controller/tbl_retailer_register");

const { upload } = require('../multerS3/multer');

const maybeUploadDocshop = (req, res, next) => {
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('multipart/form-data')) {
    return upload.single('docshop')(req, res, next);
  }
  return next();
};

Retailer.post("/api/retailer/newshopregister", maybeUploadDocshop, addRetailer);

Retailer.post("/api/retailer/login", Login);

// ✅ protected route
Retailer.get("/api/retailer/getdata", verifyUser, getdata);

Retailer.get('/api/retailer/viewshop/:regno', getRetailerByRegNo);
Retailer.put("/api/retailer/updateshop/:regno", updateRetailer);
Retailer.put("/api/retailer/updatestatus", updateStatus);
Retailer.patch("/api/retailer/updatepwd/:regno", updatePassword);
Retailer.patch("/api/retailer/updatedocuments/:regno", updateDocuments);
Retailer.get("/api/admin/viewshops", viewAllShops);

Retailer.get("/api/retailer/logout", Logout);

module.exports = { Retailer };