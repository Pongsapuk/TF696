import SiteContainer from '../layout/SiteContainer.jsx'
import SectionLabel from './SectionLabel.jsx'
import ResponsiveImage from '../media/ResponsiveImage.jsx'

/**
 * The 4:1 banner fills `.element-panel`, which is 100% of the container below
 * 1024px, 92% from 1024px and 88% from 1440px — at most ~1236 CSS px, which is
 * already about the width of the 1200px masters.
 */
const ELEMENT_SIZES =
  '(min-width: 1536px) 1130px, (min-width: 1440px) 88vw, (min-width: 1024px) 92vw, 100vw'

const ELEMENTS = [
  {
    number: '01',
    name: 'LEGION',
    role: 'GROUND / DIRECT ACTION',
    description: 'กำลังหลักภาคพื้นดินและภารกิจปฏิบัติการพิเศษ',
    image: 'legion',
  },
  {
    number: '02',
    name: 'COHORT',
    role: 'AVIATION / AIR SUPPORT',
    description: 'การบิน การสนับสนุนทางอากาศ และการประสานกำลัง',
    image: 'cohort',
  },
  {
    number: '03',
    name: 'FORTIS',
    role: 'TRAINING / RESERVE',
    description: 'การฝึก การเตรียมกำลังพล และการสนับสนุนหน่วย',
    image: 'fortis',
  },
]

function ElementsSection() {
  return (
    <section id="elements" className="elements-section" aria-labelledby="elements-title">
      <SiteContainer>
        <div className="elements-section__heading">
          <SectionLabel number="03" light>
            OUR ELEMENTS
          </SectionLabel>
          <h2 id="elements-title" className="section-title">
            LEGION. COHORT. FORTIS.
          </h2>
        </div>

        <div className="elements-list">
          {ELEMENTS.map((element) => (
            <article className="element-panel" key={element.name}>
              <div className="element-panel__media">
                <ResponsiveImage
                  name={element.image}
                  className="element-panel__image"
                  sizes={ELEMENT_SIZES}
                  alt=""
                  width="1200"
                  height="300"
                  loading="lazy"
                  decoding="async"
                />
                <div className="element-panel__overlay" aria-hidden="true" />
              </div>
              <div className="element-panel__content">
                <p className="element-panel__number" aria-hidden="true">
                  {element.number}
                </p>
                <p className="element-panel__role">{element.role}</p>
                <h3>{element.name}</h3>
                <p className="element-panel__description">{element.description}</p>
              </div>
            </article>
          ))}
        </div>
      </SiteContainer>
    </section>
  )
}

export default ElementsSection
