// 헤더 다크/라이트 토글 (darkmode.inline.ts와 같은 방식: saved-theme + localStorage + themechange)
document.addEventListener("nav", () => {
  const switchTheme = () => {
    const newTheme =
      document.documentElement.getAttribute("saved-theme") === "dark" ? "light" : "dark"
    document.documentElement.setAttribute("saved-theme", newTheme)
    localStorage.setItem("theme", newTheme)
    document.dispatchEvent(
      new CustomEvent("themechange", { detail: { theme: newTheme } }),
    )
  }

  for (const button of document.querySelectorAll<HTMLButtonElement>(".lab-theme-toggle")) {
    button.addEventListener("click", switchTheme)
    window.addCleanup(() => button.removeEventListener("click", switchTheme))
  }
})
