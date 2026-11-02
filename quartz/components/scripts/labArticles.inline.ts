function initLabArticles() {
  const sections = document.querySelectorAll<HTMLElement>(".lab-articles")

  sections.forEach((section) => {
    const buttons =
      section.querySelectorAll<HTMLButtonElement>(".lab-filter")

    const articles = Array.from(
      section.querySelectorAll<HTMLElement>(".lab-article-item")
    )

    const count = section.querySelector(".lab-articles__count")
    const pager = section.querySelector<HTMLElement>(".lab-pagination")
    const empty = section.querySelector<HTMLElement>(".lab-empty")
    // data-page-size 없으면(홈) 페이징 없이 표시, data-limit 있으면 필터 결과 중 최신 N개만
    const pageSize = Number(section.dataset.pageSize) || Infinity
    const limit = Number(section.dataset.limit) || Infinity

    let selected = ""
    let page = 1

    const render = () => {
      const matched = articles
        .filter((article) => {
          const tags = (article.dataset.tags ?? "")
            .split(",")
            .map((tag) => tag.trim().toLowerCase())
          return !selected || tags.includes(selected)
        })
        .slice(0, limit)

      const pages = Math.max(1, Math.ceil(matched.length / pageSize))
      page = Math.min(page, pages)
      // pageSize가 Infinity(홈)면 0 * Infinity = NaN이 되므로 1페이지는 0부터
      const start = page === 1 ? 0 : (page - 1) * pageSize
      const visible = new Set(matched.slice(start, start + pageSize))

      articles.forEach((article) => {
        article.hidden = !visible.has(article)
      })

      if (count) count.textContent = String(matched.length)
      if (empty) empty.hidden = matched.length > 0
      if (pager) renderPager(pager, pages)
    }

    const renderPager = (nav: HTMLElement, pages: number) => {
      nav.innerHTML = ""
      nav.hidden = pages <= 1
      if (pages <= 1) return

      const add = (label: string, target: number, opts: { current?: boolean; disabled?: boolean; aria?: string } = {}) => {
        const btn = document.createElement("button")
        btn.type = "button"
        btn.className = "lab-page" + (opts.current ? " active" : "")
        btn.textContent = label
        btn.disabled = Boolean(opts.disabled)
        if (opts.current) btn.setAttribute("aria-current", "page")
        if (opts.aria) btn.setAttribute("aria-label", opts.aria)
        btn.onclick = () => {
          page = target
          render()
          section.scrollIntoView({ behavior: "smooth", block: "start" })
        }
        nav.appendChild(btn)
      }

      add("‹", page - 1, { disabled: page === 1, aria: "이전 페이지" })
      for (let i = 1; i <= pages; i++) {
        add(String(i), i, { current: i === page })
      }
      add("›", page + 1, { disabled: page === pages, aria: "다음 페이지" })
    }

    buttons.forEach((button) => {
      button.onclick = () => {
        selected = button.dataset.category ?? ""
        page = 1

        buttons.forEach((item) => {
          item.classList.toggle("active", item === button)
        })

        render()
      }
    })

    buttons[0]?.click()
  })
}

document.addEventListener("nav", initLabArticles)
