import { FullSlug } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"
import { write } from "./helpers"
import { ADSENSE_CLIENT, adsTxtContent } from "../../util/adsense"

// 사이트 루트에 /ads.txt 생성 (AdSense 게시자 ID가 있을 때만)
export const AdsTxt: QuartzEmitterPlugin = () => ({
  name: "AdsTxt",
  async *emit(ctx) {
    if (!ADSENSE_CLIENT) return

    yield write({
      ctx,
      slug: "ads" as FullSlug,
      ext: ".txt",
      content: adsTxtContent(ADSENSE_CLIENT),
    })
  },
  async *partialEmit() {},
})
