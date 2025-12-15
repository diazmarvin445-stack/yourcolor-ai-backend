require('dotenv').config();

const requiredEnvVars = ['OPENAI_API_KEY', 'CLIPDROP_API_KEY'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`Warning: ${envVar} is not set. API calls will fail until configured.`);
  }
}

module.exports = {
  port: process.env.PORT || 3000,
  openaiApiKey: process.env.OPENAI_API_KEY,
  clipdropApiKey: process.env.CLIPDROP_API_KEY,
  allowedOrigins: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000']
};
