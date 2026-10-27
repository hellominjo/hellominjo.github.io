import drawerScript from "./scripts/labDrawer.inline"
import themeScript from "./scripts/labTheme.inline"

import type {
  QuartzComponent,
  QuartzComponentConstructor,
} from "./types"

import { resolveRelative } from "../util/path"

const LabHeader: QuartzComponent = (props) => {
  const home = resolveRelative(props.fileData.slug!, "index")

  return (
    <header class="lab-header">
      <div class="lab-drawer-backdrop" aria-hidden="true"></div>
      <div class="lab-header__inner">
        <div class="lab-header__brand">
          <button
            type="button"
            class="lab-header__menu"
            aria-label="탐색 메뉴 열기"
            aria-expanded="false"
            aria-controls="quartz-drawer"
            >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <a href={home} class="lab-header__logo internal" data-no-popover="true">
            <strong>HELLOMINJO</strong>
            <span class="lab-header__logo-sub">/ LAB</span>
          </a>
        </div>

        <nav class="lab-header__nav" aria-label="주 메뉴">
          <a href={home} class="internal" data-no-popover="true">Home</a>
          <a href="/articles" class="internal" data-no-popover="true">Articles</a>
          <a href="/tags" class="internal" data-no-popover="true">Tags</a>
          <a href="/about" class="internal" data-no-popover="true">About</a>
        </nav>

        <div class="lab-header__actions">
          <a
            href="https://hellominjo.net"
            class="lab-header__icon"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="포트폴리오 사이트"
            data-no-popover="true"
          >
            <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              {/* work grid (portfolio) */}
              <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
              <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
              <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
              <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
            </svg>
          </a>
          <button
            type="button"
            class="lab-header__icon lab-theme-toggle"
            aria-label="다크/라이트 모드 전환"
          >
            <svg class="lab-theme-toggle__moon" viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
            </svg>
            <svg class="lab-theme-toggle__sun" viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}

LabHeader.afterDOMLoaded = [drawerScript, themeScript]
export default (() => LabHeader) satisfies QuartzComponentConstructor
