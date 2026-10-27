import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { FilePath, FullSlug, slugifyFilePath } from "./path"

const cache = new Map<string, string | null>()

function readSlug(fullPath: string): string | null {
  if (cache.has(fullPath)) return cache.get(fullPath)!
  let slug: string | null = null
  try {
    const { data } = matter(fs.readFileSync(fullPath, "utf8"))
    if (data.slug != null && data.slug.toString().trim() !== "") {
      slug = data.slug.toString().trim().replace(/^\/+|\/+$/g, "")
    }
  } catch {
    // 파일이 없으면 override 없음
  }
  cache.set(fullPath, slug)
  return slug
}

export function clearSlugOverrideCache() {
  cache.clear()
}

/* frontmatter `slug`로 URL 세그먼트 교체 @ 26.10.27
 * - 폴더 index.md의 slug: 해당 폴더 세그먼트 (하위 파일 전체에 적용)
 * - 일반 파일의 slug: 해당 파일 세그먼트 */
export function slugifyWithOverrides(fp: FilePath, directory: string): FullSlug {
  const slug = slugifyFilePath(fp)
  if (path.extname(fp) !== ".md") return slug

  const fpSegments = fp.split("/")
  const slugSegments = slug.split("/")
  if (fpSegments.length !== slugSegments.length) return slug

  for (let i = 0; i < fpSegments.length - 1; i++) {
    const folder = fpSegments.slice(0, i + 1).join("/")
    const override = readSlug(path.join(directory, folder, "index.md"))
    if (override) slugSegments[i] = override
  }

  const last = fpSegments.length - 1
  if (slugSegments[last] !== "index") {
    const own = readSlug(path.join(directory, fp))
    if (own) slugSegments[last] = own
  }

  return slugSegments.join("/") as FullSlug
}
