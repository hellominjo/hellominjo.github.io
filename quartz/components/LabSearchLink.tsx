import script from "./scripts/labSearch.inline"
import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "./types"
import { resolveRelative, FullSlug } from "../util/path"
import { i18n } from "../i18n"

// drawer 검색창: Enter 시 /articles?q=검색어 로 이동 → Articles 상단 검색에서 결과 표시
const LabSearchLink: QuartzComponent = ({ cfg, fileData }: QuartzComponentProps) => {
  const articlesHref = resolveRelative(fileData.slug!, "articles" as FullSlug)

  return (
    <form class="lab-search-link" action={articlesHref} method="get" role="search">
      <svg
        class="lab-search-link__icon"
        aria-hidden="true"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      >
        <circle cx="11" cy="11" r="7" />
        <line x1="20" y1="20" x2="16" y2="16" />
      </svg>
      <input
        type="search"
        name="q"
        placeholder={i18n(cfg.locale).components.search.searchBarPlaceholder}
        aria-label={i18n(cfg.locale).components.search.title}
        autocomplete="off"
      />
    </form>
  )
}

LabSearchLink.afterDOMLoaded = script

export default (() => LabSearchLink) satisfies QuartzComponentConstructor
