const connection = require("../Model/model");

const addSubCategory = async (req, res) => { 
    try {
        let sqlQuery = "INSERT INTO tbl_admin_subcategory SET ?";
        const photo = req.file ? (req.file.location || req.file.path) : (req.body.photo || null);
        let data = {
            Pcategoryid: req.body.Pcategoryid,
            Subcategoryid: req.body.Subcategoryid,
            Subcategoryname: req.body.Subcategoryname,
            photo
        };
        await connection.query(sqlQuery, data, function (error, result) {
            if (error) {
                console.log("Error:", error.sqlMessage);
                res.status(500).json({ error: error.sqlMessage });
            } else {
                res.json(result);
            }
        });
    } catch (error) {
        console.log("Error found:", error);
        res.status(500).json({ error: "An error occurred" });
    }
};
 
const viewSubCategory = async (req, res) => {
    try {
        const sqlQuery = "SELECT * FROM tbl_admin_subcategory";
        await connection.query(sqlQuery, (error, results) => {
            if (error) {
                console.error("Database Error:", error);
                return res.status(500).json({ error: "Failed to fetch subcategories" });
            } else {
                res.status(200).json(results);
            }
        });
    } catch (error) {
        console.error("Server Error:", error);
        res.json("Server error");
    }
};


const updateSubCategory = async (req, res) => {
    try {
      const subcategoryId = req.params.Subcategoryid;
      const {
        Pcategoryid,
        Subcategoryid,
        Subcategoryname
      } = req.body;
      const photo = req.file ? (req.file.location || req.file.path) : null;

      const updates = [];
      const queryParams = [];

      if (Pcategoryid) {
          updates.push("Pcategoryid = ?");
          queryParams.push(Pcategoryid);
      }

      if (Subcategoryid) {
          updates.push("Subcategoryid = ?");
          queryParams.push(Subcategoryid);
      }

      if (Subcategoryname) {
          updates.push("Subcategoryname = ?");
          queryParams.push(Subcategoryname);
      }

      if (photo) {
          updates.push("photo = ?");
          queryParams.push(photo);
      }

      if (!updates.length) {
          return res.status(400).json({ error: "No update fields provided" });
      }

      const sqlQuery = `UPDATE tbl_admin_subcategory SET ${updates.join(", ")} WHERE Subcategoryid = ?`;
      queryParams.push(subcategoryId);

      connection.query(sqlQuery, queryParams, function (error, result) {
        if (error) {
          console.log("Error:", error.sqlMessage);
          return res.status(500).json({ error: error.sqlMessage || "Error in SQL query" });
        }
        if (result.affectedRows > 0) { 
          res.json({ message: "Subcategory updated successfully" });
        } else {
          res.status(404).json({ error: "Subcategoryid not found in the database" });
        }
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Error while updating Subcategory" });
    }
  };
  

const viewSubCategoryByName = async (req, res) => {
    try {
        const Subcategoryname = req.params.Subcategoryname;
if (!Subcategoryname) {
            return res.json("Subcategoryname is required");
        }
        const sqlQuery = "SELECT s.Pcategoryid, s.Subcategoryid, s.Subcategoryname, s.photo, s.addedon FROM tbl_admin_subcategory s WHERE s.Subcategoryname = ?";
        const data = [Subcategoryname];
        await connection.query(sqlQuery, data, (error, results) => {
            if (error) {
                console.error("Database Error:", error);
                return res.json("Failed to retrieve" );
            } else {
                if (results.length === 0) {
                    return res.json("Subcategory not found");
                }
                res.json(results);
            }  
        });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

///search/get subcategory with the help of Pcategory id 
////we find how many subcatagery under perticular categary
const viewSubCategoryByPcategoryid = async (req, res) => {
    try {
        const Pcategoryid = req.params.Pcategoryid;
if (!Pcategoryid) {
            return res.status(400).json({ error: "Pcategoryid is required for search" });
        }
        const sqlQuery = "SELECT s.Pcategoryid, s.Subcategoryid, s.Subcategoryname, s.photo, s.addedon FROM tbl_admin_subcategory s WHERE s.Pcategoryid = ?";
        const data = [Pcategoryid];
        await connection.query(sqlQuery, data, (error, results) => {
            if (error) {
                console.error("Database Error:", error);
                return res.status(500).json({ error: "Failed to retrieve subcategories" });
            } else {
                if (results.length === 0) {
                    return res.status(404).json({ error: "Subcategory not found" });
                }
                res.status(200).json(results);
            }
        });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = { addSubCategory, viewSubCategory, updateSubCategory, viewSubCategoryByName, viewSubCategoryByPcategoryid } 
