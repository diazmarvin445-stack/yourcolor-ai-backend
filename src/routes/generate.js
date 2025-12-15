const express = require('express');
const router = express.Router();
const { generateImage } = require('../services/openai');
const { removeBackground } = require('../services/clipdrop');

router.post('/generate-image', async (req, res, next) => {
  try {
    const { prompt, withBackground = true } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'El prompt es requerido'
      });
    }

    // Generar imagen con DALL-E 3
    let imageBase64 = await generateImage(prompt.trim());

    // Remover fondo si se solicita
    if (withBackground === false) {
      imageBase64 = await removeBackground(imageBase64);
    }

    res.json({
      success: true,
      imageUrl: `data:image/png;base64,${imageBase64}`,
      prompt: prompt.trim(),
      withBackground
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
