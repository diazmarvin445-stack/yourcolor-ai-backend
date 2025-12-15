const OpenAI = require('openai');
const config = require('../config/env');

const openai = new OpenAI({
  apiKey: config.openaiApiKey
});

async function generateImage(prompt) {
  const response = await openai.images.generate({
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
