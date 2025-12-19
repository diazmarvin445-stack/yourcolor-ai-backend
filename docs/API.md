# API Documentation - YourColor AI

Documentacion tecnica del endpoint de generacion de imagenes.

---

## Base URL

```
https://yourcoloria.victalejo.dev
```

---

## Autenticacion

No requiere autenticacion. El acceso se controla mediante CORS (solo dominios permitidos pueden hacer requests).

---

## Endpoints

### Health Check

Verifica que el servidor este funcionando.

```
GET /api/health
```

**Response 200:**
```json
{
  "status": "ok",
  "timestamp": "2024-12-19T10:30:00.000Z"
}
```

---

### Generar Imagen

Genera una imagen usando DALL-E 3 basada en un prompt de texto.

```
POST /api/generate-image
Content-Type: application/json
```

**Request Body:**

| Campo | Tipo | Requerido | Descripcion |
|-------|------|-----------|-------------|
| `prompt` | string | Si | Descripcion del diseno a generar (max 500 caracteres) |
| `withBackground` | boolean | No | `true` = con fondo, `false` = sin fondo (default: `true`) |

**Ejemplo Request:**
```json
{
  "prompt": "Un dragon de fuego estilo anime volando sobre montanas",
  "withBackground": false
}
```

**Response 200 (Exito):**
```json
{
  "success": true,
  "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...",
  "prompt": "Un dragon de fuego estilo anime volando sobre montanas",
  "withBackground": false
}
```

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| `success` | boolean | `true` si la generacion fue exitosa |
| `imageUrl` | string | Imagen en formato base64 data URI |
| `prompt` | string | El prompt original (sanitizado) |
| `withBackground` | boolean | Si la imagen tiene fondo o no |

---

## Codigos de Error

### 400 Bad Request

Prompt invalido o faltante.

```json
{
  "success": false,
  "error": "El prompt es requerido"
}
```

### 429 Too Many Requests

Se excedio el limite de requests.

```json
{
  "success": false,
  "error": "Demasiadas solicitudes. Intenta de nuevo en 15 minutos."
}
```

### 500 Internal Server Error

Error del servidor o de las APIs externas.

```json
{
  "success": false,
  "error": "Error generating image: <mensaje de error>"
}
```

**Errores comunes de OpenAI:**

| Error | Causa |
|-------|-------|
| `content_policy_violation` | El prompt viola las politicas de uso de OpenAI |
| `rate_limit_exceeded` | Se excedio el limite de la API de OpenAI |
| `insufficient_quota` | No hay creditos suficientes en la cuenta OpenAI |

---

## Rate Limits

| Limite | Valor |
|--------|-------|
| Requests por IP | 100 cada 15 minutos |
| Timeout del request | 30 segundos |

---

## Especificaciones de la Imagen

### Imagen Generada (DALL-E 3)

| Propiedad | Valor |
|-----------|-------|
| Tamano | 1024 x 1024 px |
| Formato | PNG |
| Calidad | Standard |
| Modelo | DALL-E 3 |

### Imagen sin Fondo (ClipDrop)

Cuando `withBackground: false`:
- Se remueve el fondo usando ClipDrop API
- El resultado tiene transparencia (PNG con canal alpha)

---

## Ejemplo con cURL

```bash
curl -X POST https://yourcoloria.victalejo.dev/api/generate-image \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Un gato astronauta flotando en el espacio",
    "withBackground": true
  }'
```

---

## Ejemplo con JavaScript (Fetch)

```javascript
async function generateImage(prompt, withBackground = true) {
  const response = await fetch('https://yourcoloria.victalejo.dev/api/generate-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt,
      withBackground
    })
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error);
  }

  return data.imageUrl; // data:image/png;base64,...
}

// Uso
generateImage('Un lobo aullando a la luna', false)
  .then(imageUrl => {
    document.querySelector('img').src = imageUrl;
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
```

---

## Notas de Implementacion

### Tiempo de Respuesta

- Con fondo: 5-10 segundos
- Sin fondo: 8-15 segundos (incluye procesamiento adicional)

### Manejo de Errores Recomendado

```javascript
try {
  const imageUrl = await generateImage(prompt, withBackground);
  // Mostrar imagen
} catch (error) {
  if (error.message.includes('policy')) {
    // Mostrar mensaje sobre contenido no permitido
  } else if (error.message.includes('rate')) {
    // Mostrar mensaje de esperar
  } else {
    // Error generico
  }
}
```

### CORS

El servidor solo acepta requests desde dominios configurados en `ALLOWED_ORIGINS`. Para desarrollo local, agrega `http://localhost:3000` a la lista.

---

*Documentacion actualizada: Diciembre 2025*
