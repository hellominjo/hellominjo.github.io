import script from "./scripts/labLinks.inline"
import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "./types"
import { FullSlug, resolveRelative } from "../util/path"

// 왼쪽 메뉴 Explorer 아래 외부 Lab 링크
const labs = [
  { title: "HR Analytics", href: "https://hellominjo.github.io/hr-analytics-lab" },
  { title: "ML Programming", href: "https://hellominjo.github.io/ml-programming-lab" },
  { title: "AI Playground", href: "https://hellominjo.github.io/ai-playground/"},
  { title: "EDU Studio", href: "https://hellominjo.github.io/edu-studio" },
]

const LabLinks: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const home = resolveRelative(fileData.slug!, "index" as FullSlug)

  return (
    <>
    {/* 헤더 주 메뉴가 숨겨지는 모바일(≤800px)에서만 표시 — LabHeader.tsx와 동일한 링크 */}
    <nav class="lab-drawer-nav" aria-label="주 메뉴">
      <a href={home} class="internal" data-no-popover="true">Home</a>
      <a href="/articles" class="internal" data-no-popover="true">Articles</a>
      <a href="/tags" class="internal" data-no-popover="true">Tags</a>
      <a href="/about" class="internal" data-no-popover="true">About</a>
    </nav>
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
    </>
  )
}

LabLinks.afterDOMLoaded = script

export default (() => LabLinks) satisfies QuartzComponentConstructor
