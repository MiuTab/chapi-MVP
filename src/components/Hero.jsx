import ScrollExpandMedia from './ScrollExpandMedia.jsx'
import { IconStar } from './icons.jsx'
import { WHATSAPP_URL, RATING_TEXT } from '../constants.js'
import { track } from '../utils/track.js'
import heroVideo from '@/assets/video/hero.mp4'
import heroVideoMobile from '@/assets/video/hero-mobile.mp4'
import heroPoster from '@/assets/video/hero-poster.jpg'

function Hero() {
  return (
    <section id="top" className="hero-section">
      <ScrollExpandMedia
        mediaType="video"
        mediaSrc={heroVideo}
        mediaSrcMobile={heroVideoMobile}
        posterSrc={heroPoster}
        title="Comida colombiana"
        tagline="100% vegana · 0% aburrida"
        splitIndex={1}
        date="QUINTA CAMACHO · BOGOTÁ"
        scrollToExpand="Desliza para descubrir ↓"
        decorationSrc={`${import.meta.env.BASE_URL}logo-transparent.png`}
      >
        <div className="hero-reveal">
          <span className="hero-tagline">Plant Based Fast Food</span>

          <p className="hero-reveal-text">
            Nuestra <strong>Changua "El Dorado"</strong> ganó el concurso a la Mejor Changua de
            Bogotá. Sabor de barrio, receta de siempre, cero ingredientes de origen animal.
          </p>

          <div className="hero-rating">
            <div className="hero-rating-stars" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <IconStar key={i} className="hero-rating-star" />
              ))}
            </div>
            <span>{RATING_TEXT}</span>
          </div>

          <div className="hero-actions">
            <a
              className="btn btn-brutal btn-cta"
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('whatsapp_click', { location: 'hero' })}
            >
              Pide por WhatsApp
            </a>
            <a className="btn btn-brutal btn-ghost" href="#menu">
              Ver el menú
            </a>
          </div>
        </div>
      </ScrollExpandMedia>
    </section>
  )
}

export default Hero
