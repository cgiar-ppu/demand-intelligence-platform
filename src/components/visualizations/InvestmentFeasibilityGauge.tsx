import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const gaugeData = [
  { country: 'Nigeria', score: 58 },
  { country: 'Bangladesh', score: 65 },
  { country: 'Kenya', score: 52 },
]

function getZoneColor(score: number): string {
  if (score < 40) return '#C62828'
  if (score < 60) return '#F9A825'
  if (score < 80) return '#2E7D32'
  return '#1B5E20'
}

export default function InvestmentFeasibilityGauge() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    container.innerHTML = ''

    const gaugeW = 180
    const gaugeH = 120
    const totalW = gaugeW
    const totalH = gaugeH + 30

    gaugeData.forEach(({ country, score }) => {
      const wrapper = document.createElement('div')
      wrapper.style.textAlign = 'center'
      wrapper.style.marginBottom = '12px'
      container.appendChild(wrapper)

      const svg = d3.select(wrapper)
        .append('svg')
        .attr('width', totalW)
        .attr('height', totalH)
        .attr('viewBox', `0 0 ${totalW} ${totalH}`)

      const g = svg.append('g')
        .attr('transform', `translate(${gaugeW / 2},${gaugeH - 10})`)

      const outerR = 70
      const innerR = 50

      const arcGen = d3.arc()
        .innerRadius(innerR)
        .outerRadius(outerR)
        .cornerRadius(3)

      // Zone backgrounds
      const zones = [
        { start: -Math.PI / 2, end: -Math.PI / 2 + Math.PI * 0.4, color: '#FFCDD2' },
        { start: -Math.PI / 2 + Math.PI * 0.4, end: -Math.PI / 2 + Math.PI * 0.6, color: '#FFF9C4' },
        { start: -Math.PI / 2 + Math.PI * 0.6, end: -Math.PI / 2 + Math.PI * 0.8, color: '#C8E6C9' },
        { start: -Math.PI / 2 + Math.PI * 0.8, end: Math.PI / 2, color: '#A5D6A7' },
      ]

      zones.forEach(z => {
        g.append('path')
          .attr('d', arcGen({ startAngle: z.start, endAngle: z.end, innerRadius: innerR, outerRadius: outerR }) || '')
          .attr('fill', z.color)
      })

      // Score arc
      const scoreAngle = -Math.PI / 2 + (score / 100) * Math.PI
      g.append('path')
        .attr('d', arcGen({ startAngle: -Math.PI / 2, endAngle: -Math.PI / 2, innerRadius: innerR, outerRadius: outerR }) || '')
        .attr('fill', getZoneColor(score))
        .transition()
        .duration(1200)
        .attrTween('d', function () {
          const interpolate = d3.interpolate(-Math.PI / 2, scoreAngle)
          return function (t: number) {
            return arcGen({ startAngle: -Math.PI / 2, endAngle: interpolate(t), innerRadius: innerR, outerRadius: outerR }) || ''
          }
        })

      // Needle
      const needleLen = outerR - 5
      const needle = g.append('line')
        .attr('x1', 0).attr('y1', 0)
        .attr('x2', 0).attr('y2', -needleLen)
        .attr('stroke', '#333')
        .attr('stroke-width', 2)
        .attr('stroke-linecap', 'round')
        .attr('transform', `rotate(${-90})`)

      needle.transition()
        .duration(1200)
        .attrTween('transform', function () {
          const interpolate = d3.interpolate(-90, -90 + (score / 100) * 180)
          return function (t: number) {
            return `rotate(${interpolate(t)})`
          }
        })

      // Center dot
      g.append('circle').attr('r', 4).attr('fill', '#333')

      // Score text
      const scoreText = g.append('text')
        .attr('y', -15)
        .attr('text-anchor', 'middle')
        .style('font-size', '18px')
        .style('font-weight', '700')
        .style('fill', getZoneColor(score))
        .text('0')

      scoreText.transition()
        .duration(1200)
        .tween('text', function () {
          const interpolate = d3.interpolateRound(0, score)
          return function (t: number) {
            (this as SVGTextElement).textContent = String(interpolate(t))
          }
        })

      // Scale labels
      g.append('text')
        .attr('x', -outerR - 2)
        .attr('y', 8)
        .attr('text-anchor', 'end')
        .style('font-size', '9px')
        .style('fill', '#999')
        .text('0')

      g.append('text')
        .attr('x', outerR + 2)
        .attr('y', 8)
        .attr('text-anchor', 'start')
        .style('font-size', '9px')
        .style('fill', '#999')
        .text('100')

      // Country label
      svg.append('text')
        .attr('x', gaugeW / 2)
        .attr('y', totalH - 4)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('font-weight', '600')
        .style('fill', '#333')
        .text(country)
    })

    return () => { container.innerHTML = '' }
  }, [])

  return (
    <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }} />
  )
}
