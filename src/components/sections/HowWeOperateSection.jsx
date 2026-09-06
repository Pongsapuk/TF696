import SiteContainer from '../layout/SiteContainer.jsx'
import SectionLabel from './SectionLabel.jsx'

const PRINCIPLES = [
  {
    title: 'SEMI ROLEPLAY',
    description: (
      <>
        สมจริงเท่าที่ช่วยสร้างประสบการณ์
        <br />
        แต่ไม่บังคับ Roleplay ทุกวินาที
      </>
    ),
  },
  {
    title: 'PLAYER FREEDOM',
    description: (
      <>
        ผู้เล่นมีอิสระในการตัดสินใจ
        <br />
        และเลือกวิธีดำเนินภารกิจ
      </>
    ),
  },
  {
    title: 'CONSEQUENCE',
    description: (
      <>
        การตัดสินใจของทีมสามารถเปลี่ยนผลลัพธ์
        <br />
        และสถานการณ์ของภารกิจ
      </>
    ),
  },
  {
    title: 'TEAMWORK',
    description: (
      <>
        ทุกภารกิจสร้างขึ้นเพื่อการปฏิบัติเป็นทีม
        <br />
        ไม่ใช่การเล่นแบบ Lone Wolf
      </>
    ),
  },
]

function HowWeOperateSection() {
  return (
    <section
      id="how-we-operate"
      className="principles-section"
      aria-labelledby="principles-title"
    >
      <SiteContainer>
        <div className="principles-section__heading">
          <SectionLabel number="04">HOW WE OPERATE</SectionLabel>
          <h2 id="principles-title" className="section-title section-title--dark">
            FREEDOM WITHIN THE TEAM.
          </h2>
        </div>

        <ol className="principles-list">
          {PRINCIPLES.map((principle, index) => (
            <li key={principle.title}>
              <span className="principles-list__number" aria-hidden="true">
                0{index + 1}
              </span>
              <h3>{principle.title}</h3>
              <p>{principle.description}</p>
            </li>
          ))}
        </ol>
      </SiteContainer>
    </section>
  )
}

export default HowWeOperateSection
