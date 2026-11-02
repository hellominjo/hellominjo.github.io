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

// 글 목록 제외 기준(위치): content 최상위 단독 페이지(About, articles 등) · Archive 폴더
const isListedArticle = (slug: string) => slug.includes("/") && !slug.startsWith("archive/")

interface Options {
  // 표시 개수 (미지정 시 전체) — 홈 최신글용, 나머지는 렌더링하지 않음
  limit?: number
  // 페이지당 개수 — 전체를 렌더링하고 labArticles.inline.ts에서 페이징 (/articles)
  pageSize?: number
}

export default ((opts?: Options) => {
const LabArticleList: QuartzComponent = ({
  allFiles,
  fileData,
}: QuartzComponentProps) => {
  const articles = allFiles
    .filter((file) => isListedArticle(file.slug ?? ""))
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
    <section class="lab-section lab-articles" data-page-size={opts?.pageSize}>
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

      {/* 전체 목록(/articles)에서만 개수 표시, 필터 시 labArticles.inline.ts에서 숫자 갱신 */}
      {opts?.pageSize && (
        <p class="lab-articles__total">
          Total : <span class="lab-articles__count">{articles.length}</span>
        </p>
      )}

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

      {/* 페이지 번호는 labArticles.inline.ts에서 생성 */}
      {opts?.pageSize && <nav class="lab-pagination" aria-label="Articles pages"></nav>}

      {articles.length === 0 && (
        <p class="lab-empty">등록된 게시글이 없습니다.</p>
      )}
    </section>
  )
}

LabArticleList.afterDOMLoaded = script
return LabArticleList
}) satisfies QuartzComponentConstructor<Options>