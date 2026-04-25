require('dotenv').config();
let multer = require("multer")
const path = require('path');
const fs = require('fs');

// Allowed file types
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
const maxFileSize = 5 * 1024 * 1024; // 5MB

// File filter
const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, WebP and PDF are allowed.'), false);
    }
};

const useS3 = !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);

let upload, uploadAdmin;

if (useS3) {
    // S3 storage
    const multerS3 = require('multer-s3');
    const { S3Client } = require('@aws-sdk/client-s3');

    const s3 = new S3Client({
        region: process.env.AWS_REGION || "ap-south-1",
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
    });

    const s3Admin = new S3Client({
        region: process.env.AWS_ADMIN_REGION || "us-east-2",
        credentials: {
            accessKeyId: process.env.AWS_ADMIN_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_ADMIN_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY
        }
    });

    let storage = multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME || "forimg123456",
        metadata: (req, file, cb) => { cb(null, { fieldName: file.fieldname }) },
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => { cb(null, Date.now() + '-' + file.originalname) }
    });

    let adminStorage = multerS3({
        s3: s3Admin,
        bucket: process.env.AWS_ADMIN_BUCKET_NAME || "addminn",
        metadata: (req, file, cb) => { cb(null, { fieldName: file.fieldname }) },
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => { cb(null, Date.now() + '-' + file.originalname) }
    });

    upload = multer({ storage: storage, fileFilter, limits: { fileSize: maxFileSize } });
    uploadAdmin = multer({ storage: adminStorage, fileFilter, limits: { fileSize: maxFileSize } });
    console.log("Multer: Using S3 storage");
} else {
    // Local disk fallback
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    const localStorage = multer.diskStorage({
        destination: (req, file, cb) => { cb(null, uploadsDir) },
        filename: (req, file, cb) => { cb(null, Date.now() + '-' + file.originalname) }
    });

    upload = multer({ storage: localStorage, fileFilter, limits: { fileSize: maxFileSize } });
    uploadAdmin = multer({ storage: localStorage, fileFilter, limits: { fileSize: maxFileSize } });
    console.log("Multer: Using local disk storage (no AWS keys found)");
}

module.exports = { upload, uploadAdmin };