
// /articles?q=검색어 로 들어오면 상단 검색(Quartz Search)을 열고 검색어 입력
function initLabSearchQuery() {
  const query = new URLSearchParams(window.location.search).get("q")?.trim()
  if (!query) return

  const search = document.querySelector<HTMLElement>(".center .search")
  const button = search?.querySelector<HTMLButtonElement>(".search-button")
  const container = search?.querySelector<HTMLElement>(".search-container")
  const bar = search?.querySelector<HTMLInputElement>(".search-bar")
  if (!button || !container || !bar) return

  // search.inline.ts는 검색 데이터(fetchData)를 불러온 뒤에 클릭 리스너를 등록하므로
  // 검색창이 열릴 때까지 짧게 재시도 (최대 약 5초)
  let tries = 0
  const open = () => {
    button.click()
    if (container.classList.contains("active")) {
      bar.value = query
      bar.dispatchEvent(new Event("input"))
    } else if (++tries < 50) {
      setTimeout(open, 100)
    }
  }
  open()
}

document.addEventListener("nav", initLabSearchQuery)
