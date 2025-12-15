const OpenAI = require('openai');
const config = require('../config/env');

let openai = null;

function getClient() {
  if (!openai) {
    if (!config.openaiApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }
    openai = new OpenAI({ apiKey: config.openaiApiKey });
  }
  return openai;
}

async function generateImage(prompt) {
  const client = getClient();
  const response = await client.images.generate({
    model: 'dall-e-3',
    prompt: prompt,
    n: 1,
    size: '1024x1024',
    quality: 'standard',
    response_format: 'b64_json'
  });

  return response.data[0].b64_json;
}

module.exports = { generateImage };
