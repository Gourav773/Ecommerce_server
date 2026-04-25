const connection = require("../Model/model");

const addRetailerBanking = async (req, res) => {
    try {
        let sqlQuery = "INSERT INTO tbl_retailer_banking SET ?";
        let data = {
            regno: req.body.regno,
            bankaccountno: req.body.bankaccountno,
            bankaccountname: req.body.bankaccountname,
            ifsc: req.body.ifsc,
            bankname: req.body.bankname,
            branch: req.body.branch,
            upi: req.body.upi,
            // status: req.body.status
        };
      await connection.query(sqlQuery, data, function (error, result) {
            if (error) {
                console.log("Error:", error.sqlMessage); 
                res.status(500).json({ error: "error while inserting" });
            } else {
                res.json(result);
            }
        });
    } catch (error) {
        console.log("Error found:", error);  
        res.status(500).json({ error: "An error occurred." });
    }
};

const viewRetailerBankingDetail = async (req, res) => {
    try {
        const regno = req.params.regno; 
     let sqlQuery = "SELECT * FROM tbl_retailer_banking WHERE regno = ?";
     await connection.query(sqlQuery, [regno], function (error, results) {
            if (error) {
                console.log("Error");
                res.json("error to fetching");
            } else {
                if (results.length > 0) {
                    res.json(results);
                } else {
                    res.json("Data not found");
                }
            }
        });
    } catch (error) {
        console.log("Error found:", error);
        res.json( "error");
    } 
};

const viewAdminBankingAll = async (req, res) => {
    try {
        let sqlQuery = "SELECT * FROM tbl_retailer_banking";

        await connection.query(sqlQuery, function (error, results) {
            if (error) {
                console.log("Error:", error.sqlMessage);
                res.json("error to fetching data");
            } else {
                if (results.length > 0) {
                    res.json(results);
                } else { 
                    res.json("No data found on table");
                }
            }
        }); 
    } catch (error) {
        console.log("Error found:", error);
        res.json("DB error");
    }
};

const updateRetailerBanking = async (req, res) => {
    try {
        const regno = req.params.regno; 

        let sqlQuery = "UPDATE tbl_retailer_banking SET ? WHERE regno = ?";
        
        const data = {
            bankaccountno: req.body.bankaccountno,
            bankaccountname: req.body.bankaccountname,
            ifsc: req.body.ifsc,
            bankname: req.body.bankname,
            branch: req.body.branch,
            upi: req.body.upi,
            // status: req.body.status,
        };
   await connection.query(sqlQuery, [data, regno], function (error, result) {
            if (error) {
                console.log("Error:", error.sqlMessage);
                res.json("error to updating data");
            } else {
                if (result.affectedRows > 0) {
                    res.json("Data updated");
                } else {
                    res.json("Data not found");
                }
            }
        });
    } catch (error) {
        console.log("Error found:", error);
        res.json("DB error");
    }
};

const updateRetailerBankingStatus = (req, res) => {
    try {
        let SqlQuery = 'UPDATE tbl_retailer_banking SET status=? WHERE regno=?';
        let regno = req.query.regno;
        let data = req.query.status;
        connection.query(SqlQuery, [data, regno], function(err, result) {
            if (err) {
                console.log("Error", err.sqlMessage);
                res.json("DB err");
            } else {
                res.json(result);
            }
        });
    } catch (error) {
        console.log(error);
        res.json('Server Error');
    }
} 

const updateRetailerBankingUpi = async (req, res) => {
    try {
        const regno = req.params.regno; 
  let sqlQuery = "UPDATE tbl_retailer_banking SET upi = ? WHERE regno = ?";
     const newUpi = req.body.upi;
        await connection.query(sqlQuery, [newUpi, regno], function (error, result) {
            if (error) {
                console.log("Error:", error.sqlMessage);
                res.json("error to updating upi");
            } else {  
                if (result.affectedRows > 0) {    
                    res.json("upi updated ");
                } else {
                    res.json("Data not found ");
                }
            }
        });
    } catch (error) {
        console.log("Error found:", error);
        res.json("DB error");
    }
}; 


module.exports = {addRetailerBanking, viewRetailerBankingDetail, viewAdminBankingAll, updateRetailerBanking,updateRetailerBankingStatus, updateRetailerBankingUpi}