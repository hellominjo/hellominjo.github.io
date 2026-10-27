import fs from "fs"
import sharp from "sharp"
import { joinSegments, QUARTZ, FullSlug } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"
import { write } from "./helpers"
import { BuildCtx } from "../../util/ctx"

export const Favicon: QuartzEmitterPlugin = () => ({
  name: "Favicon",
  async *emit({ argv }) {
    const icoPath = joinSegments(QUARTZ, "static", "favicon.ico")
    const iconPath = joinSegments(QUARTZ, "static", "icon.png")

    // static/favicon.ico가 있으면 그대로 사용, 없으면 icon.png에서 생성
    const faviconContent = fs.existsSync(icoPath)
      ? await fs.promises.readFile(icoPath)
      : sharp(iconPath).resize(48, 48).toFormat("png")

    yield write({
      ctx: { argv } as BuildCtx,
      slug: "favicon" as FullSlug,
      ext: ".ico",
      content: faviconContent,
    })
  },
  async *partialEmit() {},
})
