import SiteContainer from './SiteContainer.jsx'

const FOOTER_LINKS = [
  { label: 'ABOUT', href: '#about' },
  { label: 'OPERATIONS', href: '#operations' },
  { label: 'ELEMENTS', href: '#elements' },
  { label: 'HOW WE OPERATE', href: '#how-we-operate' },
  { label: 'RECRUITMENT', href: '#recruitment' },
]
const DISCORD_URL = 'https://discord.gg/ptAbcyeDcf'

function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <SiteContainer>
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <p className="site-footer__mark">TF696</p>
            <p className="site-footer__name">TASK FORCE 696</p>
            <p className="site-footer__tagline">ARMA 3 MILSIM / THAILAND</p>
          </div>

          <nav className="site-footer__nav" aria-label="เมนูส่วนท้าย">
            {FOOTER_LINKS.map((link) => (
              <a key={link.label} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="site-footer__discord">
            <p className="site-footer__discord-label">COMMUNITY</p>
            <a
              className="site-footer__discord-link"
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              JOIN DISCORD
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p>© {year} TASK FORCE 696</p>
          <p>FRI / SAT / SUN — 20:30 GMT+7</p>
        </div>
      </SiteContainer>
    </footer>
  )
}

export default SiteFooter
