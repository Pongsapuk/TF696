function SectionLabel({ number, children, light = false }) {
  return (
    <p className={`section-label ${light ? 'section-label--light' : ''}`}>
      <span>{number}</span>
      <span aria-hidden="true">/</span>
      {children}
    </p>
  )
}

export default SectionLabel
