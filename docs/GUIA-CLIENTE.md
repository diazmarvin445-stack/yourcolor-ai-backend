# Guia del Cliente - YourColor AI

Guia completa para administrar y usar el modulo de generacion de imagenes con IA en tu tienda Shopify.

---

## Tabla de Contenidos

1. [Como Funciona](#como-funciona)
2. [Activar el Modulo en un Producto](#activar-el-modulo-en-un-producto)
3. [Configuracion del Bloque](#configuracion-del-bloque)
4. [Experiencia del Cliente Final](#experiencia-del-cliente-final)
5. [Cambiar la URL del Backend](#cambiar-la-url-del-backend)
6. [Modificar Traducciones](#modificar-traducciones)
7. [Solucion de Problemas](#solucion-de-problemas)
8. [Contacto de Soporte](#contacto-de-soporte)

---

## Como Funciona

El modulo YourColor AI permite que tus clientes:

1. **Describan** el diseno que quieren (ej: "un dragon de fuego")
2. **Generen** la imagen con inteligencia artificial
3. **Ajusten** la posicion y tamano sobre el producto
4. **Descarguen** el diseno en alta resolucion
5. **Agreguen** al carrito y compren

La imagen se genera usando DALL-E 3 de OpenAI y se puede remover el fondo automaticamente.

---

## Activar el Modulo en un Producto

### Paso 1: Ir al Editor del Tema

1. En tu admin de Shopify, ve a **Tienda Online > Temas**
2. Haz clic en **Personalizar** en tu tema activo

### Paso 2: Seleccionar la Pagina de Producto

1. En el selector de paginas (arriba), elige **Productos > Producto predeterminado**
2. O navega a un producto especifico donde quieras el modulo

### Paso 3: Agregar el Bloque

1. En el panel izquierdo, busca la seccion **Informacion del producto**
2. Haz clic en **Agregar bloque**
3. Selecciona **AI Image Generator**
4. Arrastra el bloque a la posicion deseada (recomendado: despues del titulo o precio)

### Paso 4: Guardar

1. Haz clic en **Guardar** en la esquina superior derecha
2. El modulo estara activo en ese producto

---

## Configuracion del Bloque

Al seleccionar el bloque "AI Image Generator" puedes configurar:

| Opcion | Descripcion |
|--------|-------------|
| **Titulo personalizado** | Texto que aparece arriba del campo (ej: "Crea tu diseno") |
| **URL del Backend** | Direccion del servidor que genera las imagenes |
| **Mostrar toggle de fondo** | Permite al cliente elegir si quiere fondo o no |

### URL del Backend por Defecto

```
https://yourcoloria.victalejo.dev
```

Solo cambia esta URL si migras el backend a otro servidor.

---

## Experiencia del Cliente Final

Asi es como tus clientes usaran el modulo:

### 1. Escribir la Idea
El cliente escribe una descripcion de lo que quiere ver en el producto.

**Ejemplos:**
- "Un lobo aullando a la luna"
- "Flores de cerezo estilo japones"
- "Mi nombre 'Juan' en letras de fuego"

### 2. Elegir Fondo
- **Con fondo**: La imagen tiene un fondo completo
- **Sin fondo**: Solo el elemento principal, transparente

### 3. Generar
Al hacer clic en "Generar Imagen", el sistema:
- Envia la descripcion a la IA
- Genera la imagen (5-15 segundos)
- La muestra sobre el producto

### 4. Ajustar Posicion
Los controles permiten:
- **Flechas**: Mover arriba, abajo, izquierda, derecha
- **Centro**: Centrar el diseno
- **Zoom +/-**: Hacer mas grande o mas pequeno

### 5. Descargar
El boton "Descargar Imagen" guarda el diseno en alta resolucion (4500x5400px) listo para imprimir.

### 6. Comprar
El cliente selecciona talla, cantidad y agrega al carrito normalmente.

---

## Cambiar la URL del Backend

Si necesitas apuntar a un nuevo servidor:

### Opcion 1: Desde el Theme Editor

1. Ve a **Personalizar tema > Producto**
2. Selecciona el bloque **AI Image Generator**
3. Cambia el campo **Backend URL**
4. Guarda

### Opcion 2: Desde el Codigo

1. Ve a **Tienda Online > Temas > Editar codigo**
2. Abre `snippets/ai-image-generator.liquid`
3. Busca `data-backend-url`
4. Cambia la URL por defecto

---

## Modificar Traducciones

Los textos del modulo se pueden cambiar desde:

**Tienda Online > Temas > Editar codigo > Locales**

### Archivo: `es.json`

Busca la seccion `"ai_generator"` y modifica los textos:

```json
"ai_generator": {
  "title": "Crea tu diseno con IA",
  "placeholder": "Describe tu diseno...",
  "generate_button": "Generar Imagen",
  "download_button": "Descargar Imagen",
  "generating": "Generando tu diseno...",
  "error": "Error al generar. Intenta de nuevo.",
  "with_background": "Con fondo",
  "without_background": "Sin fondo"
}
```

### Archivo: `en.default.json`

Lo mismo para la version en ingles.

---

## Solucion de Problemas

### El modulo no aparece

1. Verifica que el bloque este agregado en el Theme Editor
2. Asegurate de estar en la pagina de producto correcta
3. Revisa que el tema tenga los archivos necesarios

### "Error al generar"

1. Verifica que la URL del backend sea correcta
2. Revisa que el servidor este funcionando (visita `/api/health`)
3. Puede ser un problema temporal de OpenAI - intenta de nuevo

### La imagen no se muestra sobre el producto

1. El tema debe tener una galeria de imagenes compatible
2. Contacta soporte tecnico si persiste

### El boton de descarga no funciona

1. Intenta en otro navegador
2. Desactiva bloqueadores de descargas
3. La imagen se genera como PNG de alta resolucion

### "Contenido del prompt viola las politicas"

OpenAI rechaza ciertos contenidos. El cliente debe:
- Evitar contenido violento o para adultos
- No incluir nombres de marcas famosas
- No pedir imagenes de personas reales

---

## Contacto de Soporte

Para soporte tecnico o problemas con el modulo:

**Desarrollador:** Victor Alejo
**Email:** [contacto@victalejo.dev]
**Web:** [https://victalejo.dev](https://victalejo.dev)

---

*Documentacion actualizada: Diciembre 2025*
