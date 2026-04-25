const express = require('express');
const retailerOrders = express.Router();

const {
    addOrder,
    getOrdersByRegNo,
    getOrderById,
    updateOrderStatus,
    updatePaymentStatus,
    updateDeliveryDate,
    deleteOrder,
    getOrderStats,
    getAllOrders
} = require("../Controller/tbl_retailer_orders");

// Retailer order routes
retailerOrders.post("/api/retailer/order/addnew", addOrder);
retailerOrders.get("/api/retailer/order/orderlist/:regno", getOrdersByRegNo);
retailerOrders.get("/api/retailer/order/view/:orderid", getOrderById);
retailerOrders.patch("/api/retailer/order/updatestatus/:orderid", updateOrderStatus);
retailerOrders.patch("/api/retailer/order/updatepayment/:orderid", updatePaymentStatus);
retailerOrders.patch("/api/retailer/order/updatedelivery/:orderid", updateDeliveryDate);
retailerOrders.delete("/api/retailer/order/delete/:orderid", deleteOrder);
retailerOrders.get("/api/retailer/order/stats/:regno", getOrderStats);

// Admin routes
retailerOrders.get("/api/admin/retailer/order/allorders", getAllOrders);

module.exports = { retailerOrders };
