const express = require('express')
const retailerBanking = express.Router();

const {addRetailerBanking, viewRetailerBankingDetail,viewAdminBankingAll, updateRetailerBanking, updateRetailerBankingUpi, updateRetailerBankingStatus} = require("../Controller/tbl_retailer_banking")


retailerBanking.post("/api/retailer/banking", addRetailerBanking);                   
retailerBanking.get("/api/retailer/banking/:regno", viewRetailerBankingDetail);                   
retailerBanking.get("/api/admin/banking", viewAdminBankingAll);                   
retailerBanking.put("/api/retailer/banking/:regno", updateRetailerBanking);                   
retailerBanking.put("/api/retailer/bankingstatusupdate", updateRetailerBankingStatus);                 ////not work    
retailerBanking.patch("/api/retailer/bankingupi/:regno", updateRetailerBankingUpi);                   
    

module.exports = { retailerBanking }           
