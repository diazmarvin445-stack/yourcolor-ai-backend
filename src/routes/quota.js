const express = require('express');
const router = express.Router();
const { getUserQuota, getUserStats } = require('../services/usageQuota');

router.get('/quota', (req, res) => {
  try {
    const { fingerprint } = req.query;

    if (!fingerprint || typeof fingerprint !== 'string' || fingerprint.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Fingerprint es requerido'
      });
    }

    const stats = getUserStats(fingerprint.trim());

    res.json({
      success: true,
      remaining: stats.remaining,
      totalGenerated: stats.totalGenerated,
      canGenerate: stats.remaining > 0
    });
  } catch (error) {
    console.error('Error getting quota:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener cuota'
    });
  }
});

module.exports = router;
