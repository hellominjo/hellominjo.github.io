import type {
  QuartzComponent,
  QuartzComponentConstructor,
} from "./types"

// 황금각 나선(가로 1.45배 타원)으로 입자 배치 — 빌드 시 고정 좌표로 렌더링
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))
const particles = Array.from({ length: 168 }, (_, i) => {
  const jitter = Math.sin(i * 12.9898) * 0.08
  const radius = 11.6 * Math.sqrt(i) * (1 + jitter)
  const angle = i * GOLDEN_ANGLE + jitter
  return {
    cx: +(300 + radius * 1.45 * Math.cos(angle)).toFixed(2),
    cy: +(195 + radius * Math.sin(angle)).toFixed(2),
    r: i % 9 === 0 ? 3.8 : i % 4 === 0 ? 2.6 : 1.7,
    opacity: +(0.22 + 0.085 * (i % 8)).toFixed(3),
  }
})

const LabHero: QuartzComponent = () => {
  return (
    <section class="lab-hero">
      <div class="lab-hero__text">
        <p class="lab-hero__eyebrow">
          HELLOMINJO / RESEARCH & ENGINEERING LAB
        </p>

        <h1 class="lab-hero__title">
          Research.
          <br />
          Engineer.
          <br />
          Evolve.
        </h1>

        <p class="lab-hero__description">
          기술과 서비스, AI와 데이터에 관한 탐구와 실험을 기록합니다.
        </p>
      </div>

      <figure class="lab-hero__graphic">
        <svg
          viewBox="0 0 600 390"
          preserveAspectRatio="xMidYMid slice"
          role="img"
          aria-label="격자 위에 분포한 원형 입자와 궤도 연구 그래픽"
        >
          <defs>
            <pattern id="lab-hero-grid" width="22" height="22" patternUnits="userSpaceOnUse">
              <path class="lab-hero__grid-line" d="M22 0H0V22" fill="none" stroke-width="1" />
            </pattern>
          </defs>
          <rect width="600" height="390" fill="url(#lab-hero-grid)" />
          <line class="lab-hero__axis" x1="300" x2="300" y1="0" y2="390" stroke-dasharray="6 9" />
          <line class="lab-hero__axis" x1="0" x2="600" y1="195" y2="195" stroke-dasharray="6 9" />
          <circle
            class="lab-hero__orbit"
            cx="300"
            cy="195"
            r="94"
            fill="none"
            stroke-width="1.8"
            stroke-dasharray="5 9"
          />
          <g class="lab-hero__dots">
            {particles.map((p) => (
              <circle cx={p.cx} cy={p.cy} r={p.r} opacity={p.opacity} />
            ))}
          </g>
        </svg>
        <figcaption class="lab-hero__graphic-label">SYSTEM EXPLORATION</figcaption>
      </figure>
    </section>
  )
}

export default (() => LabHero) satisfies QuartzComponentConstructor
