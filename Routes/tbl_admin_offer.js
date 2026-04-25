const express = require('express')
const AdminOffer = express.Router();

const { addOffer, viewOffer, updateOffer, updateOfferStatus, searchByPercentageDiscount } = require("../Controller/tbl_admin_offer")

AdminOffer.post("/api/admin/offer/createoffer", addOffer);                                  
AdminOffer.get("/api/admin/offer/viewoffer", viewOffer);  
AdminOffer.put("/api/admin/offer/updateoffer/:offerid", updateOffer);                                  
AdminOffer.put("/api/admin/offer/updatestatus", updateOfferStatus);        ///bysr AdminOffer.put("/api/admin/offer/updatestatus/:offerid", updateOfferStatus);
AdminOffer.put("/api/admin/offer/updatestatus/:offerid", updateOfferStatus);
AdminOffer.get("/api/admin/offer/findoffer", searchByPercentageDiscount);

module.exports = { AdminOffer }     
        
