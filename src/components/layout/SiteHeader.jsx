import { useEffect, useRef, useState } from 'react'
import SiteContainer from './SiteContainer.jsx'
import ResponsiveImage from '../media/ResponsiveImage.jsx'

const NAV_ITEMS = [
  { label: 'ABOUT', href: '#about' },
  { label: 'OPERATIONS', href: '#operations' },
  { label: 'ELEMENTS', href: '#elements' },
  { label: 'RECRUITMENT', href: '#recruitment' },
]
const DISCORD_URL = 'https://discord.gg/ptAbcyeDcf'

/**
 * `.brand__mark` is painted at 3.25rem wide, 3.65rem from 768px — 52 and 58.4
 * CSS px. The 64/128/192/256 ladder covers 1x through 4x without the navbar
 * ever pulling the 1 MB, 3508px master.
 */
const LOGO_SIZES = '(min-width: 768px) 59px, 52px'

function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const menuButtonRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!isMenuOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusableElements = menuRef.current?.querySelectorAll(
      'button:not([disabled]), a[href]',
    )

    focusableElements?.[0]?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
        menuButtonRef.current?.focus()
        return
      }

      if (event.key !== 'Tab' || !focusableElements?.length) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', handleResize)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleResize)
    }
  }, [isMenuOpen])

  return (
    <header
      className={`site-header ${isScrolled || isMenuOpen ? 'site-header--active' : ''}`}
    >
      <SiteContainer className="site-header__inner">
        <a className="brand" href="#hero" aria-label="TF696 — กลับไปยังส่วนแรก">
          <ResponsiveImage
            name="logo"
            className="brand__mark"
            sizes={LOGO_SIZES}
            alt=""
            width="3508"
            height="2480"
            loading="eager"
            fetchPriority="low"
          />
          <span className="brand__name">TF696</span>
        </a>

        <nav className="desktop-nav" aria-label="เมนูหลัก">
          {NAV_ITEMS.map((item) => (
            <a className="nav-link" href={item.href} key={item.label}>
              {item.label}
            </a>
          ))}
          <a
            className="header-cta"
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            JOIN DISCORD
            <span aria-hidden="true">↗</span>
          </a>
        </nav>

        <button
          className="menu-trigger"
          ref={menuButtonRef}
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={isMenuOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span className="menu-trigger__label">MENU</span>
          <span className={`menu-trigger__icon ${isMenuOpen ? 'is-open' : ''}`} aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </SiteContainer>

      <div
        id="mobile-navigation"
        className={`mobile-menu ${isMenuOpen ? 'is-open' : ''}`}
        aria-hidden={!isMenuOpen}
        ref={menuRef}
      >
        <SiteContainer className="mobile-menu__inner">
          <nav className="mobile-nav" aria-label="เมนูสำหรับมือถือ">
            {NAV_ITEMS.map((item, index) => (
              <a
                className="mobile-nav__link"
                href={item.href}
                key={item.label}
                tabIndex={isMenuOpen ? 0 : -1}
                onClick={() => setIsMenuOpen(false)}
              >
                {/* The spaces keep the link's text run from concatenating into
                    "01ABOUTVIEW SECTION" — the same one-character fix Phase 5
                    applied to the headings. They are whitespace between grid
                    items, so they generate no box and nothing moves. */}
                <span aria-hidden="true">0{index + 1}</span>{' '}
                {item.label}{' '}
                <small>VIEW SECTION</small>
              </a>
            ))}
          </nav>

          <a
            className="mobile-menu__cta"
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={isMenuOpen ? 0 : -1}
            onClick={() => setIsMenuOpen(false)}
          >
            JOIN DISCORD
            <span aria-hidden="true">↗</span>
          </a>

          <p className="mobile-menu__note">ARMA 3 MILSIM / THAILAND</p>
        </SiteContainer>
      </div>
    </header>
  )
}

export default SiteHeader
