import { useEffect, useRef, useState } from 'react'
import { menuCategories } from '../data/menu.js'
import { IconLeaf } from '../components/icons.jsx'
import { WHATSAPP_URL } from '../constants.js'
import { track } from '../utils/track.js'
import usePageTitle from '../hooks/usePageTitle.js'

function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, visible]
}

function MenuItemCard({ item, index }) {
  const [ref, visible] = useReveal()

  return (
    <article
      ref={ref}
      className={`menu-page-card ${visible ? 'is-visible' : ''}`}
      style={{ transitionDelay: `${(index % 6) * 60}ms` }}
    >
      <div className="menu-page-card-head">
        <h4 className="menu-page-card-name">{item.name}</h4>
        <span className="menu-page-card-price">${item.price}</span>
      </div>
      {item.desc && <p className="menu-page-card-desc">{item.desc}</p>}
      {item.glutenFree && <span className="menu-page-badge-gf">Sin gluten</span>}
    </article>
  )
}

function scrollToSection(event, slug) {
  event.preventDefault()
  document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function CategoryNav({ categories }) {
  return (
    <nav className="menu-category-nav" aria-label="Categorías del menú">
      <div className="container menu-category-nav-inner">
        {categories.map((category) => (
          <a
            key={category.slug}
            href={`#${category.slug}`}
            className="menu-category-chip"
            onClick={(event) => scrollToSection(event, category.slug)}
          >
            {category.title}
          </a>
        ))}
      </div>
    </nav>
  )
}

function MenuPage() {
  usePageTitle('ChapiYork · Menú')

  useEffect(() => {
    track('menu_view')
  }, [])

  return (
    <>
      <section className="menu-page-hero">
        <div className="container menu-page-hero-inner">
          <span className="eyebrow-tag">
            <IconLeaf className="eyebrow-tag-icon" />
            100% vegano
          </span>
          <h1 className="menu-page-title">Nuestro menú</h1>
          <p className="menu-page-tagline">
            Toda la carta de ChapiYork: clásicos colombianos reinventados, sin ingredientes de origen
            animal.
          </p>
          <a
            className="btn btn-brutal btn-cta"
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('whatsapp_click', { location: 'menu' })}
          >
            Pide por WhatsApp
          </a>
        </div>
      </section>

      <CategoryNav categories={menuCategories} />

      <section className="section menu-page-body">
        <div className="container">
          {menuCategories.map((category) => (
            <div className="menu-page-category" id={category.slug} key={category.slug}>
              <h2 className="menu-page-category-title">{category.title}</h2>

              <div className="menu-page-grid">
                {category.items.map((item, index) => (
                  <MenuItemCard item={item} index={index} key={item.name} />
                ))}
              </div>

              {category.extra && (
                <div className="menu-subgroup">
                  <span className="menu-subgroup-title">{category.extra.label}</span>
                  {category.extra.items.map((item) => (
                    <div className="menu-subgroup-item" key={item.name}>
                      <span>{item.name}</span>
                      <span>${item.price}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <p className="menu-footnote">Menú y precios sujetos a cambio.</p>
        </div>
      </section>
    </>
  )
}

export default MenuPage
