require('dotenv').config();

function parseCsv(value) {
    if (!value) return [];
    return String(value)
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
}

const config = {
    port: Number(process.env.PORT) || 5000,

    cors: {
        origins: parseCsv(process.env.CORS_ORIGINS).length
            ? parseCsv(process.env.CORS_ORIGINS)
            : [process.env.CORS_ORIGIN || 'http://localhost:3000', 'http://localhost:3001'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    },

    jwt: {
        secret: process.env.JWT_SECRET || 'jwt-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    },

    uploads: {
        driver: (process.env.UPLOAD_DRIVER || 'auto').toLowerCase(), // auto|s3|local
        localDir: process.env.UPLOAD_LOCAL_DIR || 'uploads',
        publicPath: process.env.UPLOAD_PUBLIC_PATH || '/uploads'
    },

    s3: {
        bucket: process.env.AWS_S3_BUCKET || '',
        region: process.env.AWS_REGION || 'ap-south-1',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
    },

    db: {
        user: process.env.DB_USER || 'root',
        host: process.env.DB_HOST || 'localhost',
        password: process.env.DB_PASSWORD || '',
        port: process.env.DB_PORT || '3306',
        name: process.env.DB_NAME || 'ecommerce'
    },

    otp: {
        length: Number(process.env.OTP_LENGTH) || 6,
        expiresMinutes: Number(process.env.OTP_EXPIRES_MINUTES) || 10,
        minSecondsBetweenRequests: Number(process.env.OTP_MIN_SECONDS_BETWEEN_REQUESTS) || 60,
        maxPerHour: Number(process.env.OTP_MAX_PER_HOUR) || 5,
        provider: (process.env.SMS_PROVIDER || 'console').toLowerCase(),
        debugReturnOtp: String(process.env.OTP_DEBUG_RETURN || '').toLowerCase() === 'true'
    },

    razorpay: {
        keyId: process.env.RAZORPAY_KEY_ID || '',
        keySecret: process.env.RAZORPAY_KEY_SECRET || ''
    }
};

config.s3.enabled = Boolean(config.s3.bucket && config.s3.accessKeyId && config.s3.secretAccessKey);
config.razorpay.enabled = Boolean(config.razorpay.keyId && config.razorpay.keySecret);

module.exports = config;
