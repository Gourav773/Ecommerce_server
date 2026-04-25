const express = require('express')
const AdminUser = express.Router();

const { loginAdmin, getAdminUser, addAdminUser, updateAdminUser, activestatus,deactivestatus, deleteAdminUser, getAdminUserById, getUserCount } = require("../Controller/tbl_admin_user")

const { uploadAdmin: upload } = require('../multerS3/multer');

// SWAGGER API OF ALL TABLES 
/**
 * @swagger
 * components: 
 *   schemas:
 *     tbl_admin_user:
 *       type: object
 *       properties:
 *         uid:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         mobile:
 *           type: string
 *         photo:
 *           type: string
 *         aadhaar:
 *           type: string
 *         doj:
 *           type: string
 *         qualification:
 *           type: string
 *         dob:
 *           type: integer
 *         :
 *           type: string
 *         state:
 *           type: string
 *         city:
 *           type: string
 *         pin:
 *           type: string
 *         status:
 *           type: string
 */

/**
 * @swagger
 * /api/admin/viewuser:
 *  get:
 *      summary: This api is used to check whether api is working or not in (tbl_admin_user)
 *      description: This api is used to check whether api is working or not in (tbl_admin_user)
 *      responses:
 *          200:
 *              description: To test Get method
 *              content:   
 *                    application/json:
 *                           schema:
 *                               type: array
 *                               items:
 *                                $ref : '#components/schemas/tbl_admin_user'
 */

/**
 * @swagger
 * /api/admin/adduser:
 *  post:
 *      summary: used to insert data into mysql database (tbl_admin_user)
 *      description: This api is used to insert data into mysql database (tbl_admin_user)
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/tbl_admin_user'
 *      responses:
 *          200:
 *              description: Added successfully
 */

/**
 * @swagger
 * /api/admin/updateuser/{id}:
 *  put:
 *      summary: Update user data in the MySQL database (tbl_admin_user) by ID
 *      description: This API is used to update user data in the MySQL database (tbl_admin_user) based on the provided ID.
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: The ID of the user to update.
 *          schema:
 *            type: integer
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/tbl_admin_user'
 *      responses:
 *          200:
 *              description: Updated successfully
 *          404:
 *              description: User not found
 */


/**
 * @swagger
 * /api/admin/deleteuser/{id}:
 *  delete:
 *      summary: Delete a user from the MySQL database (tbl_admin_user) by ID
 *      description: This API is used to delete a user from the MySQL database (tbl_admin_user) based on the provided ID.
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: The ID of the user to delete.
 *          schema:
 *            type: integer
 *      responses:
 *          200:
 *              description: Deleted successfully
 *          404:
 *              description: User not found
 */

AdminUser.post("/api/admin/login", loginAdmin);
AdminUser.get("/api/admin/viewuser", getAdminUser);
AdminUser.post("/api/admin/adduser", upload.single('photo'), addAdminUser);

AdminUser.put("/api/admin/userupdate/:uid", upload.single('photo'), updateAdminUser);                                               
// AdminUser.put("/api/admin/statusupdate", statusAdminUser); 
AdminUser.put("/api/admin/deactivestatus/:uid",deactivestatus);
AdminUser.put("/api/admin/activestatus/:uid",activestatus);
AdminUser.delete("/api/admin/deleteuser/:uid", deleteAdminUser);

AdminUser.get("/api/admin/viewuser/:uid", getAdminUserById);
AdminUser.get("/api/admin/getUserCount", getUserCount);

module.exports = { AdminUser }     
