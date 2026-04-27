// require('dotenv').config();
// const express = require('express');
// const path = require('path');
// const app = express();
// const cors = require("cors");
// const config = require("./config");

// // CORS - restrict to allowed origins
// app.use(cors({
//     origin: config.cors.origins,
//     methods: config.cors.methods,
//     credentials: config.cors.credentials
// }));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// const port = process.env.PORT || 5000;

// const { AdminUser } = require("./Routes/tbl_admin_user") 
// app.use("/", AdminUser);

// const { AdminRole } = require("./Routes/tbl_admin_roles")
// app.use("/", AdminRole);

// const { AdminRoleAssign } = require("./Routes/tbl_admin_role_assign")
// app.use("/", AdminRoleAssign);

// const { AdminProduct } = require("./Routes/tbl_admin_product_category")
// app.use("/", AdminProduct);

// const { AdminProductSubcategory } = require("./Routes/tbl_admin_subcategory")
// app.use("/", AdminProductSubcategory);

// const { AdminOffer } = require("./Routes/tbl_admin_offer")
// app.use("/", AdminOffer);

// const { Retailer } = require("./Routes/tbl_retailer_register")
// app.use("/", Retailer);

// const { retailerProducts } = require("./Routes/tbl_retailer_products")
// app.use("/", retailerProducts);

// const { retailerProductsDescription } = require("./Routes/tbl_retailer_product_description")
// app.use("/", retailerProductsDescription);

// const { retailerProductsImages } = require("./Routes/tbl_retailer_product_images")
// app.use("/", retailerProductsImages);

// const { retailerBanking } = require("./Routes/tbl_retailer_banking")
// app.use("/", retailerBanking);

// // Customer APIs
// const { customerAuthRoutes } = require("./Routes/customer/auth");
// const { customerProductRoutes } = require("./Routes/customer/products");
// const { customerCartRoutes } = require("./Routes/customer/cart");
// const { customerWishlistRoutes } = require("./Routes/customer/wishlist");
// const { customerOrderRoutes } = require("./Routes/customer/orders");
// const { customerReviewRoutes } = require("./Routes/customer/reviews");
// const { customerPaymentRoutes } = require("./Routes/customer/payments");

// app.use("/", customerAuthRoutes);
// app.use("/", customerProductRoutes);
// app.use("/", customerCartRoutes);
// app.use("/", customerWishlistRoutes);
// app.use("/", customerOrderRoutes);
// app.use("/", customerReviewRoutes);
// app.use("/", customerPaymentRoutes);


// //for swagger 
// const swaggerui = require('swagger-ui-express')
// const swaggerJSDoc = require('swagger-jsdoc')
// const option = {
//     definition: {
//         openapi: '3.0.0',
//         info: {
//             title: "NODE JS API DOCUMENTATION by Shrayansh",
//             version: "1.0.0"
//         },
//         servers: [
//             {
//                 url: "http://localhost:5000"
//             }
//         ]
//     },
//     apis: ["./Routes/tbl_admin_user.js"]
// }
// const swaggerSpec = swaggerJSDoc(option)
// app.use('/api-docs', swaggerui.serve, swaggerui.setup(swaggerSpec))

// // Global error handler
// app.use((err, req, res, next) => {
//     console.error("Global Error:", err.message);
//     if (err.message && err.message.includes('Invalid file type')) {
//         return res.status(400).json({ error: err.message });
//     }
//     res.status(500).json({ error: "Internal Server Error" });
// });

// app.listen(port, () => {
//     console.log(`server is running on ${port}`)
// });


require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require("cors");
const cookieParser = require("cookie-parser"); // ✅ FIX

const config = require("./config");

const app = express();
const port = process.env.PORT 

// ✅ CORS
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://ecommerce-view-ten.vercel.app",
    "https://retailer-xyz.vercel.app",
    "https://customer-xyz.vercel.app"
  ],
  credentials: true
}));

// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // ✅ FIX (token issue solved)

// Static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// ================== ROUTES ==================

// Admin
const { AdminUser } = require("./Routes/tbl_admin_user");
app.use("/", AdminUser);

const { AdminRole } = require("./Routes/tbl_admin_roles");
app.use("/", AdminRole);

const { AdminRoleAssign } = require("./Routes/tbl_admin_role_assign");
app.use("/", AdminRoleAssign);

const { AdminProduct } = require("./Routes/tbl_admin_product_category");
app.use("/", AdminProduct);

const { AdminProductSubcategory } = require("./Routes/tbl_admin_subcategory");
app.use("/", AdminProductSubcategory);

const { AdminOffer } = require("./Routes/tbl_admin_offer");
app.use("/", AdminOffer);

// Retailer
const { Retailer } = require("./Routes/tbl_retailer_register");
app.use("/", Retailer);

const { retailerProducts } = require("./Routes/tbl_retailer_products");
app.use("/", retailerProducts);

const { retailerProductsDescription } = require("./Routes/tbl_retailer_product_description");
app.use("/", retailerProductsDescription);

const { retailerProductsImages } = require("./Routes/tbl_retailer_product_images");
app.use("/", retailerProductsImages);

const { retailerBanking } = require("./Routes/tbl_retailer_banking");
app.use("/", retailerBanking);

// Customer
const { customerAuthRoutes } = require("./Routes/customer/auth");
const { customerProductRoutes } = require("./Routes/customer/products");
const { customerCartRoutes } = require("./Routes/customer/cart");
const { customerWishlistRoutes } = require("./Routes/customer/wishlist");
const { customerOrderRoutes } = require("./Routes/customer/orders");
const { customerReviewRoutes } = require("./Routes/customer/reviews");
const { customerPaymentRoutes } = require("./Routes/customer/payments");

app.use("/", customerAuthRoutes);
app.use("/", customerProductRoutes);
app.use("/", customerCartRoutes);
app.use("/", customerWishlistRoutes);
app.use("/", customerOrderRoutes);
app.use("/", customerReviewRoutes);
app.use("/", customerPaymentRoutes);


// ================== SWAGGER ==================

const swaggerui = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const option = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: "NODE JS API DOCUMENTATION",
            version: "1.0.0"
        },
        servers: [
            {
                url: "http://localhost:5000"
            }
        ]
    },
    apis: ["./Routes/tbl_admin_user.js"]
};

const swaggerSpec = swaggerJSDoc(option);
app.use('/api-docs', swaggerui.serve, swaggerui.setup(swaggerSpec));


// ================== GLOBAL ERROR HANDLER ==================

app.use((err, req, res, next) => {
    console.error("Global Error:", err.message);

    if (err.message && err.message.includes('Invalid file type')) {
        return res.status(400).json({ error: err.message });
    }

    return res.status(500).json({ error: "Internal Server Error" });
});

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});
// ================== SERVER START ==================

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});