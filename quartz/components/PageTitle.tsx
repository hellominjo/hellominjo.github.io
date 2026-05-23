import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

const PageTitle: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const title = cfg?.pageTitle ?? i18n(cfg.locale).propertyDefaults.title
  const baseDir = pathToRoot(fileData.slug!)
  return (
    <div class={classNames(displayClass, "page-title-wrapper")}>
      <h2 class="page-title">
        <a href={baseDir}>{title}</a>
      </h2>
    </div>
  )
}

PageTitle.css = `
.page-title-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.page-title-icon {
  width: 30px;
  height: 30x;
  float: left;
  margin: 0px;
  padding-right: 10px;
  border-radius: 4px;
}

.page-title {
  font-size: 1.58rem;  
  margin: 0;
  font-family: var(--titleFont);
}

.page-title a {
  color: var(--darkgray) !important;
}
`

export default (() => PageTitle) satisfies QuartzComponentConstructor
