# YourColor AI

Sistema de generacion de imagenes con IA para personalizacion de productos en Shopify.

## Descripcion

YourColor AI permite a los clientes de una tienda Shopify crear disenos personalizados usando inteligencia artificial (DALL-E 3) y previsualizarlos directamente sobre los productos antes de comprar.

### Caracteristicas

- Generacion de imagenes con DALL-E 3
- Remocion automatica de fondo (ClipDrop API)
- Previsualizacion en tiempo real sobre el producto
- Controles de posicion y zoom
- Descarga de diseno en alta resolucion (4500x5400px @ 300 DPI)
- Soporte multiidioma (ES/EN)
- Responsive (movil y desktop)

## Arquitectura

```
+---------------------+     +---------------------+
|   Shopify Store     |---->|   Backend API       |
|   (Frontend)        |<----|   (Node.js)         |
+---------------------+     +---------------------+
                                     |
                            +--------+--------+
                            v                 v
                    +---------------+  +---------------+
                    |   OpenAI      |  |   ClipDrop    |
                    |   DALL-E 3    |  |   (Bg Remove) |
                    +---------------+  +---------------+
```

## Requisitos

- Node.js 18+
- Cuenta OpenAI con acceso a DALL-E 3
- Cuenta ClipDrop (para remocion de fondo)
- Tienda Shopify con tema compatible

## Instalacion

### Backend

```bash
# Clonar repositorio
git clone <repo-url>
cd yourcolor-ai

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus API keys

# Iniciar servidor
npm start
```

### Shopify

1. Copiar archivos de `shopify/` a tu tema:
   - `assets/ai-generator.js`
   - `assets/ai-generator.css`
   - `snippets/ai-image-generator.liquid`

2. Agregar traducciones a `locales/es.json` y `locales/en.default.json`

3. En el Theme Editor, agregar el bloque "AI Image Generator" a la seccion de producto

## Variables de Entorno

```env
# API Keys (requeridas)
OPENAI_API_KEY=sk-...
CLIPDROP_API_KEY=...

# Servidor
PORT=3000

# CORS - dominios permitidos (separados por coma)
ALLOWED_ORIGINS=https://tu-tienda.myshopify.com,https://tu-dominio.com
```

## Estructura del Proyecto

```
yourcolor-ai/
├── src/
│   ├── index.js              # Servidor Express
│   ├── config/
│   │   └── env.js            # Configuracion de entorno
│   ├── routes/
│   │   └── generate.js       # Endpoint de generacion
│   ├── services/
│   │   ├── openai.js         # Integracion DALL-E 3
│   │   └── clipdrop.js       # Integracion remocion fondo
│   └── middleware/
│       └── errorHandler.js   # Manejo de errores
├── shopify/
│   ├── assets/
│   │   ├── ai-generator.js   # Modulo frontend
│   │   └── ai-generator.css  # Estilos
│   ├── snippets/
│   │   └── ai-image-generator.liquid
│   └── locales/              # Traducciones
├── docs/                     # Documentacion
├── .env.example
├── package.json
└── README.md
```

## API Endpoints

### Health Check
```
GET /api/health
```

### Generar Imagen
```
POST /api/generate-image
Content-Type: application/json

{
  "prompt": "descripcion del diseno",
  "withBackground": true|false
}
```

Ver [docs/API.md](docs/API.md) para documentacion completa.

## Documentacion

- [Guia para el Cliente](docs/GUIA-CLIENTE.md) - Como usar el modulo en Shopify
- [Documentacion API](docs/API.md) - Referencia tecnica del endpoint
- [Guia de Mantenimiento](docs/MANTENIMIENTO.md) - Actualizacion y configuracion

## Despliegue

El backend puede desplegarse en:
- Railway
- Render
- Heroku
- VPS con PM2

Asegurate de configurar las variables de entorno en tu plataforma de hosting.

## Licencia

Propiedad de YourColor Corp. Todos los derechos reservados.

---

Desarrollado por [Victor Alejo](https://victalejo.dev)
