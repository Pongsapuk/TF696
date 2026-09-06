import SiteContainer from '../layout/SiteContainer.jsx'
import SectionLabel from './SectionLabel.jsx'
import ResponsiveImage from '../media/ResponsiveImage.jsx'

const OPERATIONS = [
  {
    number: '01',
    title: 'DIRECT ACTION',
    label: 'CQB / ASSAULT / SPECIAL OPERATIONS',
    description:
      'ภารกิจใน Arma 3 ที่ต้องอาศัยการวางแผน การสื่อสาร และการเคลื่อนที่ร่วมกันของทั้งทีม',
    image: 'direct-action',
    alt: 'ทีมผู้เล่น TF696 ในภารกิจกลางคืนข้างลังอุปกรณ์ภายในเกม Arma 3',
    className: 'operation-story--wide',
    // .operation-story--wide is 100% of the container below 768px, 91% from
    // 768px and 88% from 1440px; the container caps at 1408px with 64px
    // gutters, so the widest it is ever painted is ~1126 CSS px.
    sizes: '(min-width: 1536px) 1130px, (min-width: 1440px) 88vw, (min-width: 768px) 91vw, 100vw',
  },
  {
    number: '02',
    title: 'AVIATION / FIRE SUPPORT',
    label: 'COORDINATED SUPPORT',
    description:
      'การแทรกซึม การสนับสนุน และการประสานกำลังที่เชื่อมทุกองค์ประกอบของภารกิจเข้าด้วยกัน',
    image: 'aviation',
    alt: 'ทีมผู้เล่น TF696 เตรียมพร้อมภายในอากาศยานระหว่างภารกิจในเกม Arma 3',
    className: 'operation-story--offset',
    // .operation-story--offset is the narrower of the pair: 78% from 768px and
    // 72% from 1440px, so it tops out at ~922 CSS px.
    sizes: '(min-width: 1536px) 925px, (min-width: 1440px) 72vw, (min-width: 768px) 78vw, 100vw',
  },
]

function OperationsSection() {
  return (
    <section
      id="operations"
      className="operations-section"
      aria-labelledby="operations-title"
    >
      <SiteContainer>
        <div className="operations-section__heading">
          <SectionLabel number="02" light>
            OPERATIONS
          </SectionLabel>
          <h2 id="operations-title" className="section-title">
            <span>MISSION DRIVEN.</span>{' '}
            <span>PLAYER DECIDED.</span>
          </h2>
          <p className="operations-section__context">
            ภาพบรรยากาศจากการเล่น Arma 3 Milsim ของ TF696
          </p>
        </div>

        <div className="operations-list">
          {OPERATIONS.map((operation) => (
            <figure
              className={`operation-story ${operation.className}`}
              key={operation.title}
            >
              <div className="operation-story__media">
                <ResponsiveImage
                  name={operation.image}
                  sizes={operation.sizes}
                  alt={operation.alt}
                  width="1920"
                  height="1080"
                  loading="lazy"
                  decoding="async"
                />
                <span className="operation-story__marker" aria-hidden="true">
                  {operation.number}
                </span>
              </div>
              <figcaption className="operation-story__caption">
                <div>
                  <p className="operation-story__label">{operation.label}</p>
                  <h3>{operation.title}</h3>
                </div>
                <p>{operation.description}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </SiteContainer>
    </section>
  )
}

export default OperationsSection
