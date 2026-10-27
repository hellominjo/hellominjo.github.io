
// Hero 그래픽 전체 모션: 입자 차등 회전 · 방사형 파동 · 마우스 반발 · 격자 흐름 · 궤도 원 호흡
function initLabHeroMotion() {
  const svg = document.querySelector<SVGSVGElement>(".lab-hero__graphic svg")
  if (!svg) return
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

  const grid = svg.querySelector<SVGPatternElement>("pattern")
  const orbit = svg.querySelector<SVGCircleElement>(".lab-hero__orbit")
  const dots = Array.from(
    svg.querySelectorAll<SVGCircleElement>(".lab-hero__dots circle"),
  ).map((el) => ({
    el,
    orbit: Number(el.dataset.orbit),
    angle: Number(el.dataset.angle),
    ox: 0, // 마우스 반발 오프셋 (보간)
    oy: 0,
  }))

  const REPEL_RADIUS = 80
  const REPEL_FORCE = 28
  let pointer: { x: number; y: number } | null = null
  let raf = 0
  let start = 0

  const onMove = (e: PointerEvent) => {
    const ctm = svg.getScreenCTM()
    if (!ctm) return
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse())
    pointer = { x: p.x, y: p.y }
  }
  const onLeave = () => (pointer = null)

  const frame = (now: number) => {
    if (!start) start = now
    const t = (now - start) / 1000

    for (const d of dots) {
      // 안쪽은 빠르게, 바깥쪽은 느리게 (차등 회전) + 반경 방향 물결
      const a = d.angle + (t * 0.6 * 40) / (d.orbit + 40)
      const wave = 1 + 0.08 * Math.sin(t * 1.6 - d.orbit * 0.05)
      const x = 300 + d.orbit * wave * 1.45 * Math.cos(a)
      const y = 195 + d.orbit * wave * Math.sin(a)

      let tx = 0
      let ty = 0
      if (pointer) {
        const dx = x - pointer.x
        const dy = y - pointer.y
        const dist = Math.hypot(dx, dy)
        if (dist < REPEL_RADIUS && dist > 0.01) {
          const f = ((REPEL_RADIUS - dist) / REPEL_RADIUS) * REPEL_FORCE
          tx = (dx / dist) * f
          ty = (dy / dist) * f
        }
      }
      d.ox += (tx - d.ox) * 0.12
      d.oy += (ty - d.oy) * 0.12

      d.el.setAttribute("cx", (x + d.ox).toFixed(2))
      d.el.setAttribute("cy", (y + d.oy).toFixed(2))
    }

    grid?.setAttribute("patternTransform", `translate(${(t * 8) % 22} ${(t * 4) % 22})`)
    orbit?.setAttribute("r", (94 + 10 * Math.sin(t * 1.4)).toFixed(2))

    raf = requestAnimationFrame(frame)
  }

  // 화면에 보일 때만 실행
  const observer = new IntersectionObserver(([entry]) => {
    cancelAnimationFrame(raf)
    if (entry.isIntersecting) raf = requestAnimationFrame(frame)
  })
  observer.observe(svg)
  svg.addEventListener("pointermove", onMove)
  svg.addEventListener("pointerleave", onLeave)

  window.addCleanup(() => {
    cancelAnimationFrame(raf)
    observer.disconnect()
    svg.removeEventListener("pointermove", onMove)
    svg.removeEventListener("pointerleave", onLeave)
  })
}

document.addEventListener("nav", initLabHeroMotion)
