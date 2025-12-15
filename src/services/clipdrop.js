const axios = require('axios');
const FormData = require('form-data');
const config = require('../config/env');

async function removeBackground(imageBase64) {
  if (!config.clipdropApiKey) {
    throw new Error('CLIPDROP_API_KEY is not configured');
  }
  const imageBuffer = Buffer.from(imageBase64, 'base64');

  const form = new FormData();
  form.append('image_file', imageBuffer, {
    filename: 'image.png',
    contentType: 'image/png'
  });

  const response = await axios.post(
    'https://clipdrop-api.co/remove-background/v1',
    form,
    {
      headers: {
        ...form.getHeaders(),
        'x-api-key': config.clipdropApiKey
      },
      responseType: 'arraybuffer',
      timeout: 30000
    }
  );

  return Buffer.from(response.data).toString('base64');
}

module.exports = { removeBackground };
