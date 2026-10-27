
function initLabLinks() {
  const toggle = document.querySelector<HTMLButtonElement>(".lab-links__toggle")
  const nav = toggle?.closest<HTMLElement>(".lab-links")
  if (!toggle || !nav) return

  // 모바일에서만 드롭다운으로 동작 (데스크톱은 CSS로 항상 펼침)
  toggle.onclick = () => {
    const open = nav.classList.toggle("is-open")
    toggle.setAttribute("aria-expanded", String(open))
  }
}

document.addEventListener("nav", initLabLinks)
