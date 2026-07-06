import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { WHATSAPP_URL, INSTAGRAM_URL } from '../constants.js'
import { IconWhatsapp, IconInstagram } from './icons.jsx'
import { track } from '../utils/track.js'

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/menu', label: 'Menú' },
]

function Header() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="header">
      <div className={`container header-inner ${isScrolled ? 'is-scrolled' : ''}`}>
        <div className="header-left">
          <Link to="/" className="header-brand">
            <img
              src={`${import.meta.env.BASE_URL}logo-transparent.png`}
              alt="Logo de ChapiYork"
              className="header-logo"
            />
          </Link>

          <nav className="header-nav" aria-label="Navegación principal">
            <ul>
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={pathname === link.to ? 'is-active' : ''}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="header-cta">
          <a
            className="btn btn-brutal btn-instagram header-cta-instagram"
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconInstagram className="header-cta-icon" />
            <span className="header-cta-label">Instagram</span>
          </a>
          <a
            className="btn btn-brutal btn-whatsapp"
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('whatsapp_click', { location: 'header' })}
          >
            <IconWhatsapp className="header-cta-icon" />
            <span className="header-cta-label">WhatsApp</span>
          </a>

          <button
            type="button"
            className={`header-menu-toggle ${menuOpen ? 'is-open' : ''}`}
            aria-expanded={menuOpen}
            aria-controls="header-mobile-menu"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="header-menu-toggle-bar" />
            <span className="header-menu-toggle-bar" />
            <span className="header-menu-toggle-bar" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="header-mobile-menu" id="header-mobile-menu">
          <nav aria-label="Navegación móvil">
            <ul>
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={pathname === link.to ? 'is-active' : ''}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <a className="btn btn-brutal btn-instagram" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
            <IconInstagram className="header-cta-icon" />
            <span className="header-cta-label">Instagram</span>
          </a>
        </div>
      )}
    </header>
  )
}

export default Header
