import script from "./scripts/labLinks.inline"
import type {
  QuartzComponent,
  QuartzComponentConstructor,
} from "./types"

// 왼쪽 메뉴 Explorer 아래 외부 Lab 링크
const labs = [
  { title: "HR Analytics", href: "https://hellominjo.github.io/hr-analytics-lab" },
  { title: "ML Programming", href: "https://hellominjo.github.io/ml-programming-lab" },
  { title: "AI Playground", href: "https://hellominjo.github.io/ai-playground/"},
  { title: "EDU Studio", href: "https://hellominjo.github.io/edu-studio" },
]

const LabLinks: QuartzComponent = () => {
  return (
    <nav class="lab-links" aria-label="Explore Labs">
      <h2 class="lab-links__title">Explore Labs</h2>
      {/* 모바일 전용 드롭다운 선택 상자 */}
      <button
        type="button"
        class="lab-links__toggle"
        aria-expanded="false"
        aria-controls="lab-links-list"
      >
        <span>Explore Labs</span>
        <svg class="lab-links__chevron" aria-hidden="true" width="10" height="10" viewBox="0 0 10 10">
          <path d="M0 2.5h10L5 8z" fill="currentColor" />
        </svg>
      </button>
      <ul class="lab-links__list" id="lab-links-list">
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

LabLinks.afterDOMLoaded = script

export default (() => LabLinks) satisfies QuartzComponentConstructor
