import SiteContainer from '../layout/SiteContainer.jsx'
import ResponsiveImage from '../media/ResponsiveImage.jsx'

const DISCORD_URL = 'https://discord.gg/ptAbcyeDcf'

/**
 * Same full-bleed `object-fit: cover` geometry as the hero, so narrow viewports
 * again need more than 100vw — but the band is capped at `min(86svh, 44rem)`
 * rather than the hero's full viewport height, so the compensation is smaller.
 */
const CTA_SIZES = '(max-width: 767px) 140vw, (max-width: 1023px) 125vw, 100vw'

function FinalCtaSection() {
  return (
    <section id="join" className="final-cta" aria-labelledby="final-cta-title">
      {/* Far below the fold: stays lazy, stays un-preloaded. */}
      <ResponsiveImage
        name="final-cta"
        className="final-cta__image"
        sizes={CTA_SIZES}
        alt=""
        aria-hidden="true"
        width="1920"
        height="1080"
        loading="lazy"
        decoding="async"
      />
      <div className="final-cta__overlay" aria-hidden="true" />

      <SiteContainer className="final-cta__container">
        <div className="final-cta__identity">
          <p>TASK FORCE 696</p>
          <span className="final-cta__rule" aria-hidden="true" />
          <p>ARMA 3 MILSIM / THAILAND</p>
        </div>

        <div className="final-cta__body">
          <h2 id="final-cta-title" className="final-cta__title">
            <span>READY TO</span>{' '}
            <span>OPERATE?</span>
          </h2>

          <div className="final-cta__action">
            <a
              className="button button--primary final-cta__button"
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              JOIN DISCORD
              <span aria-hidden="true">↗</span>
            </a>
            <p className="final-cta__handle" aria-hidden="true">
              discord.gg/ptAbcyeDcf
            </p>
          </div>
        </div>
      </SiteContainer>
    </section>
  )
}

export default FinalCtaSection
