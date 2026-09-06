import SiteFooter from './components/layout/SiteFooter.jsx'
import SiteHeader from './components/layout/SiteHeader.jsx'
import AboutSection from './components/sections/AboutSection.jsx'
import ElementsSection from './components/sections/ElementsSection.jsx'
import FinalCtaSection from './components/sections/FinalCtaSection.jsx'
import HeroSection from './components/sections/HeroSection.jsx'
import HowWeOperateSection from './components/sections/HowWeOperateSection.jsx'
import OperationsSection from './components/sections/OperationsSection.jsx'
import RecruitmentSection from './components/sections/RecruitmentSection.jsx'
import useInitialHashScroll from './hooks/useInitialHashScroll.js'

function App() {
  // A fragment in the URL on a cold load is applied after React has rendered
  // the target; the browser looked for it before this component existed.
  useInitialHashScroll()

  return (
    <>
      <a className="skip-link" href="#main-content">
        ข้ามไปยังเนื้อหาหลัก
      </a>

      <SiteHeader />

      {/* tabIndex="-1" so the skip link moves focus itself. Chrome and Firefox
          also set the sequential focus starting point from the fragment, and
          the link is measured working there without it — but Safari has
          historically needed the attribute, and it adds no tab stop. */}
      <main id="main-content" tabIndex="-1">
        <HeroSection />
        <AboutSection />
        <OperationsSection />
        <ElementsSection />
        <HowWeOperateSection />
        <RecruitmentSection />
        <FinalCtaSection />
      </main>

      <SiteFooter />
    </>
  )
}

export default App
