import 'dotenv/config'
const config = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,

    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_USER: process.env.SMTP_USER,
    SMPT_PASS: process.env.SMPT_PASS,
}

export default config;