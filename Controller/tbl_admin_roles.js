const connection = require("../Model/model");

const addAdminRole = async (req, res) => {
    try {
        let sqlQuery = "INSERT INTO tbl_admin_roles SET ?";
        let data = {
            roleid: req.body.roleid,
            rolename: req.body.rolename,
        };     
await connection.query(sqlQuery, data, (error, result) => {
            if (error) {
                console.log("Error:", error.sqlMessage);
                res.status(500).json({ error: "Role addition failed" });
            } else {
                res.json(result);
            }  
        });
    } catch (error) {
        console.log("server error:", error.message); 
        res.status(500).json({ error: "Server error" });
    }
};

const updateAdminRole = async (req, res) => {
    try {
      const id = req.params.roleid;
      const data = req.body.rolename;   
      const sqlQuery = "UPDATE tbl_admin_roles SET rolename = ? WHERE roleid = ?";  
      await connection.query(sqlQuery, [data, id], function (error, result) {
        if (error) {
          console.log("Error:", error.sqlMessage);
          res.json("Error in SQL query");
        } else { 
          if (result.affectedRows > 0) {
            res.json("Role updated successfully");
          } else {
            res.json("roleid not found in database");
          }
        }
      });
    } catch (error) {
      console.error("Error:", error);
      res.json("error while updating ");
    }
  };


const getAdminRoles = async (req, res) => { 
    try {
        const sqlQuery = "SELECT * FROM tbl_admin_roles";
        await connection.query(sqlQuery, (error, result) => {
            if (error) {
                console.log("Error:", error.sqlMessage);
                res.status(500).json({ error: "Failed to fetch" });
            } else {
                res.json(result);
            }
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Server error" });
    }  
};


const getRoleId = async (req, res) => {
    const rolename = req.params.rolename; 
    try {
        const sqlQuery = "SELECT roleid FROM tbl_admin_roles WHERE rolename = ?";       
        await connection.query(sqlQuery, [rolename], (error, result) => {
            if (error) {
                console.log("Error:", error.sqlMessage);
                res.json("Failed to fetch");
            } else { 
                if (result.length > 0) {
                    res.json({ roleid: result[0].roleid }); 
                } else {
                    res.json("Role not found");
                } 
            }
        });
    } catch (error) {
        console.error(error.message);   
        res.json("Server error" );
    }
}; 



module.exports = { addAdminRole, updateAdminRole, getAdminRoles, getRoleId }

