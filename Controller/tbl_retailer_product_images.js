// const connection = require("../Model/model");

// const addRetailerProductsImages = async (req, res) => {
//     try {
//         const imagePath = req.file ? (req.file.location || req.file.path) : (req.body.image || null);
//         if (!imagePath) {
//             return res.status(400).json({ error: "Image is required" });
//         }
//         let sqlQuery = "INSERT INTO tbl_retailer_product_images SET ?";
//         let data = {
//             pid: req.body.pid,
//             imgid: req.body.imgid,
//             image: imagePath,
//             description: req.body.description,
//             colour: req.body.colour
//         };

//         await connection.query(sqlQuery, data, function (error, result) {
//             if (error) {
//                 console.log("Error: ", error.sqlMessage);
//                 res.json("Failed to insert data");
//             } else {
//                 res.json(result);
//             }
//         });
//     } catch (error) {
//         console.log("Error found:", error); 
//         res.json("error found..");
//     }
// };

// const updateRetailerProductsImage = async (req, res) => {
//     try {
//         const { imgid } = req.params; 
//         let sqlQuery = "UPDATE tbl_retailer_product_images SET image = ? WHERE imgid = ?";
//         const imagePath = req.file ? (req.file.location || req.file.path) : (req.body.image || null);
//         if (!imagePath) {
//             return res.status(400).json({ error: "Image is required" });
//         }
//         let data = [imagePath, imgid];
//       await connection.query(sqlQuery, data, function (error, result) {
//             if (error) {
//                 console.log("Error: ", error.sqlMessage);
//                 res.json("Failed to update image");
//             } else {
//                 res.json(result);
//             }
//         }); 
//     } catch (error) {
//         console.log("Error found:", error);
//         res.json("Error..");
//     }
// };

// const viewRetailerProductsImages = async (req, res) => { 
//     try {
//         const { pid } = req.params; 
//         let sqlQuery = "SELECT image FROM tbl_retailer_product_images WHERE pid = ?";
//       await connection.query(sqlQuery, [pid], function (error, results) {
//             if (error) {
//                 console.log("Error: ", error.sqlMessage);
//                 res.json("Failed to fetchh images");
//             } else {
//                 const images = results.map(result => result.image);
//                 res.json(images);
//             }
//         });
//     } catch (error) {
//         console.log("Error found:", error);
//         res.json("server error...");
//     }
// };
 



// module.exports = {addRetailerProductsImages, updateRetailerProductsImage, viewRetailerProductsImages}

const connection = require("../Model/model");

// ADD IMAGE
const addRetailerProductsImages = (req, res) => {
    try {
        const imagePath = req.file
            ? (req.file.location || req.file.path)
            : (req.body.image || null);

        if (!imagePath) {
            return res.status(400).json({ error: "Image is required" });
        }

        const sqlQuery = "INSERT INTO tbl_retailer_product_images SET ?";
        const data = {
            pid: req.body.pid,
            imgid: req.body.imgid,
            image: imagePath,
            description: req.body.description,
            colour: req.body.colour
        };

        connection.query(sqlQuery, data, (error, result) => {
            if (error) {
                console.log("Error:", error.sqlMessage);
                return res.status(500).json({ error: "Insert failed" });
            }

            return res.json(result);
        });

    } catch (error) {
        console.log("Error found:", error);
        return res.status(500).json({ error: "Server error" });
    }
};

// UPDATE IMAGE
const updateRetailerProductsImage = (req, res) => {
    try {
        const { imgid } = req.params;

        const imagePath = req.file
            ? (req.file.location || req.file.path)
            : (req.body.image || null);

        if (!imagePath) {
            return res.status(400).json({ error: "Image is required" });
        }

        const sqlQuery = "UPDATE tbl_retailer_product_images SET image = ? WHERE imgid = ?";
        const data = [imagePath, imgid];

        connection.query(sqlQuery, data, (error, result) => {
            if (error) {
                console.log("Error:", error.sqlMessage);
                return res.status(500).json({ error: "Update failed" });
            }

            return res.json(result);
        });

    } catch (error) {
        console.log("Error found:", error);
        return res.status(500).json({ error: "Server error" });
    }
};

// VIEW IMAGES
const viewRetailerProductsImages = (req, res) => {
    try {
        const { pid } = req.params;

        const sqlQuery = "SELECT image FROM tbl_retailer_product_images WHERE pid = ?";

        connection.query(sqlQuery, [pid], (error, results) => {
            if (error) {
                console.log("Error:", error.sqlMessage);
                return res.status(500).json({ error: "Fetch failed" });
            }

            const images = results.map(item => item.image);
            return res.json(images);
        });

    } catch (error) {
        console.log("Error found:", error);
        return res.status(500).json({ error: "Server error" });
    }
};

module.exports = {
    addRetailerProductsImages,
    updateRetailerProductsImage,
    viewRetailerProductsImages
};