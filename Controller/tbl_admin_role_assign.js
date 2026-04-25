
const connection = require("../Model/model");
// const grantRole = async (req, res) => {
//     try {
//       let data = {
//         uid : req.body.uid,
//         roleid : req.body.roleid};
//         let sqlQuery = "insert into  tbl_admin_role_assign() ";
//     await connection.query(sqlQuery, data, (error, result) => {
//         if (error) {
//           console.log("Error:", error.sqlMessage);
//         } else {
//           console.log("Data inserted");
//         }
//       }); 
//     } catch (error) {
//       console.error("Error found:", error);
//     } 
//   }; 

const grantRole = async(req,res) =>{
  let uid = req.body.uid;
  let rolename = req.body.rolename;
  if (!uid || !rolename) {
      return res.status(400).json({ error: "uid and rolename are required" });
  }
  let userData = [uid, rolename];
     
  let sqlQuery = `insert into tbl_admin_role_assign (uid, roleid) values(?, (select roleid from tbl_admin_roles where rolename = ?))`;

   connection.query(sqlQuery, userData, function(error, result){
      if(error){
          console.log("error", error.sqlMessage);
          return res.status(500).json({ error: "Failed to grant role" });
      }
      res.json(result);
  });
}

///checkRole  
let checkRole = async (req, res) => {
    try {
        let uid = req.params.uid;
        let sqlQuery = "SELECT rolename FROM tbl_admin_roles WHERE roleid IN (SELECT roleid FROM tbl_admin_role_assign WHERE uid = ?)";
        connection.query(sqlQuery, [uid], function (error, result) {
            if (error) {
                console.log("Error:", error.sqlMessage);
                return res.status(500).json({ error: "DB Error" });
            }
            res.json(result); 
        }); 
    } catch (error) { 
        console.error("Error:", error);
        res.status(500).json({ error: "Server Error" });
    } 
};

//update
let changeRole = async (req, res) => {
        try {
          let uid = req.params.uid; 
          let roleid = req.params.roleid;
          let newRoleid = req.body.roleid;
          let sqlQuery = "UPDATE tbl_admin_role_assign SET roleid = ? WHERE uid = ? AND roleid = ?";
          connection.query(sqlQuery, [newRoleid, uid, roleid], (error, result) => {
            if (error) {
              console.error("Error:", error.sqlMessage); 
              return res.status(500).json({ error: "Error updating role" });
            }
            if (result.affectedRows === 0) {
              return res.status(404).json({ error: "Role assignment not found" });
            }
            res.json({ message: "Role assignment updated successfully" }); 
          });
        } catch (error) {
          console.error("Error found:", error.message);
          res.status(500).json({ error: "Internal server error" });
        }
      };


    const revokeRole = (req, res) => {
      const uid = req.params.uid; 
      const roleid = req.params.roleid;
      const sqlQuery = "DELETE FROM tbl_admin_role_assign WHERE uid = ? AND roleid = ?";
      connection.query(sqlQuery, [uid, roleid], function (err, result) {
          if (err) {
              return res.status(500).json({ error: "Failed to delete role" });
          }
          if (result.affectedRows === 0) {
              return res.status(404).json({ error: "Role assignment not found" });
          }
          res.json({ message: "Role assignment deleted successfully" });
      });   
  }; 
      

module.exports = { grantRole, checkRole, changeRole, revokeRole}   

