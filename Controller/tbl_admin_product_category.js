// const connection = require("../Model/model");

// const addCategory = async (req, res) => {
//     try {
//         let sqlQuery = "INSERT INTO tbl_admin_product_category SET ?";
//         let data = {
//              Pcategoryid: req.body. Pcategoryid,
//             Categoryname: req.body.Categoryname
//         }; 
//         await connection.query(sqlQuery, data, (error, result) => {
//             if (error) {
//                 console.log("Error:", error.sqlMessage);
//                 res.status(500).json({ error: "Internal server error" });
//             } else {
//                 res.status(200).json({ message: "Category added successfully" });
//             }               
//         });         
//     } catch (error) {
//         console.log("Error found:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

// const viewCategory = async (req, res) => {
//     try {
//         let sqlQuery = "SELECT * FROM tbl_admin_product_category";
//         await connection.query(sqlQuery, (error, result) => {
//             if (error) {
//                 console.log("Error:", error.sqlMessage);
//                 res.status(500).json({ error: "Internal server error" });
//             } else {
//                 res.status(200).json(result);
//             }
//         });
//     } catch (error) {
//         console.log("Error found:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// }

// const updateCategory = async (req, res) => {
//     try {
//       const pcId = req.params. Pcategoryid;
//       console.log("object",req.params. Pcategoryid);
//       const data = req.body.Categoryname; 
//       console.log("data",data);
//       const sqlQuery = "UPDATE tbl_admin_product_category SET Categoryname = ? WHERE  Pcategoryid = ?";
//       await connection.query(sqlQuery, [data, pcId], function (error, result) {
//         if (error) {
//           console.log("Error:", error.sqlMessage);
//           res.json("Error in SQL query");
//         } else {
//           if (result.affectedRows > 0) {
//             res.json("Category updated successfully");
//           } else {
//             res.json(" Pcategoryid 2 not found in the DB");
//           }
//         }
//       });
//     } catch (error) {
//       console.error("Error:", error);
//       res.json("Error while updating");
//     }
//   };
  

// // const updateCategory = async (req, res) => {
// //     try {
// //         const  Pcategoryid = req.params. Pcategoryid;
// //         const { Categoryname } = req.body;
// //         let sqlQuery = "UPDATE tbl_admin_product_category SET Categoryname = ? WHERE  Pcategoryid = ?";
// //         let data = [Categoryname,  Pcategoryid];
// //         const result = await connection.query(sqlQuery, data);
// //         if (result.affectedRows > 0) {
// //             res.status(200).json({ message: "Category updated successfully" });
// //         } else {
// //             res.status(404).json({ error: "Category not found" });
// //         }
// //     } catch (error) {
// //         console.error("Error:", error);
// //         res.status(500).json({ error: "Internal server error" });
// //     }
// // };

// const viewCategoryByName = async (req, res) => { 
//     try { 
//         const categoryName = req.params.Categoryname;
//         if (!categoryName) {
//             return res.status(400).json({ error: "Category name required " });
//         } 
//         const sqlQuery = "SELECT  Pcategoryid, Categoryname FROM tbl_admin_product_category WHERE Categoryname = ?";
//         const data = [categoryName];
//         await connection.query(sqlQuery, data, (error, results) => {
//             if (error) {
//                 console.error("Database Error:", error);
//                 return res.status(500).json({ error: "Failed to retrieve categories" });
//             } else { 
//                 if (results.length === 0) {
//                     return res.status(404).json({ error: "Category not found" });
//                 }
//                 res.status(200).json(results);
//             }
//         });
//     } catch (error) {
//         console.error("Server Error:", error);
//         res.status(500).json({ error: "Server error" });
//     }
// };


// module.exports = { addCategory, viewCategory, updateCategory, viewCategoryByName }


const connection = require("../Model/model");

// ADD CATEGORY
const addCategory = (req, res) => {
    const sqlQuery = "INSERT INTO tbl_admin_product_category SET ?";

    const data = {
        Pcategoryid: req.body.Pcategoryid,
        Categoryname: req.body.Categoryname
    };

    connection.query(sqlQuery, data, (error, result) => {
        if (error) {
            console.log("Error:", error.sqlMessage);
            return res.status(500).json({ error: "Internal server error" });
        }
        return res.status(200).json({ message: "Category added successfully" });
    });
};


// VIEW CATEGORY
const viewCategory = (req, res) => {
    const sqlQuery = "SELECT * FROM tbl_admin_product_category";

    connection.query(sqlQuery, (error, result) => {
        if (error) {
            console.log("Error:", error.sqlMessage);
            return res.status(500).json({ error: "Internal server error" });
        }
        return res.status(200).json(result);
    });
};


// UPDATE CATEGORY
const updateCategory = (req, res) => {
    const pcId = req.params.Pcategoryid;
    const data = req.body.Categoryname;

    const sqlQuery = "UPDATE tbl_admin_product_category SET Categoryname = ? WHERE Pcategoryid = ?";

    connection.query(sqlQuery, [data, pcId], (error, result) => {
        if (error) {
            console.log("Error:", error.sqlMessage);
            return res.status(500).json({ error: "DB error" });
        }

        if (result.affectedRows > 0) {
            return res.json("Category updated successfully");
        } else {
            return res.json("Category not found");
        }
    });
};


// VIEW CATEGORY BY NAME
const viewCategoryByName = (req, res) => {
    const categoryName = req.params.Categoryname;

    if (!categoryName) {
        return res.status(400).json({ error: "Category name required" });
    }

    const sqlQuery = "SELECT Pcategoryid, Categoryname FROM tbl_admin_product_category WHERE Categoryname = ?";

    connection.query(sqlQuery, [categoryName], (error, results) => {
        if (error) {
            console.log("Database Error:", error.sqlMessage);
            return res.status(500).json({ error: "Failed to retrieve categories" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Category not found" });
        }

        return res.status(200).json(results);
    });
};


module.exports = {
    addCategory,
    viewCategory,
    updateCategory,
    viewCategoryByName
};