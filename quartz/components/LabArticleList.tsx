import script from "./scripts/labArticles.inline"

import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "./types"
import { resolveRelative } from "../util/path"

const categories = [
  { label: "All", tag: "" },  
  { label: "AI & Data", tag: "ai-data" },
  { label: "Product", tag: "product" },
  { label: "Tech", tag: "tech" },  
  { label: "Platform", tag: "platform" },
  { label: "Cloud", tag: "cloud" },
  { label: "DevOps", tag: "devops" },
]

interface Options {
  // 표시 개수 (미지정 시 전체)
  limit?: number
}

export default ((opts?: Options) => {
const LabArticleList: QuartzComponent = ({
  allFiles,
  fileData,
}: QuartzComponentProps) => {
  const articles = allFiles
    .filter((file) => file.slug !== "index")
    .filter((file) => file.slug !== "articles")
    // 폴더 index.md 제외
    .filter((file) => !file.slug?.endsWith("/index"))
    .filter((file) => file.frontmatter?.title)
    .filter((file) => !file.slug?.startsWith("tags/"))
    .filter((file) => !file.slug?.startsWith("folder/"))
    .sort((a, b) => {
      const dateA = a.dates?.created?.getTime() ?? 0
      const dateB = b.dates?.created?.getTime() ?? 0
      return dateB - dateA
    })
    .slice(0, opts?.limit)

  return (
    <section class="lab-section lab-articles">
      <p class="lab-hero__eyebrow">ARTICLES / 002</p>
      <h2 class="lab-section__heading">Latest Articles</h2>

      <div class="lab-article-filters">
        {categories.map((category) => (
          <button
            type="button"
            class="lab-filter"
            data-category={category.tag}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div class="lab-article-list">
        {articles.map((article) => {
          const tags = article.frontmatter?.tags ?? []
          const date = article.dates?.created

          return (
            <a
              class="lab-article-item internal"
              href={resolveRelative(fileData.slug!, article.slug!)}
              data-tags={tags.join(",")}
            >
              <div class="lab-article-meta">
                <span class="lab-category">{tags[0] ?? "Research"}</span>
                <span>
                  {date
                    ? date.toLocaleDateString("ko-KR")
                    : ""}
                </span>
              </div>

              <h3>{article.frontmatter?.title}</h3>

              {article.description && (
                <p>{article.description}</p>
              )}

              <span class="lab-article-arrow">↗</span>
            </a>
          )
        })}
      </div>

      {articles.length === 0 && (
        <p class="lab-empty">등록된 게시글이 없습니다.</p>
      )}
    </section>
  )
}

LabArticleList.afterDOMLoaded = script
return LabArticleList
}) satisfies QuartzComponentConstructor<Options>