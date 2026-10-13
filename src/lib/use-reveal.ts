import { useEffect } from "react"

// Reveals elements carrying a `data-reveal` attribute by adding `.is-visible`
// once they scroll into view. Re-runs whenever `deps` change (e.g. filters).
export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>(".site-theme [data-reveal]")
    )
    if (!("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-visible"))
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, deps)
}
