require('dotenv').config();

const requiredEnvVars = ['OPENAI_API_KEY', 'CLIPDROP_API_KEY'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`Warning: ${envVar} is not set. API calls will fail until configured.`);
  }
}

// Default production origins
const defaultOrigins = [
  'https://yourcolor.com.im',
  'http://localhost:3000'
];

module.exports = {
  port: process.env.PORT || 3000,
  openaiApiKey: process.env.OPENAI_API_KEY,
  clipdropApiKey: process.env.CLIPDROP_API_KEY,
  shopifyWebhookSecret: process.env.SHOPIFY_WEBHOOK_SECRET,
  databasePath: process.env.DATABASE_PATH,
  allowedOrigins: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').concat(defaultOrigins)
    : defaultOrigins
};
