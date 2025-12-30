const express = require('express');
const router = express.Router();
const { generateImage } = require('../services/openai');
const { removeBackground } = require('../services/clipdrop');
const { canGenerate, decrementQuota, getUserQuota, linkEmail } = require('../services/usageQuota');

router.post('/generate-image', async (req, res, next) => {
  try {
    const { prompt, withBackground = true, fingerprint, email } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'El prompt es requerido'
      });
    }

    if (!fingerprint || typeof fingerprint !== 'string' || fingerprint.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Fingerprint es requerido'
      });
    }

    const fp = fingerprint.trim();

    // Vincular email si se proporciona
    if (email && typeof email === 'string' && email.trim().length > 0) {
      linkEmail(fp, email.trim());
    }

    // Verificar cuota antes de generar
    if (!canGenerate(fp)) {
      return res.status(403).json({
        success: false,
        error: 'Has agotado tus imagenes gratuitas. Compra para desbloquear mas.',
        remaining: 0,
        quotaExhausted: true
      });
    }

    // Generar imagen con DALL-E 3
    let imageBase64 = await generateImage(prompt.trim());

    // Remover fondo si se solicita
    if (withBackground === false) {
      imageBase64 = await removeBackground(imageBase64);
    }

    // Decrementar cuota despues de generar exitosamente
    const remaining = decrementQuota(fp);

    res.json({
      success: true,
      imageUrl: `data:image/png;base64,${imageBase64}`,
      prompt: prompt.trim(),
      withBackground,
      remaining
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
