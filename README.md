# ChapiYork — Landing page

Landing de una sola página para ChapiYork, restaurante de comida rápida 100% vegana en Quinta Camacho, Bogotá. MVP de demo construido con Vite + React y CSS propio (sin librerías de UI).

## Desarrollo local

```bash
npm install
npm run dev
```

## Build de producción

```bash
npm run build
```

Los archivos generados quedan en `dist/`.

## Deploy en Vercel

1. Sube este repo a GitHub.
2. En [vercel.com](https://vercel.com), importa el repositorio. Vercel detecta automáticamente que es un proyecto Vite (build command `npm run build`, output `dist`) — no requiere configuración adicional.
3. Deploy.

Alternativa por CLI:

```bash
npm i -g vercel
vercel --prod
```

## Assets reales ya integrados

- `public/logo.jpg`: logo real de ChapiYork (header, footer, favicon, og:image).
- `public/hero-media.mp4` (variante desktop) + `public/hero-media-mobile.mp4` (variante mobile) + `public/hero-media-poster.jpg`: video real "Picada Mundialista Vegana x ChapiYork" usado en el hero interactivo. El archivo original (97s, 640px, 11.7MB) se recortó a un loop de 10s y se generaron 2 variantes livianas — el `<video>` en `ScrollExpandMedia.jsx` sirve la mobile vía `<source media="(max-width: 767px)">` y la desktop como fallback:

  ```bash
  # Desktop (~720px de ancho, ~2.1MB)
  ffmpeg -i original.mp4 -t 10 -an -vf "scale=720:-2,fps=24" \
    -c:v libx264 -preset slow -crf 26 -movflags +faststart -pix_fmt yuv420p hero-media.mp4

  # Mobile (~480px de ancho, ~0.7MB)
  ffmpeg -i original.mp4 -t 10 -an -vf "scale=480:-2,fps=24" \
    -c:v libx264 -preset slow -crf 30 -movflags +faststart -pix_fmt yuv420p hero-media-mobile.mp4

  # Poster (primer frame de la variante desktop)
  ffmpeg -i hero-media.mp4 -vframes 1 -q:v 3 hero-media-poster.jpg
  ```

  Si el dueño sube un video de reemplazo, volver a correr estos 3 comandos con el archivo nuevo como `original.mp4` (ajustar `-t` si el clip fuente es más corto que 10s).
- `public/og-image.jpg` (1200×630), `public/favicon.ico` y `public/apple-touch-icon.png` (180×180): generados a partir de `logo.jpg` (fondo naranja `#D9863A` + logo centrado para el og-image). Son placeholders razonables para la demo — reemplazar `og-image.jpg` por arte real antes de publicar (ver "Pre-lanzamiento").

## Estructura de rutas

- `/` — landing: hero, 3 platos destacados (con efecto spotlight que sigue el cursor), Nosotros, reseñas (carrusel marquee) y ubicación.
- `/menu` — carta completa, con nav de categorías sticky y tarjetas por plato. Toda la data vive en `src/data/menu.js`, cuya fuente editable es `menu-chapiyork.md` en la raíz del repo (actualizar ahí primero).
- Cualquier ruta no reconocida redirige a `/`.

## SEO técnico

- **Metadatos** (`index.html`): title, meta description, Open Graph completo (incluye `og:image` apuntando a `/og-image.jpg`), Twitter Card `summary_large_image` y `<link rel="canonical">`.
- **JSON-LD (`schema.org/Restaurant`)**: no está hardcodeado en `index.html` — se genera en build/dev desde `src/constants.js` (rating, teléfono, dirección, Instagram, Maps) y `src/data/info.js` (horarios), inyectado vía un plugin de Vite (`seoDataPlugin` en `vite.config.js`) que reemplaza los tokens `__JSONLD_SCHEMA__` y `__SITE_URL__` en el HTML. **Si cambian el rating, el teléfono, la dirección o los horarios, solo hay que editar `constants.js`/`info.js` — el JSON-LD se regenera solo, no hay que tocar el HTML.**
  - Excepción documentada: el bloque `openingHoursSpecification` solo cubre "Lunes a jueves" y "Viernes y sábado" (mapeados a `DayOfWeek` de schema.org). "Domingos" (cerrado) se omite a propósito, y "Festivos" no se incluye porque schema.org no tiene un tipo limpio para feriados recurrentes — forzarlo habría sido un dato incorrecto.
- **`public/robots.txt`** y **`public/sitemap.xml`**: son archivos estáticos, **no** se generan desde `constants.js`. Si cambia `SITE_URL`, hay que actualizar el dominio a mano en esos dos archivos también.
- **Dominio placeholder:** todo (canonical, og:url, JSON-LD `url`/`sameAs`, robots.txt, sitemap.xml) usa `https://chapiyork.com` como marcador de posición — reemplazar por el dominio real una vez comprado (`SITE_URL` en `src/constants.js` cubre la mayoría; robots.txt/sitemap.xml se editan aparte).

## Rendimiento

- Video del hero: `preload="metadata"`, `muted`, `playsinline`, poster estático instantáneo, variantes por viewport (ver arriba), y fallback automático a solo-imagen si el video falla (`onError`) o si `navigator.connection` reporta `saveData` o `effectiveType` 2g/3g.
- `loading="lazy"` en las imágenes reales bajo el fold (logo del footer). El logo del header y el video/imagen del hero quedan eager a propósito. Los 3 platos destacados y las tarjetas de `/menu` todavía no tienen fotos reales (ver placeholders pendientes) — cuando se agreguen, las 3 destacadas de la landing deben quedar `eager` y el resto `loading="lazy"`.
- Bundle JS: ~342KB sin comprimir / **~112KB gzip** (bien debajo del límite de 300KB gzip) — no fue necesario aplicar code-splitting por ruta.

## Medición

- `@vercel/analytics` instalado y montado (`<Analytics />` en `src/main.jsx`). Solo reporta datos reales una vez desplegado en Vercel.
- `src/utils/track.js` expone `track(eventName, props)`. Eventos instrumentados:
  - `whatsapp_click` con `{ location: 'header' | 'hero' | 'ubicacion' | 'flotante' | 'menu' }` en los 5 puntos de contacto por WhatsApp.
  - `menu_view` al montar la ruta `/menu`.
  - `como_llegar_click` en el botón "Cómo llegar" (Google Maps) de Ubicación.

## Placeholders pendientes

- Los 3 platos destacados en `src/data/menu.js` (`featuredDishes`: Changua "El Dorado", Chapiyorker, Trilogía de Fritos) tienen un recuadro con el texto "Foto próximamente" — reemplazar `menu-card-image-placeholder` por una `<img loading="eager">` con la foto real de cada plato. El resto del menú (`/menu`) se muestra solo en texto.
- **Pendiente de confirmar con el dueño:** varios platos del menú real llevan ícono de "sin gluten" en Instagram (empanada, carimañola, arepas, pan de yuca, trilogía, patacón, alitas chipotle). El campo `glutenFree` en `src/data/menu.js` está en `false` para todos — verificar con el dueño antes de activarlo por plato.
- **Pendiente de confirmar con el dueño:** los horarios en `src/data/info.js` (`hours`) son un estimado — confirmar antes de publicar el sitio (recuerda que también alimentan el JSON-LD, ver "SEO técnico").
- `og-image.jpg` es un placeholder (fondo de color + logo) — reemplazar por una foto/arte real antes de lanzar.

## Pre-lanzamiento

Lo que queda por hacer manualmente, fuera del código:

- [ ] Comprar el dominio real y reemplazar `SITE_URL` en `src/constants.js` + el dominio hardcodeado en `public/robots.txt` y `public/sitemap.xml`.
- [ ] Conectar el repo a Vercel (o el dominio comprado al proyecto ya desplegado).
- [ ] Registrar el sitio en Google Search Console y enviar `sitemap.xml`.
- [ ] Vincular la web en el perfil de Google Business del cliente.
- [ ] Reemplazar `public/og-image.jpg` (placeholder) por una pieza gráfica real.
- [ ] Confirmar con el dueño: horarios (`src/data/info.js`), platos sin gluten (`src/data/menu.js`) y subir las 3 fotos de platos destacados.
# chapi-MVP
