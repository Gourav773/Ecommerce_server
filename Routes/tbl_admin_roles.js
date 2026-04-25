const express = require('express')
const AdminRole = express.Router();

const { addAdminRole, updateAdminRole, getAdminRoles, getRoleId } = require("../Controller/tbl_admin_roles")

AdminRole.post("/api/admin/roles/newrole", addAdminRole);                                  
AdminRole.patch("/api/admin/roles/updaterole/:roleid", updateAdminRole);                                  
AdminRole.get("/api/admin/roles/viewroles", getAdminRoles);
AdminRole.get("/api/admin/roles/viewrole/:rolename", getRoleId);

module.exports = { AdminRole }       
    