import type { ReactNode } from "react"

export function PageHero({
  kicker,
  title,
  description,
}: {
  kicker: string
  title: ReactNode
  description?: ReactNode
}) {
  return (
    <section className="page-hero">
      <div className="hero-shape hero-shape-1" aria-hidden="true" />
      <div className="hero-shape hero-shape-2" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-6xl px-4">
        <div data-reveal>
          <span className="section-kicker">{kicker}</span>
          <h1 className="page-title">{title}</h1>
          {description ? <p className="page-subtitle">{description}</p> : null}
        </div>
      </div>
    </section>
  )
}
