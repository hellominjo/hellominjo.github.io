import type {
  QuartzComponent,
  QuartzComponentConstructor,
} from "./types"

// 왼쪽 메뉴 Explorer 아래 외부 Lab 링크
const labs = [
  { title: "HR Analytics", href: "https://hellominjo.net/hr-analytics" },
  { title: "ML Programming", href: "https://hellominjo.net/ml-programming" },
  { title: "AI Playground", href: "https://hellominjo.net/ai-playground" },
  { title: "EDU Studio", href: "https://hellominjo.net/edu-studio" },
]

const LabLinks: QuartzComponent = () => {
  return (
    <nav class="lab-links" aria-label="Explore Labs">
      <h2 class="lab-links__title">Explore Labs</h2>
      <ul class="lab-links__list">
        {labs.map((lab) => (
          <li>
            <a
              href={lab.href}
              class="lab-links__item"
              target="_blank"
              rel="noopener noreferrer"
              data-no-popover="true"
            >
              {lab.title}
              <span aria-hidden="true">↗</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default (() => LabLinks) satisfies QuartzComponentConstructor
