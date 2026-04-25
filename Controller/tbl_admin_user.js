const connection = require("../Model/model");
const bcrypt = require('bcrypt');
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;

// Login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        const sqlQuery = "SELECT * FROM tbl_admin_user WHERE email = ? AND status = 'active' LIMIT 1";
        connection.query(sqlQuery, [email], async function (error, result) {
            if (error) {
                console.log("error", error.sqlMessage);
                return res.status(500).json({ error: "Server error" });
            }
            if (result.length === 0) {
                return res.status(401).json({ error: "Invalid email or password" });
            }
            const user = result[0];
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(401).json({ error: "Invalid email or password" });
            }
            const { password: _, ...userData } = user;
            // res.json({ message: "Login successful", user: userData });
            return res.json({ message: "Login successful", user: userData });
        });
    } catch (error) {
        console.log("Login error:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

// const getAdminUser = async (req, res) => {
//     try {
//         let sqlQuery = `
// SELECT u.*, ra.roleid, r.rolename 
// FROM tbl_admin_user u 
// LEFT JOIN tbl_admin_role_assign ra ON u.uid = ra.uid 
// LEFT JOIN tbl_admin_roles r ON ra.roleid = r.roleid
// `;
//         // GROUP BY u.uid
//         connection.query(sqlQuery, function (error, result) {
//             if (error) {
//                 console.log("error", error.sqlMessage);
//                 return res.status(500).json({ error: "Failed to fetch users" });
//             }
//             res.json(result);
//         });
//     } catch (error) {
//         console.log(error.message);
//         res.status(500).json({ error: "Server error" });
//     }
// }
const getAdminUser = (req, res) => {
    const sqlQuery = `
    SELECT 
        u.*, 
        GROUP_CONCAT(r.rolename) AS roles
    FROM tbl_admin_user u 
    LEFT JOIN tbl_admin_role_assign ra ON u.uid = ra.uid 
    LEFT JOIN tbl_admin_roles r ON ra.roleid = r.roleid
    GROUP BY u.uid
    `;

    connection.query(sqlQuery, (error, result) => {
        if (error) {
            return res.status(500).json({ error: error.sqlMessage });
        }
        return res.json(result);
    });
};
//add// with bcrypt hash
const addAdminUser = async (req, res) => {
    try {
        const password = req.body.password;
        if (!password) {
            return res.status(400).json({ error: "Password is required" });
        }
        const hash = await bcrypt.hash(password, saltRounds);
        const photo = req.file ? (req.file.location || req.file.path) : null;
        let sqlQuery = "insert into tbl_admin_user set?";
        let data = {
            uid: req.body.uid || null,
            name: req.body.name,
            email: req.body.email,
            password: hash,
            mobile: req.body.mobile || null,
            photo: photo,
            aadhaar: req.body.aadhaar || null,
            doj: req.body.doj || null,
            qualification: req.body.qualification || null,
            dob: req.body.dob || null,
            address: req.body.address || null,
            state: req.body.state || null,
            city: req.body.city || null,
            country: req.body.country || null,
            pin: req.body.pin || null,
        }
        // connection.query(sqlQuery, data, function (error, result) {
        //     if (error) {
        //         console.log("error", error.sqlMessage);
        //         return res.status(500).json({ error: error.sqlMessage || "Failed to add user" });
        //     }
        //     res.json(result);
        // });

        connection.query(sqlQuery, values, function (error, result) {
    if (error) {
        return res.status(500).json({ error: error.sqlMessage });
    }
    return res.json({ message: "updated successfully" });
});
    } catch (error) {
        console.log("error found:", error.message);
        res.status(500).json({ error: "Server error" });
    }
}

// ///hash
// // const bcrypt = require('bcrypt');   ///
// // const saltRounds = 10;
// const addAdminUser = async (req, res) => { 
//     try { 
//         let sqlQuery = "INSERT INTO tbl_admin_user SET ?";
//         const password = req.body.password;                       // not req.body.password.toString();  coz already converted in staring
//         bcrypt.hash(password, saltRounds, async (err, hash) => {
//             if (err) {
//                 console.log("Error in hashing password:", err);
//                 return res.json({ Error: "Error in hashing password" });
//             }
//             const data = {
//                 uid: req.body.uid,
//                 name: req.body.name,
//                 email: req.body.email,
//                 password: hash, 
//                 mobile: req.body.mobile,
//                 photo: req.file.location,
//                 aadhaar: req.body.aadhaar,
//                 doj: req.body.doj,
//                 qualification: req.body.qualification,
//                 dob: req.body.dob,
//                 address: req.body.address,
//                 state: req.body.state,
//                 city: req.body.city,
//                 country: req.body.country,
//                 pin: req.body.pin,
//                 status: req.body.status || "deactive", // default deactive DB me
//             };
//             await connection.query(sqlQuery, data, function (error, result) {
//                 if (error) {
//                     console.log("Error", error.sqlMessage);
//                 } else {
//                     res.json(result);
//                 }
//             });
//         });
//     } catch (error) {
//         console.log("Error..", error);
//     }
// };



const updateAdminUser = async (req, res) => {
    try {
        const id = req.params.uid;
        const photo = req.file ? (req.file.location || req.file.path) : null;

        // Build SET clause dynamically — only update provided fields
        const allowedFields = ['name', 'email', 'mobile', 'aadhaar', 'doj', 'qualification', 'dob', 'address', 'state', 'city', 'country', 'pin'];
        const updates = [];
        const values = [];

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates.push(`${field} = ?`);
                values.push(req.body[field]);
            }
        }

        // Handle password separately — only update if provided
        if (req.body.password) {
            const hash = await bcrypt.hash(req.body.password, saltRounds);
            updates.push('password = ?');
            values.push(hash);
        }

        if (photo) {
            updates.push('photo = ?');
            values.push(photo);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: "No fields to update" });
        }

        values.push(id);
        const sqlQuery = `UPDATE tbl_admin_user SET ${updates.join(', ')} WHERE uid = ?`;

        connection.query(sqlQuery, values, function (error, result) {
            if (error) {
                console.log("Error:", error.sqlMessage);
                return res.status(500).json({ error: "DB error" });
            }
            res.json({ message: "updated successfully" });
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "error while updating" });
    }
};

//status//
// const statusAdminUser = (req, res) => {
//     try {
//         let SqlQuery = 'UPDATE  tbl_admin_user SET status=? WHERE uid=?'
//         let id = req.query.uid
//         let data = req.query.status
//         connection.query(SqlQuery, [data,id], function(err, result){
//             if (err) {
//               console.log("Error", err.sqlMessage)
//             }  
//             else {
//                 res.json(result)
//             }   
//         })
//     } catch (error) {
//         console.log(error) 
// } 
// } 
// const activestatus = ((req, res) => {
//     let id = req.params.uid;
//     let sqlQuery = "UPDATE tbl_admin_user set status='active' where uid=?";

//     connection.query(sqlQuery, [id], function (error, result) {
//         if (error) {
//             console.log("Error ", error.sqlMessage);
//             return res.status(500).json({ error: "Failed to activate user" });
//         }
//         if (result.affectedRows === 0) {
//             return res.status(404).json({ error: "User not found" });
//         }
//         res.json(result);
//     });
// })
const activestatus = (req, res) => {
    connection.query(
        "UPDATE tbl_admin_user SET status='active' WHERE uid=?",
        [req.params.uid],
        (error, result) => {
            if (error) {
                return res.status(500).json({ error: error.sqlMessage });
            }
            return res.json(result);
        }
    );
};

// const deactivestatus = ((req, res) => {
//     let id = req.params.uid;
//     let sqlQuery = "UPDATE tbl_admin_user set status='deactive' where uid=?";

//     connection.query(sqlQuery, [id], function (error, result) {
//         if (error) {
//             console.log("Error ", error.sqlMessage);
//             return res.status(500).json({ error: "Failed to deactivate user" });
//         }
//         if (result.affectedRows === 0) {
//             return res.status(404).json({ error: "User not found" });
//         }
//         res.json(result);
//     });
// })

const deactivestatus = (req, res) => {
    connection.query(
        "UPDATE tbl_admin_user SET status='deactive' WHERE uid=?",
        [req.params.uid],
        (error, result) => {
            if (error) {
                return res.status(500).json({ error: error.sqlMessage });
            }
            return res.json(result);
        }
    );
};
//delete//
// const deleteAdminUser = async (req, res) => {
//     try {
//         const id = req.params.uid;
//         const sqlQuery = "DELETE FROM tbl_admin_user WHERE uid = ?";
//         // await connection.query(sqlQuery, [id], function (error, result) {
//             connection.query(sqlQuery, [id], function (error, result) {
//             if (error) {
//                 console.log("Error:", error.sqlMessage);
//                 res.json("DB error");
//             } else {
//                 if (result.affectedRows > 0) {
//                     res.json("deleted successfully");
//                 } else {
//                     res.json("user not found");
//                 }
//             }
//         });
//     } catch (error) {
//         console.log("Error:", error);
//         res.json("Internal server error");
//     }
// }

const deleteAdminUser = (req, res) => {
    const id = req.params.uid;

    connection.query(
        "DELETE FROM tbl_admin_user WHERE uid = ?",
        [id],
        (error, result) => {
            if (error) {
                return res.status(500).json({ error: error.sqlMessage });
            }

            if (result.affectedRows > 0) {
                return res.json("deleted successfully");
            } else {
                return res.json("user not found");
            }
        }
    );
};

// const getAdminUserById = async (req, res) => {
//     try {
//         const userId = req.params.uid;

//         let sqlQuery = "SELECT * FROM tbl_admin_user WHERE uid = ?";

//         await connection.query(sqlQuery, [userId], function (error, result) {
//             if (error) {
//                 console.log("error", error.sqlMessage);
//                 res.status(500).json({ error: "Internal server error" });
//             } else {
//                 if (result.length > 0) {
//                     res.json(result[0]); // Assuming you want to return only one user
//                 } else {
//                     res.status(404).json({ message: "User not found" });
//                 }
//             }
//         });
//     } catch (error) {
//         console.log("error found...");
//         res.status(500).json({ error: "Internal server error" });
//     }
// }



const getAdminUserById = (req, res) => {
    const userId = req.params.uid;

    connection.query(
        "SELECT * FROM tbl_admin_user WHERE uid = ?",
        [userId],
        (error, result) => {
            if (error) {
                return res.status(500).json({ error: error.sqlMessage });
            }

            if (result.length > 0) {
                return res.json(result[0]);
            } else {
                return res.status(404).json({ message: "User not found" });
            }
        }
    );
};


//  count user /////
// const getUserCount = async (req, res) => {
//     try {
//         let sqlQuery = "SELECT COUNT(uid) AS count_users FROM tbl_admin_user";
//         connection.query(sqlQuery, function (error, result) {
//             if (error) {
//                 console.log("error", error.sqlMessage);
//                 return res.status(500).json({ error: "Failed to get user count" });
//             }
//             res.json(result);
//         });
//     } catch (error) {
//         console.log(error.message);
//         res.status(500).json({ error: "Server error" });
//     }
// }


const getUserCount = (req, res) => {
    connection.query(
        "SELECT COUNT(uid) AS count_users FROM tbl_admin_user",
        (error, result) => {
            if (error) {
                return res.status(500).json({ error: error.sqlMessage });
            }
            return res.json(result[0]);
        }
    );
};


module.exports = { loginAdmin, getAdminUser, addAdminUser, updateAdminUser, activestatus, deactivestatus, deleteAdminUser, getAdminUserById, getUserCount }   