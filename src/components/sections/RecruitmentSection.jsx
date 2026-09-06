import SiteContainer from '../layout/SiteContainer.jsx'
import SectionLabel from './SectionLabel.jsx'

const REQUIREMENTS = [
  {
    name: 'AGE',
    status: '18+',
    tone: 'required',
    note: 'ต่ำกว่า 18 ปี พิจารณาเป็นรายกรณี',
  },
  {
    name: 'MICROPHONE',
    status: 'REQUIRED',
    tone: 'required',
    note: 'จำเป็นสำหรับการสื่อสารภายในทีม',
  },
  {
    name: 'SKILL ASSESSMENT',
    status: 'REQUIRED',
    tone: 'required',
    note: 'ต้องผ่านการประเมินทักษะพื้นฐานก่อน',
  },
  {
    name: 'TRAINING',
    status: 'REQUIRED',
    tone: 'required',
    note: 'ต้องผ่านการฝึกก่อนเข้าร่วม Operation',
  },
  {
    name: 'MODPACK',
    status: 'REQUIRED',
    tone: 'required',
    note: 'ใช้ Modpack ของ TF696',
  },
  {
    name: 'APEX DLC',
    status: 'RECOMMENDED',
    tone: 'optional',
    note: 'มี Apex ได้ก็ดี แต่ไม่บังคับ',
  },
  {
    name: 'ATTENDANCE',
    status: 'FLEXIBLE',
    tone: 'optional',
    note: 'เข้าร่วมตามเวลาที่สะดวก',
  },
]

const OPERATION_DAYS = ['FRIDAY', 'SATURDAY', 'SUNDAY']

const ONBOARDING = [
  { title: 'JOIN DISCORD', note: 'เริ่มต้นที่ Discord ของ TF696' },
  { title: 'SKILL ASSESSMENT', note: 'ประเมินทักษะพื้นฐาน' },
  { title: 'TRAINING', note: 'ผ่านการฝึกกับหน่วย' },
  { title: 'JOIN OPERATIONS', note: 'เข้าร่วมภารกิจหลัก' },
]

function RecruitmentSection() {
  return (
    <section
      id="recruitment"
      className="recruitment-section"
      aria-labelledby="recruitment-title"
    >
      <SiteContainer>
        <div className="recruitment-section__heading">
          <SectionLabel number="05" light>
            RECRUITMENT
          </SectionLabel>

          <h2 id="recruitment-title" className="section-title recruitment-section__title">
            <span>READY TO JOIN</span>{' '}
            <span>THE UNIT?</span>
          </h2>

          <div className="recruitment-section__copy">
            <p>
              TF696 เปิดรับผู้เล่นที่พร้อมทำงานเป็นทีม เรียนรู้ระบบการเล่น
              และผ่านการประเมินกับการฝึกก่อนเข้าร่วมภารกิจหลัก
            </p>
            <span className="recruitment-section__copy-rule" aria-hidden="true" />
          </div>
        </div>

        <div className="requirements">
          <div className="requirements__intro">
            <h3>REQUIREMENTS</h3>
            <p>ข้อกำหนดพื้นฐานก่อนเข้าร่วมหน่วย</p>
          </div>

          <ol className="requirements__list">
            {REQUIREMENTS.map((requirement, index) => (
              <li className="requirement-row" key={requirement.name}>
                <span className="requirement-row__index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="requirement-row__name">{requirement.name}</span>
                <span
                  className={`requirement-row__status requirement-row__status--${requirement.tone}`}
                >
                  {requirement.status}
                </span>
                <span className="requirement-row__note">{requirement.note}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="schedule">
          <div className="schedule__lead">
            <h3>
              <span>OPERATION</span>{' '}
              <span>SCHEDULE</span>
            </h3>
            <p>ตารางเวลาปฏิบัติการประจำสัปดาห์</p>
          </div>

          <ul className="schedule__days">
            {OPERATION_DAYS.map((day) => (
              <li key={day}>{day}</li>
            ))}
          </ul>

          <p className="schedule__time">
            <span className="schedule__time-value">20:30</span>{' '}
            <span className="schedule__time-zone">GMT+7</span>
          </p>
        </div>

        <div className="onboarding">
          <div className="onboarding__intro">
            <h3>HOW TO JOIN</h3>
            <p>ไม่มีแบบฟอร์มสมัครบนเว็บไซต์ — จุดเริ่มต้นคือ Discord</p>
          </div>

          <ol className="onboarding__steps">
            {ONBOARDING.map((step, index) => (
              <li key={step.title}>
                <span className="onboarding__number" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="onboarding__title">{step.title}</span>
                <span className="onboarding__note">{step.note}</span>
              </li>
            ))}
          </ol>
        </div>
      </SiteContainer>
    </section>
  )
}

export default RecruitmentSection
