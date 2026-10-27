function initLabArticles() {
  const sections = document.querySelectorAll(".lab-articles")

  sections.forEach((section) => {
    const buttons =
      section.querySelectorAll<HTMLButtonElement>(".lab-filter")

    const articles =
      section.querySelectorAll<HTMLElement>(".lab-article-item")

    buttons.forEach((button) => {
      button.onclick = () => {
        const selected = button.dataset.category ?? ""

        buttons.forEach((item) => {
          item.classList.toggle("active", item === button)
        })

        articles.forEach((article) => {
          const tags = (article.dataset.tags ?? "")
            .split(",")
            .map((tag) => tag.trim().toLowerCase())

          article.hidden = Boolean(
            selected && !tags.includes(selected)
          )
        })
      }
    })

    buttons[0]?.click()
  })
}

document.addEventListener("nav", initLabArticles)