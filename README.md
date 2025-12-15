# YourColor AI Backend

Backend para generación de imágenes con DALL-E 3 y remoción de fondo con Clipdrop.

## Setup Local

```bash
npm install
cp .env.example .env
# Editar .env con tus API keys
npm run dev
```

## Variables de Entorno

| Variable | Descripción |
|----------|-------------|
| PORT | Puerto del servidor (default: 3000) |
| OPENAI_API_KEY | API key de OpenAI |
| CLIPDROP_API_KEY | API key de Clipdrop |
| ALLOWED_ORIGINS | Dominios permitidos para CORS (separados por coma) |

## Endpoints

### POST /api/generate-image

Genera una imagen basada en un prompt.

**Request:**
```json
{
  "prompt": "un dragon de fuego estilo anime",
  "withBackground": true
}
```

**Response:**
```json
{
  "success": true,
  "imageUrl": "data:image/png;base64,...",
  "prompt": "un dragon de fuego estilo anime",
  "withBackground": true
}
```

### GET /api/health

Health check del servidor.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Deploy en Railway

1. Conectar repositorio de GitHub
2. Agregar variables de entorno en Railway
3. Deploy automático

## Deploy en Render

1. Crear nuevo Web Service
2. Conectar repositorio
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Agregar variables de entorno
