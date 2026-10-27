
function initLabDrawer() {
  const button = document.querySelector<HTMLButtonElement>(
    ".lab-header__menu"
  )
  const sidebar = document.querySelector<HTMLElement>(
    "#quartz-body > .sidebar.left"
  )
  const backdrop = document.querySelector<HTMLElement>(
    ".lab-drawer-backdrop"
  )

  if (!button || !sidebar || !backdrop) return

  sidebar.id = "quartz-drawer"

  const closeDrawer = () => {
    document.body.classList.remove("lab-drawer-open")
    button.setAttribute("aria-expanded", "false")
    button.setAttribute("aria-label", "탐색 메뉴 열기")
    sidebar.removeAttribute("role")
    sidebar.removeAttribute("aria-modal")
  }

  const openDrawer = () => {
    document.body.classList.add("lab-drawer-open")
    button.setAttribute("aria-expanded", "true")
    button.setAttribute("aria-label", "탐색 메뉴 닫기")
    sidebar.setAttribute("role", "dialog")
    sidebar.setAttribute("aria-modal", "true")
  }

  // SPA 이동 시 열린 상태 초기화
  closeDrawer()

  button.onclick = () => {
    if (document.body.classList.contains("lab-drawer-open")) {
      closeDrawer()
    } else {
      openDrawer()
    }
  }

  backdrop.onclick = closeDrawer

  // 중복 등록 방지
  document.onkeydown = (event) => {
    if (event.key === "Escape") {
      closeDrawer()
    }
  }

  // 게시글 링크 클릭 시 닫기
  sidebar.addEventListener("click", (event) => {
    const target = event.target as HTMLElement
    if (target.closest("a")) {
      closeDrawer()
    }
  })
}

document.addEventListener("nav", initLabDrawer)
