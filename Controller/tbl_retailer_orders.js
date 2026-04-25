const connection = require("../Model/model");

// Add new order
const addOrder = async (req, res) => {
    try {
        const sqlQuery = "INSERT INTO tbl_retailer_orders SET ?";
        const data = {
            orderid: req.body.orderid,
            regno: req.body.regno,
            pid: req.body.pid,
            pname: req.body.pname,
            customer_name: req.body.customer_name,
            customer_email: req.body.customer_email,
            customer_phone: req.body.customer_phone,
            customer_address: req.body.customer_address,
            quantity: req.body.quantity,
            unit_price: req.body.unit_price,
            total_price: req.body.total_price,
            status: req.body.status || 'pending',
            payment_method: req.body.payment_method || 'cod',
            payment_status: req.body.payment_status || 'unpaid',
            order_date: req.body.order_date || new Date(),
            delivery_date: req.body.delivery_date || null,
            notes: req.body.notes || ''
        };

        connection.query(sqlQuery, data, (error, result) => {
            if (error) {
                console.log("Error:", error.sqlMessage);
                return res.status(500).json({ error: "Error adding order" });
            }
            res.status(201).json({ message: "Order added successfully", result });
        });
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Get orders by retailer registration number
const getOrdersByRegNo = async (req, res) => {
    try {
        const regno = req.params.regno;
        const sqlQuery = "SELECT * FROM tbl_retailer_orders WHERE regno = ? ORDER BY order_date DESC";

        connection.query(sqlQuery, [regno], (error, result) => {
            if (error) {
                console.log("Error:", error.sqlMessage);
                return res.status(500).json({ error: "Error fetching orders" });
            }
            res.json(result);
        });
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Get single order by order ID
const getOrderById = async (req, res) => {
    try {
        const orderid = req.params.orderid;
        const sqlQuery = "SELECT * FROM tbl_retailer_orders WHERE orderid = ?";

        connection.query(sqlQuery, [orderid], (error, result) => {
            if (error) {
                console.log("Error:", error.sqlMessage);
                return res.status(500).json({ error: "Error fetching order" });
            }
            if (result.length === 0) {
                return res.status(404).json({ message: "Order not found" });
            }
            res.json(result[0]);
        });
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Update order status
const updateOrderStatus = (req, res) => {
    try {
        const orderid = req.params.orderid;
        const status = req.body.status;
        const sqlQuery = "UPDATE tbl_retailer_orders SET status = ? WHERE orderid = ?";

        connection.query(sqlQuery, [status, orderid], (error, result) => {
            if (error) {
                console.log("Error:", error.sqlMessage);
                return res.status(500).json({ error: "Error updating status" });
            }
            res.json({ message: "Order status updated" });
        });
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Update payment status
const updatePaymentStatus = (req, res) => {
    try {
        const orderid = req.params.orderid;
        const payment_status = req.body.payment_status;
        const sqlQuery = "UPDATE tbl_retailer_orders SET payment_status = ? WHERE orderid = ?";

        connection.query(sqlQuery, [payment_status, orderid], (error, result) => {
            if (error) {
                console.log("Error:", error.sqlMessage);
                return res.status(500).json({ error: "Error updating payment status" });
            }
            res.json({ message: "Payment status updated" });
        });
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Update delivery date
const updateDeliveryDate = (req, res) => {
    try {
        const orderid = req.params.orderid;
        const delivery_date = req.body.delivery_date;
        const sqlQuery = "UPDATE tbl_retailer_orders SET delivery_date = ? WHERE orderid = ?";

        connection.query(sqlQuery, [delivery_date, orderid], (error, result) => {
            if (error) {
                console.log("Error:", error.sqlMessage);
                return res.status(500).json({ error: "Error updating delivery date" });
            }
            res.json({ message: "Delivery date updated" });
        });
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Delete order
const deleteOrder = (req, res) => {
    try {
        const orderid = req.params.orderid;
        const sqlQuery = "DELETE FROM tbl_retailer_orders WHERE orderid = ?";

        connection.query(sqlQuery, [orderid], (error, result) => {
            if (error) {
                console.log("Error:", error.sqlMessage);
                return res.status(500).json({ error: "Error deleting order" });
            }
            res.json({ message: "Order deleted successfully" });
        });
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Get order stats for dashboard
const getOrderStats = async (req, res) => {
    try {
        const regno = req.params.regno;
        const sqlQuery = `
            SELECT 
                COUNT(*) as total_orders,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
                SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_orders,
                SUM(CASE WHEN status = 'shipped' THEN 1 ELSE 0 END) as shipped_orders,
                SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered_orders,
                SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_orders,
                SUM(total_price) as total_revenue,
                SUM(CASE WHEN payment_status = 'paid' THEN total_price ELSE 0 END) as paid_revenue
            FROM tbl_retailer_orders WHERE regno = ?
        `;

        connection.query(sqlQuery, [regno], (error, result) => {
            if (error) {
                console.log("Error:", error.sqlMessage);
                return res.status(500).json({ error: "Error fetching stats" });
            }
            res.json(result[0]);
        });
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Admin: Get all orders
const getAllOrders = async (req, res) => {
    try {
        const sqlQuery = "SELECT * FROM tbl_retailer_orders ORDER BY order_date DESC";

        connection.query(sqlQuery, (error, result) => {
            if (error) {
                console.log("Error:", error.sqlMessage);
                return res.status(500).json({ error: "Error fetching orders" });
            }
            res.json(result);
        });
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = {
    addOrder,
    getOrdersByRegNo,
    getOrderById,
    updateOrderStatus,
    updatePaymentStatus,
    updateDeliveryDate,
    deleteOrder,
    getOrderStats,
    getAllOrders
};
