const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { addCredits, getUserByEmail, CREDITS_PER_PURCHASE } = require('../services/usageQuota');
const config = require('../config/env');

function verifyShopifyWebhook(req) {
  const hmacHeader = req.headers['x-shopify-hmac-sha256'];

  if (!hmacHeader || !config.shopifyWebhookSecret) {
    return false;
  }

  const hash = crypto
    .createHmac('sha256', config.shopifyWebhookSecret)
    .update(req.rawBody, 'utf8')
    .digest('base64');

  return crypto.timingSafeEqual(
    Buffer.from(hmacHeader),
    Buffer.from(hash)
  );
}

router.post('/order-paid', (req, res) => {
  try {
    // Verificar firma HMAC de Shopify
    if (!verifyShopifyWebhook(req)) {
      console.warn('Webhook signature verification failed');
      return res.status(401).json({
        success: false,
        error: 'Invalid webhook signature'
      });
    }

    const order = req.body;

    // Extraer email del cliente
    const customerEmail = order.customer?.email || order.email;

    if (!customerEmail) {
      console.warn('No customer email in order webhook');
      return res.status(200).json({
        success: true,
        message: 'No customer email found, skipping credits'
      });
    }

    // Verificar si el usuario existe con ese email
    const user = getUserByEmail(customerEmail);

    if (user) {
      // Agregar creditos
      const added = addCredits(customerEmail, CREDITS_PER_PURCHASE, true);

      console.log(`Credits added for ${customerEmail}: ${added ? CREDITS_PER_PURCHASE : 0}`);

      return res.status(200).json({
        success: true,
        message: `Added ${CREDITS_PER_PURCHASE} credits to ${customerEmail}`
      });
    } else {
      console.log(`No user found with email ${customerEmail}, credits will be added on next visit`);

      return res.status(200).json({
        success: true,
        message: 'User not found, will receive credits on registration'
      });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    // Siempre retornar 200 para que Shopify no reintente
    res.status(200).json({
      success: false,
      error: 'Internal error processing webhook'
    });
  }
});

module.exports = router;
