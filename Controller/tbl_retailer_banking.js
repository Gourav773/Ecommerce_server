// const connection = require("../Model/model");

// const addRetailerBanking = async (req, res) => {
//     try {
//         let sqlQuery = "INSERT INTO tbl_retailer_banking SET ?";
//         let data = {
//             regno: req.body.regno,
//             bankaccountno: req.body.bankaccountno,
//             bankaccountname: req.body.bankaccountname,
//             ifsc: req.body.ifsc,
//             bankname: req.body.bankname,
//             branch: req.body.branch,
//             upi: req.body.upi,
//             // status: req.body.status
//         };
//       await connection.query(sqlQuery, data, function (error, result) {
//             if (error) {
//                 console.log("Error:", error.sqlMessage); 
//                 res.status(500).json({ error: "error while inserting" });
//             } else {
//                 res.json(result);
//             }
//         });
//     } catch (error) {
//         console.log("Error found:", error);  
//         res.status(500).json({ error: "An error occurred." });
//     }
// };

// const viewRetailerBankingDetail = async (req, res) => {
//     try {
//         const regno = req.params.regno; 
//      let sqlQuery = "SELECT * FROM tbl_retailer_banking WHERE regno = ?";
//      await connection.query(sqlQuery, [regno], function (error, results) {
//             if (error) {
//                 console.log("Error");
//                 res.json("error to fetching");
//             } else {
//                 if (results.length > 0) {
//                     res.json(results);
//                 } else {
//                     res.json("Data not found");
//                 }
//             }
//         });
//     } catch (error) {
//         console.log("Error found:", error);
//         res.json( "error");
//     } 
// };

// const viewAdminBankingAll = async (req, res) => {
//     try {
//         let sqlQuery = "SELECT * FROM tbl_retailer_banking";

//         await connection.query(sqlQuery, function (error, results) {
//             if (error) {
//                 console.log("Error:", error.sqlMessage);
//                 res.json("error to fetching data");
//             } else {
//                 if (results.length > 0) {
//                     res.json(results);
//                 } else { 
//                     res.json("No data found on table");
//                 }
//             }
//         }); 
//     } catch (error) {
//         console.log("Error found:", error);
//         res.json("DB error");
//     }
// };

// const updateRetailerBanking = async (req, res) => {
//     try {
//         const regno = req.params.regno; 

//         let sqlQuery = "UPDATE tbl_retailer_banking SET ? WHERE regno = ?";
        
//         const data = {
//             bankaccountno: req.body.bankaccountno,
//             bankaccountname: req.body.bankaccountname,
//             ifsc: req.body.ifsc,
//             bankname: req.body.bankname,
//             branch: req.body.branch,
//             upi: req.body.upi,
//             // status: req.body.status,
//         };
//    await connection.query(sqlQuery, [data, regno], function (error, result) {
//             if (error) {
//                 console.log("Error:", error.sqlMessage);
//                 res.json("error to updating data");
//             } else {
//                 if (result.affectedRows > 0) {
//                     res.json("Data updated");
//                 } else {
//                     res.json("Data not found");
//                 }
//             }
//         });
//     } catch (error) {
//         console.log("Error found:", error);
//         res.json("DB error");
//     }
// };

// const updateRetailerBankingStatus = (req, res) => {
//     try {
//         let SqlQuery = 'UPDATE tbl_retailer_banking SET status=? WHERE regno=?';
//         let regno = req.query.regno;
//         let data = req.query.status;
//         connection.query(SqlQuery, [data, regno], function(err, result) {
//             if (err) {
//                 console.log("Error", err.sqlMessage);
//                 res.json("DB err");
//             } else {
//                 res.json(result);
//             }
//         });
//     } catch (error) {
//         console.log(error);
//         res.json('Server Error');
//     }
// } 

// const updateRetailerBankingUpi = async (req, res) => {
//     try {
//         const regno = req.params.regno; 
//   let sqlQuery = "UPDATE tbl_retailer_banking SET upi = ? WHERE regno = ?";
//      const newUpi = req.body.upi;
//         await connection.query(sqlQuery, [newUpi, regno], function (error, result) {
//             if (error) {
//                 console.log("Error:", error.sqlMessage);
//                 res.json("error to updating upi");
//             } else {  
//                 if (result.affectedRows > 0) {    
//                     res.json("upi updated ");
//                 } else {
//                     res.json("Data not found ");
//                 }
//             }
//         });
//     } catch (error) {
//         console.log("Error found:", error);
//         res.json("DB error");
//     }
// }; 


// module.exports = {addRetailerBanking, viewRetailerBankingDetail, viewAdminBankingAll, updateRetailerBanking,updateRetailerBankingStatus, updateRetailerBankingUpi}


const connection = require("../Model/model");

// ADD BANKING
const addRetailerBanking = (req, res) => {
    try {
        const sqlQuery = "INSERT INTO tbl_retailer_banking SET ?";
        const data = {
            regno: req.body.regno,
            bankaccountno: req.body.bankaccountno,
            bankaccountname: req.body.bankaccountname,
            ifsc: req.body.ifsc,
            bankname: req.body.bankname,
            branch: req.body.branch,
            upi: req.body.upi,
        };

        connection.query(sqlQuery, data, (error, result) => {
            if (error) {
                console.log("Error:", error.sqlMessage);
                return res.status(500).json({ error: "Insert failed" });
            }

            return res.json(result);
        });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({ error: "Server error" });
    }
};

// VIEW BY REGNO
const viewRetailerBankingDetail = (req, res) => {
    try {
        const regno = req.params.regno;

        const sqlQuery = "SELECT * FROM tbl_retailer_banking WHERE regno = ?";

        connection.query(sqlQuery, [regno], (error, results) => {
            if (error) {
                console.log("Error:", error.sqlMessage);
                return res.status(500).json({ error: "Fetch error" });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "Data not found" });
            }

            return res.json(results);
        });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({ error: "Server error" });
    }
};

// ADMIN VIEW ALL
const viewAdminBankingAll = (req, res) => {
    try {
        const sqlQuery = "SELECT * FROM tbl_retailer_banking";

        connection.query(sqlQuery, (error, results) => {
            if (error) {
                console.log("Error:", error.sqlMessage);
                return res.status(500).json({ error: "Fetch error" });
            }

            return res.json(results);
        });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({ error: "Server error" });
    }
};

// UPDATE FULL
const updateRetailerBanking = (req, res) => {
    try {
        const regno = req.params.regno;

        const sqlQuery = "UPDATE tbl_retailer_banking SET ? WHERE regno = ?";

        const data = {
            bankaccountno: req.body.bankaccountno,
            bankaccountname: req.body.bankaccountname,
            ifsc: req.body.ifsc,
            bankname: req.body.bankname,
            branch: req.body.branch,
            upi: req.body.upi,
        };

        connection.query(sqlQuery, [data, regno], (error, result) => {
            if (error) {
                console.log("Error:", error.sqlMessage);
                return res.status(500).json({ error: "Update failed" });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Data not found" });
            }

            return res.json({ message: "Data updated" });
        });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({ error: "Server error" });
    }
};

// UPDATE STATUS
const updateRetailerBankingStatus = (req, res) => {
    try {
        const regno = req.query.regno;
        const status = req.query.status;

        const sqlQuery = "UPDATE tbl_retailer_banking SET status = ? WHERE regno = ?";

        connection.query(sqlQuery, [status, regno], (err, result) => {
            if (err) {
                console.log("Error:", err.sqlMessage);
                return res.status(500).json({ error: "Update failed" });
            }

            return res.json(result);
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server error" });
    }
};

// UPDATE UPI
const updateRetailerBankingUpi = (req, res) => {
    try {
        const regno = req.params.regno;
        const newUpi = req.body.upi;

        const sqlQuery = "UPDATE tbl_retailer_banking SET upi = ? WHERE regno = ?";

        connection.query(sqlQuery, [newUpi, regno], (error, result) => {
            if (error) {
                console.log("Error:", error.sqlMessage);
                return res.status(500).json({ error: "Update failed" });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Data not found" });
            }

            return res.json({ message: "UPI updated" });
        });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({ error: "Server error" });
    }
};

module.exports = {
    addRetailerBanking,
    viewRetailerBankingDetail,
    viewAdminBankingAll,
    updateRetailerBanking,
    updateRetailerBankingStatus,
    updateRetailerBankingUpi
};