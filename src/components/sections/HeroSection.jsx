import SiteContainer from '../layout/SiteContainer.jsx'
import ResponsiveImage from '../media/ResponsiveImage.jsx'
import { HERO_SIZES } from '../../assets/hero-sizes.js'

const DISCORD_URL = 'https://discord.gg/ptAbcyeDcf'

function HeroSection() {
  return (
    <section id="hero" className="hero" aria-labelledby="hero-title">
      {/* LCP element: never lazy, decoded in the critical path, high priority. */}
      <ResponsiveImage
        name="hero"
        className="hero__image"
        sizes={HERO_SIZES}
        alt=""
        aria-hidden="true"
        width="3508"
        height="2400"
        loading="eager"
        decoding="sync"
        fetchPriority="high"
      />
      <div className="hero__overlay" aria-hidden="true" />
      <div className="hero__grain" aria-hidden="true" />

      <SiteContainer className="hero__container">
        <div className="hero__content">
          <div className="hero__eyebrow">
            <span className="hero__eyebrow-rule" aria-hidden="true" />
            <p>ARMA 3 MILSIM / THAILAND</p>
          </div>

          <h1 id="hero-title" className="hero__title">
            <span>TASK FORCE</span>{' '}
            <strong>696</strong>
          </h1>

          <p id="hero-intro" className="hero__copy">
            คอมมูนิตี้ Arma 3 Milsim สำหรับผู้เล่นชาวไทย
            <br className="hero__copy-break" /> ที่เน้นการทำงานเป็นทีม
            อิสระในการตัดสินใจ
            <br className="hero__copy-break" /> และประสบการณ์ภารกิจที่สมจริง
          </p>

          <div className="hero__actions">
            <a
              className="button button--primary"
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              JOIN THE UNIT
              <span aria-hidden="true">↗</span>
            </a>
            <a className="button button--secondary" href="#about">
              DISCOVER TF696
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        <div className="hero__footer" aria-hidden="true">
          <span>TF696</span>
          <span className="hero__rule" />
          <span>SHOWCASE + RECRUITMENT</span>
        </div>
      </SiteContainer>
    </section>
  )
}

export default HeroSection
