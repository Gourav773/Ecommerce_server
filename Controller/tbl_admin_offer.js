const connection = require("../Model/model");
const addOffer = async (req, res) => {
    try {
        let sqlQuery = "INSERT INTO tbl_admin_offer SET ?";
        let data = {
            offerid: req.body.offerid,
            offername: req.body.offername,
            percentage_discount: req.body.percentage_discount,
            flat_discount: req.body.flat_discount,
            upto_discount: req.body.upto_discount,
            valid_from: req.body.valid_from,
            valid_to: req.body.valid_to,
            Subcategoryid: req.body.Subcategoryid,
            terms_and_condition: req.body.terms_and_condition,
            status: req.body.status,
        };  

        await connection.query(sqlQuery, data, function (error, result) {
            if (error) {
                console.log("Error:", error.sqlMessage);
                res.status(500).json({ error: "Internal Server Error" });
            } else {
                res.json(result);
            }
        });
    } catch (error) {
        console.log("Error found:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// const viewOffer = (req, res) => {
//     try {
//       const sqlQuery = 'SELECT * FROM tbl_admin_offer';
      
//       connection.query(sqlQuery, (error, result) => {
//         if (error) {
//           console.error('Error executing SQL query: ' + error.message);
//           res.status(500).json({ error: 'Internal Server Error' });
//         } else {
//           res.json(result);
//         } 
//       });
//     } catch (error) {
//       console.error(error.message);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   };
const viewOffer = async (req, res) => { 
  try {
      let sqlQuery = "SELECT * FROM tbl_admin_offer";
      connection.query(sqlQuery, function (error, result) {
          if (error) {
              console.log("error", error.sqlMessage);
              return res.status(500).json({ error: 'Internal Server Error' });
          }
          res.json(result);
      }); 
  } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: 'Internal Server Error' });
  }
}



  const updateOffer = async (req, res) => {
    try {
                const offerid = req.params.offerid || req.body.offerid;
        const { offername, percentage_discount, flat_discount, upto_discount, valid_from, valid_to, Subcategoryid, terms_and_condition, status } = req.body;

        const sqlQuery =
            "UPDATE tbl_admin_offer SET offername=?, percentage_discount=?, flat_discount=?, upto_discount=?, valid_from=?, valid_to=?, Subcategoryid=?, terms_and_condition=?, status=? WHERE offerid = ?";

        const data = [offername, percentage_discount, flat_discount, upto_discount, valid_from, valid_to, Subcategoryid, terms_and_condition, status, offerid];

        await connection.query(sqlQuery, data, function (error, result) {
            if (error) {
                console.log("Error:", error.sqlMessage);
                res.status(500).json({ error: "An error occurred while updating the offer" });
            } else {
                res.json({ message: "Offer updated successfully" });
            }
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "An error occurred while updating the offer" });
    }
};


const updateOfferStatus = (req, res) => {
  try {
      let sqlQuery = 'UPDATE tbl_admin_offer SET status = ? WHERE offerid = ?';
      let offerid = req.params.offerid || req.query.offerid || req.body.offerid;
      let data = req.body.status || req.query.status;

      if (!offerid || !data) {
          return res.status(400).json({ error: "offerid and status are required" });
      }

       connection.query(sqlQuery, [data, offerid], function (err, result) {
          if (err) {
              console.log("Error", err.sqlMessage);
              return res.status(500).json({ error: "Failed to update status" });
          }

          if (result.affectedRows === 0) {
              return res.status(404).json({ error: "Offer not found" });
          } else {
              res.json({ message: "Status updated", offerid, status: data });
          }
      });
  } catch (error) {
      console.log(error);
      res.status(500).json({ error: "DB error" });
  }
};

// const updateOfferStatus = (req, res) => {
//     try {
//         const offerid = req.params.offerid;
//         const newStatus = req.body.status;

//         const sqlQuery = 'UPDATE tbl_admin_offer SET status = ? WHERE offerid = ?';

//         connection.query(sqlQuery, [newStatus, offerid], (err, result) => {
//             if (err) { 
//                 console.error(err);
//                 res.status(500).json({ error: 'An error occurred while updating the status.' });
//             } else {
//                 if (result.affectedRows === 0) {
//                     res.status(404).json({ message: 'Offer not found.' });
//                 } else {
//                     res.status(200).json({ message: 'Status updated successfully.' });
//                 }
//             }
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'An error occurred.' });
//     }
// };

const searchByPercentageDiscount = (req, res) => {
    try {
      const percentageDiscount = req.query.percentage_discount;
  
      if (isNaN(parseFloat(percentageDiscount))) {
        return res.status(400).json({ error: 'Invalid percentage_discount value' });
      }
  
      const sqlQuery = 'SELECT * FROM tbl_admin_offer WHERE percentage_discount = ?';
  
      connection.query(sqlQuery, [percentageDiscount], (error, result) => {
        if (error) {
          console.error('Error executing SQL query: ' + error.message);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.json(result);
        } 
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  


 

module.exports = { addOffer, viewOffer, updateOffer, updateOfferStatus, searchByPercentageDiscount }   
