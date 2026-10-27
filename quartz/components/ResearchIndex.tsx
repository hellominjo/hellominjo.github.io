import type {
  QuartzComponent,
  QuartzComponentConstructor,
} from "./types"

const researchAreas = [
  {
    number: "01",
    title: "AI & Data",
    description: "LLM · Agents · Machine Learning",
    href: "/ai-data",
  },
  {
    number: "02",
    title: "Tech",
    description: "Cloud · Architecture · DevOps",
    href: "/engineering",
  },
  {
    number: "03",
    title: "Product",
    description: "UX · Strategy · Prototypes",
    href: "/product",
  },
  {
    number: "04",
    title: "Insights",
    description: "Research · Learning · Perspectives",
    href: "/insights",
  },
]

const ResearchIndex: QuartzComponent = () => {
  return (
    <section class="lab-section lab-research">
      <p class="lab-hero__eyebrow">RESEARCH INDEX / 001</p>
      <h2 class="lab-section__heading">Explore Research</h2>

      <div class="lab-grid">
        {researchAreas.map((area) => (
          <a class="lab-card" href={area.href} key={area.number}>
            <span class="lab-card__label">
              {area.number} / FIELD <span aria-hidden="true">↗</span>
            </span>
            <div class="lab-card__body">
              <h3>{area.title}</h3>
              <p>{area.description}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}

export default (() => ResearchIndex) satisfies QuartzComponentConstructor