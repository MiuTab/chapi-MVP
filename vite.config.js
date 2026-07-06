import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {
  WHATSAPP_NUMBER,
  RATING_VALUE,
  REVIEW_COUNT,
  INSTAGRAM_URL,
  MAPS_DIRECTIONS_URL,
  ADDRESS_STREET,
  SITE_URL,
} from './src/constants.js'
import { hours } from './src/data/info.js'

// Mapea las franjas de src/data/info.js a schema.org DayOfWeek. Solo cubre los
// 2 grupos de días laborables — "Domingos" (cerrado) y "Festivos" (no es un
// día de la semana, schema.org no tiene un tipo limpio para feriados) se
// omiten a propósito del JSON-LD en vez de forzar datos incorrectos.
const DAY_GROUPS = {
  'Lunes a jueves': ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
  'Viernes y sábado': ['Friday', 'Saturday'],
}

function to24h(time) {
  const match = time.match(/(\d+):(\d+)\s*(am|pm)/i)
  if (!match) return null
  let hour = parseInt(match[1], 10)
  const minute = match[2]
  const meridian = match[3].toLowerCase()
  if (meridian === 'pm' && hour !== 12) hour += 12
  if (meridian === 'am' && hour === 12) hour = 0
  return `${String(hour).padStart(2, '0')}:${minute}`
}

function buildOpeningHours() {
  return hours
    .filter((slot) => DAY_GROUPS[slot.day] && slot.time.toLowerCase() !== 'cerrado')
    .map((slot) => {
      const [opensRaw, closesRaw] = slot.time.split('–').map((s) => s.trim())
      return {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: DAY_GROUPS[slot.day],
        opens: to24h(opensRaw),
        closes: to24h(closesRaw),
      }
    })
}

function buildJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'ChapiYork',
    servesCuisine: ['Vegana', 'Colombiana'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: ADDRESS_STREET,
      addressLocality: 'Bogotá',
      addressCountry: 'CO',
    },
    telephone: `+${WHATSAPP_NUMBER}`,
    url: SITE_URL,
    priceRange: '$$',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: RATING_VALUE,
      reviewCount: REVIEW_COUNT,
    },
    openingHoursSpecification: buildOpeningHours(),
    sameAs: [INSTAGRAM_URL, MAPS_DIRECTIONS_URL],
  }
  return JSON.stringify(data)
}

// Inyecta el JSON-LD y el dominio del sitio en index.html en build/dev,
// leyendo siempre desde src/constants.js y src/data/info.js — así esos dos
// archivos son la única fuente de verdad para el rating y los horarios
// (nunca hay que editar el HTML a mano si cambian).
function seoDataPlugin() {
  return {
    name: 'chapiyork-seo-data',
    transformIndexHtml(html) {
      // Reemplazo vía función: si se pasa el string directo, `.replace()`
      // interpreta patrones especiales como `$$` dentro del reemplazo
      // (rompía priceRange: "$$" → "$"). Con función no hay ese problema.
      return html
        .replace('__JSONLD_SCHEMA__', () => buildJsonLd())
        .replaceAll('__SITE_URL__', () => SITE_URL)
    },
  }
}

export default defineConfig({
  base: '/chapi-MVP/',
  plugins: [react(), seoDataPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
