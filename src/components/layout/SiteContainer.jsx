function SiteContainer({ children, className = '' }) {
  return (
    <div
      className={`mx-auto w-full max-w-[88rem] px-5 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 ${className}`}
    >
      {children}
    </div>
  )
}

export default SiteContainer
