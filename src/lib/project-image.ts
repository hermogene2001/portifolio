export function projectImage(index: number) {
  return `/project-${(index % 5) + 1}.svg`
}
