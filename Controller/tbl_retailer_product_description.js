const connection = require("../Model/model");

const addRetailerProductsDes = async (req, res) => {
    try {
        let sqlQuery = "INSERT INTO tbl_retailer_product_description SET ?";
        let data = {
            pid: req.body.pid,
            description: req.body.description,
            size: req.body.size,
            weight: req.body.weight,
            ram: req.body.ram,
            screen: req.body.screen,
            rom: req.body.rom,
            processor: req.body.processor,
            mfg_date: req.body.mfg_date,
            exp_date: req.body.exp_date,
            material: req.body.material,
            country_of_origin: req.body.country_of_origin,
        };
    await connection.query(sqlQuery, data, function (error, result) {
            if (error) {
                console.log("error", error.sqlMessage);
            } else {
                res.json(result);
            }
        });
    } catch (error) {
        console.log("error found...");
    }
};
const updateRetailerProductUpdateDesc = (req, res) => {
    try {
        const pid = req.params.pid; 
        const newDesc = req.body.description;
        const sqlQuery = 'UPDATE tbl_retailer_product_description SET description = ? WHERE pid = ?';
connection.query(sqlQuery, [newDesc, pid], function(err, result) {
            if (err) {
                console.log("Error:", err.sqlMessage);
                res.status(500).json({ error: 'Server error' });
            } else {
                res.json({ message: 'Description updated' });
            }
        }); 
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
};

const getRetailerProductsDesc = async (req, res) => {
    try {
        const pid = req.params.pid; 
        if (!pid) {
            return res.json("pid required");
        }
        const sqlQuery = "SELECT description FROM tbl_retailer_product_description WHERE pid = ?";
        const data = [pid];
        connection.query(sqlQuery, data, (error, results) => {
            if (error) {
                console.error("Error");
                return res.json("Failed to fetch");
            } else {
                if (results.length === 0) {
                    return res.json( "Description not found");
                }
                res.json(results);
            } 
        });
    } catch (error) {
        console.error("Server Error:", error);
        res.json( "Server error");
    }
};



module.exports = {addRetailerProductsDes,updateRetailerProductUpdateDesc,getRetailerProductsDesc}   
 