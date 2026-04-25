const connection = require("../Model/model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");



// const Login = async (req, res) => {
//     const sql = "SELECT * FROM tbl_retailer_register WHERE email = ?";
//     const email = req.body.email;
//     connection.query(sql, email, (err, data) => {
//         if (err) return res.status(500).json({ error: "Login error in server" });
//         if (data.length > 0) {
//             bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
//                 if (err) return res.status(500).json({ error: "Password compare error" });
//                 if (response) {
//                     // const email = data[0].email;
//                     const token = jwt.sign({ email: email, regno: regno }, "jwt-secret-key", { expiresIn: '1d' });
//                     console.log(token);
//                     res.cookie('token', token, { httpOnly: true });
//                     return res.json({ status: "Success", token });
//                 } else {
//                     return res.status(401).json({ error: "Password not matched" });
//                 }
//             });
//         } else {
//             return res.status(404).json({ error: "No email existed" });
//         }
//     });
// };


const Login = (req, res) => {
    const { email, password } = req.body;

    const sqlQuery = `SELECT * FROM tbl_retailer_register WHERE email=?`;
    connection.query(sqlQuery, email, (err, result) => { 
        if (result && result.length > 0) { 
            bcrypt.compare(password, result[0].password, (err, isMatch) => {
                if (isMatch) {
                    const token = jwt.sign({ email: result[0].email, regID: result[0].regno }, "jwt-secret-key", { expiresIn: "1d" });
                    // console.log("Generated Token:", token); 
                    res.cookie('token', token, { httpOnly: false, sameSite: 'lax', maxAge: 24 * 60 * 60 * 1000, path: '/' });
                    return res.status(200).json({ result: result, token: token });
                } else {
                    return res.status(401).json("Password not match");
                }
            });
        } else {
            return res.status(404).json("User not Found");
        }
    });    
};


const addRetailer = async (req, res) => {
    try {
        const sqlCheckEmail = "SELECT * FROM tbl_retailer_register WHERE email = ?";
        connection.query(sqlCheckEmail, [req.body.email], async (err, data) => {
            if (err) return res.json({ error: "Registration error in server" });
            if (data.length > 0) {
                return res.json({ error: "Email already exists" });
            } else {
                bcrypt.hash(req.body.password, 10, async (err, hash) => {
                    if (err) return res.json({ error: "Error for hashing password" });

                    let sqlInsert = "INSERT INTO tbl_retailer_register SET ?";
                    let userData = {
                        regno: req.body.regno,
                        GST_no: req.body.GST_no,
                        TIN_no: req.body.TIN_no,
                        PAN: req.body.PAN,
                        shop_name: req.body.shop_name,
                        owner_name: req.body.owner_name,
                        contact: req.body.contact,
                        mobile: req.body.mobile,
                        web: req.body.web,
                        email: req.body.email,
                        address: req.body.address,
                        country: req.body.country,
                        state: req.body.state,
                        city: req.body.city,
                        pin: req.body.pin,
                        terms_and_conditions: req.body.terms_and_conditions,
                        status: "deactive",
                        password: hash
                    };

                    await connection.query(sqlInsert, userData, (error, result) => {
                        if (error) {
                            console.error("Error inserting data:", error.sqlMessage);
                            res.status(500).json({ error: "Error inserting data" });
                        } else {
                            const email = req.body.email;
                            const token = jwt.sign({ email }, "jwt-secret-key", { expiresIn: '1d' });
                            res.cookie('token', token, { httpOnly: false, sameSite: 'lax', maxAge: 24 * 60 * 60 * 1000, path: '/' });
                            res.json({ status: "Success", token });
                        }
                    });
                });
            }
        });
    } catch (error) {
        console.error("Error found:", error);
        res.status(500).json({ error: "Error processing request" });
    }
};

const getRetailerByRegNo = async (req, res) => {
    try {
        const regno = req.params.regno;
        console.log("regno", regno);
        const sqlQuery = "SELECT * FROM tbl_retailer_register WHERE regno = ?";
        
        await connection.query(sqlQuery, regno, (error, result) => {
            if (error) {
                console.log("Error:", error.sqlMessage);
                res.status(500).json({ error: "Error" }); // Set status code and send JSON
            } else {
                if (result.length === 0) {
                    res.status(404).json({ message: "Register not found" }); // Set status code and send JSON
                } else {
                    res.json(result); // Send JSON data
                }
            }
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Server Error" }); // Set status code and send JSON
    }
};

const updateRetailer = async (req, res) => {
    try {
        const regno = req.params.regno;
        let sqlQuery = "UPDATE tbl_retailer_register SET ? WHERE regno = ?";
        let updatedData = {
            regno: req.body.regno,
            GST_no: req.body.GST_no,
            TIN_no: req.body.TIN_no,
            PAN: req.body.PAN,
            shop_name: req.body.shop_name,
            owner_name: req.body.owner_name,
            contact: req.body.contact,
            mobile: req.body.mobile,
            web: req.body.web,
            email: req.body.email,
            address: req.body.address,
            country: req.body.country,
            state: req.body.state,
            city: req.body.city,
            pin: req.body.pin,
            document_reg_no: req.body.document_reg_no,
            docpan: req.body.docpan,
            docshop: req.body.docshop,   /// docshop: req.file.location,

            terms_and_conditions: req.body.terms_and_conditions,
            status: req.body.status,
            password: req.body.password,
        };

        await connection.query(sqlQuery, [updatedData, regno], function (error, result) {
            if (error) {
                console.log("error", error.sqlMessage);
                res.status(500).json({ error: "Error updating data" });
            } else {
                res.json(result);
            }
        });
    } catch (error) {
        console.log("error found...");
        res.status(500).json({ error: "Error processing request" });
    }
};


const updateStatus = (req, res) => {
    try {
        const regno = req.query.regno;
        const data = req.query.status;
        let SqlQuery = 'UPDATE tbl_retailer_register SET status=? WHERE regno=?';
        connection.query(SqlQuery, [data, regno], function (err, result) {
            if (err) {
                console.log("Error", err.sqlMessage);
                res.json("error while updating");
            } else {
                if (result.affectedRows > 0) {
                    res.json({ message: "Status updated successfully." });
                } else {
                    res.json("Data not found");
                }
            }
        });
    } catch (error) {
        console.log(error);
        res.json("DB error");
    }
};

const updatePassword = async (req, res) => {
    try {
        const regno = req.params.regno;
        let sqlQuery = "UPDATE tbl_retailer_register SET password = ? WHERE regno = ?";
        const updatedPassword = req.body.password;
        await connection.query(sqlQuery, [updatedPassword, regno], function (error, result) {
            if (error) {
                console.log("error", error.sqlMessage);
                res.status(500).json({ error: "Error updating password" });
            } else {
                res.json(result);
            }
        });
    } catch (error) {
        console.log("error found...");
        res.status(500).json({ error: "Error processing request" });
    }
};

const updateDocuments = async (req, res) => {
    try {
        const regno = req.params.regno;
        let sqlQuery = "UPDATE tbl_retailer_register SET document_reg_no = ?, docpan = ?, docshop = ? WHERE regno = ?";
        const document_reg_no = req.body.document_reg_no;
        const docpan = req.body.docpan;
        const docshop = req.body.docshop;
        await connection.query(sqlQuery, [document_reg_no, docpan, docshop, regno], function (error, result) {
            if (error) {
                console.log("error", error.sqlMessage);
                res.status(500).json({ error: "Error updating documents" });
            } else {
                res.json(result);
            }
        });
    } catch (error) {
        console.log("error found...");
        res.status(500).json({ error: "Error processing request" });
    }
};

////visw all shops//
const viewAllShops = async (req, res) => {
    try {
        let sqlQuery = "SELECT * FROM tbl_retailer_register";
        await connection.query(sqlQuery, function (error, result) {
            if (error) {
                console.log("error", error.sqlMessage);
                res.status(500).json({ error: "Error retrieving data" });
            } else {
                res.json(result);
            }
        });
    } catch (error) {
        console.log("error found...");
        res.status(500).json({ error: "Error processing request" });
    }
};

const Logout =(req,res ,) => {
        res.clearCookie("token");
        return res.json("Success")
}

const getdata =(req, res,) =>{
    return res.json({email:req.email, regID: req.regno})
}

module.exports = { Login,  addRetailer, getRetailerByRegNo, updateRetailer, updateStatus, updatePassword, updateDocuments, viewAllShops, getdata ,Logout}
