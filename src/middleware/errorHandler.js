function errorHandler(err, req, res, next) {
  console.error('Error:', err.message);

  // OpenAI API errors
  if (err.status === 400 && err.code === 'content_policy_violation') {
    return res.status(400).json({
      success: false,
      error: 'El contenido del prompt viola las politicas de uso. Intenta con otro prompt.'
    });
  }

  if (err.status === 429) {
    return res.status(429).json({
      success: false,
      error: 'Demasiadas solicitudes. Intenta de nuevo en unos minutos.'
    });
  }

  // Clipdrop errors
  if (err.response?.status === 400) {
    return res.status(400).json({
      success: false,
      error: 'Error al procesar la imagen. Intenta de nuevo.'
    });
  }

  // Default error
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor. Intenta de nuevo.'
  });
}

module.exports = errorHandler;
