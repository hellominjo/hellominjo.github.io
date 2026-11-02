import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

import LabHero from "./quartz/components/LabHero"
import ResearchIndex from "./quartz/components/ResearchIndex"
import LabArticleList from "./quartz/components/LabArticleList"
import LabHeader from "./quartz/components/LabHeader"
import LabLinks from "./quartz/components/LabLinks"
import LabSearchLink from "./quartz/components/LabSearchLink"

// 홈 / 전체 글 목록(/articles) 페이지 판별
const isHome = (page: any) => page.fileData.slug === "index"
const isArticlesPage = (page: any) => page.fileData.slug === "articles"
const isArticle = (page: any) => !isHome(page) && !isArticlesPage(page)

// 오른쪽 영역 (index 제외: 카테고리 · article 페이지)
const rightComponents = [
  Component.ConditionalRender({
    component: Component.Graph(),
    condition: isArticle,
  }),
  Component.ConditionalRender({
    component: Component.DesktopOnly(
      Component.TableOfContents()
    ),
    condition: isArticle,
  }),
]

// 왼쪽 탐색기
// sortFn / filterFn은 문자열로 직렬화돼 브라우저에서 실행됨 → 외부 변수 참조 불가
const explorer = Component.Explorer({
  filterFn: (node) =>
    node.slugSegment !== "tags" &&
    node.slugSegment !== "articles" &&
    node.slugSegment !== "about" &&
    node.slugSegment !== "privacy",
  sortFn: (a, b) => {
    const order = ["ai-data", "engineering", "product", "insights", "archive", "study-notes"]
    // 내부 함수 선언 금지: esbuild가 __name()으로 감싸 브라우저에서 ReferenceError
    const ia = order.indexOf(a.slugSegment)
    const ib = order.indexOf(b.slugSegment)
    if (a.isFolder !== b.isFolder) return a.isFolder ? -1 : 1
    const diff = (ia === -1 ? order.length : ia) - (ib === -1 ? order.length : ib)
    if (diff !== 0) return diff
    return a.displayName.localeCompare(b.displayName, undefined, {
      numeric: true,
      sensitivity: "base",
    })
  },
})

// 모든 페이지 공통
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [
    LabHeader(),
  ],
  afterBody: [
    Component.ConditionalRender({
      component: Component.Backlinks({ hideWhenEmpty: false }),
      condition: isArticle,
    }),
    Component.ConditionalRender({
      component: Component.RecentNotes({
        title: "Recent Notes",
        limit: 2,
        showTags: false,
      }),
      condition: isArticle,
    }),
  ],

  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/hellominjo",
      "E-mail": "mailto:minjohello@gmail.com",
      Privacy: "/privacy",
    },
  }),
}

// 일반 콘텐츠 페이지 및 홈 페이지
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
        component: LabHero(),
        condition: (page) => page.fileData.slug === "index",
    }),
    Component.ConditionalRender({
        component: ResearchIndex(),
        condition: (page) => page.fileData.slug === "index",
    }),  
    Component.ConditionalRender({
        component: LabArticleList({ limit: 5 }),
        condition: isHome,
    }),
    // 기존 Breadcrumbs, ArticleTitle, ContentMeta, TagList
    Component.ConditionalRender({
      // 상세 페이지에서는 현재 글 제목 제외 (상위 경로만)
      component: Component.Breadcrumbs({ showCurrentPage: false }),
      // 홈 · /articles 제외 (/articles는 제목 옆 검색만)
      condition: (page) => !isHome(page) && !isArticlesPage(page),
    }),
    Component.ConditionalRender({
      component: Component.ArticleTitle(),
      condition: isArticle,
    }),
    Component.ConditionalRender({
      component: Component.ContentMeta(),
      condition: isArticle,
    }),
    Component.ConditionalRender({
      component: Component.TagList(),
      condition: isArticle,
    }),
    // /articles: 상단 사이트 검색 (drawer 검색 시 ?q=로 이동해 자동 실행)
    Component.ConditionalRender({
        component: Component.Search(),
        condition: isArticlesPage,
    }),
    // /articles: Breadcrumbs 아래에 전체 글 목록
    Component.ConditionalRender({
        component: LabArticleList({ pageSize: 5 }),
        condition: isArticlesPage,
    }),
  ],

  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
        components: [
        {
            Component: LabSearchLink(),
            grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
        ],
    }),
    explorer,
    LabLinks(),
  ],

  right: rightComponents,
}

// 태그 및 폴더 목록 페이지
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
  ],

  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: LabSearchLink(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    explorer,
    LabLinks(),
  ],

  right: rightComponents,
}
