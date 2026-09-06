import SiteContainer from '../layout/SiteContainer.jsx'
import SectionLabel from './SectionLabel.jsx'

const DETAILS = [
  'ARMA 3 MILSIM',
  'THAI COMMUNITY',
  'SEMI ROLEPLAY',
  'TIER 1 / TIER 2 INSPIRED',
]

function AboutSection() {
  return (
    <section id="about" className="about-section" aria-labelledby="about-title">
      <SiteContainer>
        <SectionLabel number="01">WHO WE ARE</SectionLabel>

        <div className="about-section__intro">
          <h2 id="about-title" className="section-title section-title--dark about-section__title">
            <span>TACTICAL FREEDOM.</span>{' '}
            <span>MISSION CONSEQUENCES.</span>
          </h2>

          <div className="about-section__copy">
            <p>
              TF696 คือคอมมูนิตี้ Arma 3 Milsim สำหรับผู้เล่นชาวไทย
              ที่เน้นการทำงานเป็นทีม การวางแผน และอิสระในการตัดสินใจ
              โดยทุกการกระทำสามารถส่งผลต่อทิศทางของภารกิจได้
            </p>
            <span className="about-section__copy-rule" aria-hidden="true" />
          </div>
        </div>

        <ol className="about-details" aria-label="ข้อมูลเกี่ยวกับ TF696">
          {DETAILS.map((detail, index) => (
            <li key={detail}>
              <span className="about-details__number">0{index + 1}</span>
              <span>{detail}</span>
            </li>
          ))}
        </ol>
      </SiteContainer>
    </section>
  )
}

export default AboutSection
