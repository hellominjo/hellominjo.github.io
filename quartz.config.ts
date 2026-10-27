import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
  pageTitle: "HELLOMINJO",
  pageTitleSuffix: " | Research & Engineering Lab",

  enableSPA: true,
  enablePopovers: true,

  analytics: {
    provider: "plausible",
  },

  locale: "ko-KR",
  baseUrl: "hellominjo.github.io",

  ignorePatterns: ["private", "templates", ".obsidian"],
  defaultDateType: "modified",

  theme: {
    fontOrigin: "googleFonts",
    cdnCaching: true,

    typography: {
      // 로고(HELLOMINJO)용 800 굵기 포함
      header: { name: "Inter", weights: [400, 700, 800] },
      body: "Noto Sans KR",
      code: "IBM Plex Mono",
    },

    colors: {
      lightMode: {
        light: "#f6f6f6",
        lightgray: "#e5e5e5",
        gray: "#a0a0a0",
        darkgray: "#555555",
        dark: "#141414",
        secondary: "#303030",
        tertiary: "#777777",
        highlight: "rgba(20, 20, 20, 0.06)",
        textHighlight: "#dddddd88",
      },

      darkMode: {
        light: "#141414",
        lightgray: "#303030",
        gray: "#777777",
        darkgray: "#c5c5c5",
        dark: "#f5f5f5",
        secondary: "#e0e0e0",
        tertiary: "#aaaaaa",
        highlight: "rgba(255, 255, 255, 0.08)",
        textHighlight: "#66666688",
      },
    },
   },
  },     
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
