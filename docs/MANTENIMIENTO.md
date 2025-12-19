# Guia de Mantenimiento - YourColor AI

Guia tecnica para el mantenimiento y actualizacion del sistema.

---

## Tabla de Contenidos

1. [Actualizacion de API Keys](#actualizacion-de-api-keys)
2. [Modificar Traducciones](#modificar-traducciones)
3. [Personalizar Estilos](#personalizar-estilos)
4. [Monitoreo y Logs](#monitoreo-y-logs)
5. [Respaldos](#respaldos)
6. [Actualizaciones de Dependencias](#actualizaciones-de-dependencias)

---

## Actualizacion de API Keys

### OpenAI API Key

1. Ve a [platform.openai.com](https://platform.openai.com)
2. Navega a **API Keys**
3. Crea una nueva key o copia la existente
4. Actualiza la variable de entorno en tu hosting:

**Railway:**
```
Settings > Variables > OPENAI_API_KEY
```

**Render:**
```
Environment > OPENAI_API_KEY
```

**VPS con PM2:**
```bash
# Editar archivo .env
nano /ruta/al/proyecto/.env

# Cambiar:
OPENAI_API_KEY=sk-nueva-key-aqui

# Reiniciar
pm2 restart yourcolor-ai
```

### ClipDrop API Key

1. Ve a [clipdrop.co/apis](https://clipdrop.co/apis)
2. Copia tu API key
3. Actualiza `CLIPDROP_API_KEY` de la misma forma

### Verificar que Funciona

```bash
curl https://tu-servidor.com/api/health
```

Debe responder `{"status": "ok"}`.

---

## Modificar Traducciones

### Ubicacion de Archivos

En el tema de Shopify:
```
Tienda Online > Temas > Editar codigo > Locales
```

### Archivos

| Archivo | Idioma |
|---------|--------|
| `es.json` | Espanol |
| `en.default.json` | Ingles (por defecto) |

### Estructura

Busca la seccion `products.ai_generator`:

```json
{
  "products": {
    "ai_generator": {
      "title": "Crea tu diseno con IA",
      "placeholder": "Describe tu diseno...",
      "generate_button": "Generar Imagen",
      "download_button": "Descargar Imagen",
      "generating": "Generando tu diseno...",
      "error": "Error al generar. Intenta de nuevo.",
      "with_background": "Con fondo",
      "without_background": "Sin fondo",
      "move_up": "Mover arriba",
      "move_down": "Mover abajo",
      "move_left": "Mover izquierda",
      "move_right": "Mover derecha",
      "center": "Centrar",
      "zoom_in": "Acercar",
      "zoom_out": "Alejar"
    }
  }
}
```

### Agregar Nuevo Idioma

1. Crea archivo `fr.json` (o el codigo de idioma)
2. Copia la estructura de `en.default.json`
3. Traduce los textos

---

## Personalizar Estilos

### Archivo CSS

```
Tienda Online > Temas > Editar codigo > Assets > ai-generator.css
```

### Variables CSS

El modulo usa variables CSS para facilitar personalizacion:

```css
.ai-generator {
  --border-color: #e5e5e5;
  --text-color: #1a1a1a;
  --placeholder-color: #999;
  --primary-color: #1a1a1a;
  --input-bg: #fff;
  --controls-bg: #f9f9f9;
}
```

### Personalizar Colores

Para cambiar a los colores de tu marca:

```css
/* Al final de ai-generator.css */
.ai-generator {
  --primary-color: #FF5733;  /* Tu color principal */
  --border-color: #ddd;
}

.ai-generator__btn {
  background-color: #FF5733;
}
```

### Cambiar Tamano del Input

```css
.ai-generator__input {
  padding: 1rem 1.25rem;
  font-size: 18px;
}
```

### Cambiar Estilo de Botones de Control

```css
.ai-generator__controls button {
  width: 50px;
  height: 50px;
  font-size: 1.5rem;
  background: #your-color;
}
```

---

## Monitoreo y Logs

### Ver Logs en Railway

```
Dashboard > Tu proyecto > Deployments > View Logs
```

### Ver Logs en Render

```
Dashboard > Tu servicio > Logs
```

### Ver Logs con PM2

```bash
# Logs en tiempo real
pm2 logs yourcolor-ai

# Ultimas 100 lineas
pm2 logs yourcolor-ai --lines 100

# Limpiar logs
pm2 flush
```

### Formato de Logs

El servidor usa Morgan para logging:
```
::1 - - [19/Dec/2024:10:30:00 +0000] "POST /api/generate-image HTTP/1.1" 200 12345 "-" "Mozilla/5.0..."
```

### Errores Comunes en Logs

| Error | Causa | Solucion |
|-------|-------|----------|
| `OPENAI_API_KEY is not configured` | Falta la variable de entorno | Configura la key |
| `content_policy_violation` | Prompt rechazado por OpenAI | Informar al usuario |
| `rate_limit_exceeded` | Muchos requests a OpenAI | Esperar o aumentar plan |
| `CORS error` | Dominio no permitido | Agregar a ALLOWED_ORIGINS |

---

## Respaldos

### Archivos Criticos a Respaldar

**Backend:**
- `.env` (nunca subir a Git)
- `src/` (codigo fuente)

**Shopify:**
- `assets/ai-generator.js`
- `assets/ai-generator.css`
- `snippets/ai-image-generator.liquid`
- `locales/*.json` (solo las secciones de ai_generator)

### Comando para Backup

```bash
# Crear backup del proyecto
tar -czvf yourcolor-ai-backup-$(date +%Y%m%d).tar.gz \
  --exclude=node_modules \
  --exclude=.git \
  /ruta/al/proyecto
```

---

## Actualizaciones de Dependencias

### Verificar Actualizaciones

```bash
npm outdated
```

### Actualizar Dependencias

```bash
# Actualizar todas
npm update

# Actualizar especifica
npm install openai@latest
```

### Dependencias Criticas

| Paquete | Uso |
|---------|-----|
| `openai` | SDK de OpenAI para DALL-E |
| `axios` | Requests a ClipDrop |
| `express` | Servidor web |
| `cors` | Control de acceso |
| `express-rate-limit` | Proteccion contra spam |

### Despues de Actualizar

1. Probar localmente: `npm run dev`
2. Verificar que `/api/health` responde
3. Generar una imagen de prueba
4. Deploy a produccion

---

## Reiniciar el Servidor

### Railway

```
Dashboard > Tu proyecto > Deployments > Redeploy
```

### Render

```
Dashboard > Tu servicio > Manual Deploy > Deploy
```

### PM2

```bash
pm2 restart yourcolor-ai
```

### Docker

```bash
docker-compose restart yourcolor-api
```

---

## Contacto Tecnico

Para soporte de desarrollo:

**Desarrollador:** Victor Alejo
**Email:** contacto@victalejo.dev
**GitHub:** [github.com/victalejo](https://github.com/victalejo)

---

*Documentacion actualizada: Diciembre 2025*
