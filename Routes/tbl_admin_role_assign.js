const express = require('express')
const AdminRoleAssign = express.Router();

const { grantRole, checkRole, changeRole, revokeRole} = require("../Controller/tbl_admin_role_assign")

AdminRoleAssign.post("/api/admin/roleassign/grantrole", grantRole);        //   yet                       
AdminRoleAssign.get("/api/admin/roleassign/checkrole/:uid", checkRole);     //yet                             
AdminRoleAssign.put("/api/admin/roleassign/changerole/:uid", changeRole);  //no yet 
// AdminRoleAssign.delete("/api/admin/roleassign/revokerole/:uid/:roleid", revokeRole);   //no yet                                   
AdminRoleAssign.delete("/api/admin/roleassign/revokerole/:uid/:roleid", revokeRole);                                  
module.exports = { AdminRoleAssign }   
            