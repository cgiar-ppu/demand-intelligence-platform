import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const gapTypes = [
  'User Relevance',
  'Institutional/Policy',
  'Market/Business',
  'Network/Knowledge',
  'Gender/Inclusion',
  'System Readiness',
]

const countryData = [
  { name: 'Nigeria', color: '#00695C', values: [3.8, 4.5, 3.2, 2.8, 4.2, 3.0] },
  { name: 'Bangladesh', color: '#1565C0', values: [2.5, 3.2, 3.8, 3.5, 3.0, 3.8] },
  { name: 'Kenya', color: '#F9A825', values: [3.0, 3.0, 4.0, 2.5, 3.5, 2.8] },
]

const maxValue = 5

export default function GapRadar() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    container.innerHTML = ''

    const size = Math.min(container.clientWidth, 460)
    const margin = 70
    const radius = (size - margin * 2) / 2

    const svg = d3.select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${size} ${size + 40}`)
      .attr('width', '100%')

    const g = svg.append('g')
      .attr('transform', `translate(${size / 2},${size / 2})`)

    const angleSlice = (2 * Math.PI) / gapTypes.length
    const levels = 5

    // Grid circles
    for (let lvl = 1; lvl <= levels; lvl++) {
      const r = (radius / levels) * lvl
      g.append('circle')
        .attr('r', r)
        .attr('fill', lvl === levels ? '#fff5f5' : 'none')
        .attr('stroke', '#ddd')
        .attr('stroke-width', 0.5)

      g.append('text')
        .attr('x', 4).attr('y', -r + 4)
        .style('font-size', '9px').style('fill', '#999')
        .text(String(lvl))
    }

    // Axes
    gapTypes.forEach((gap, i) => {
      const angle = angleSlice * i - Math.PI / 2
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius

      g.append('line')
        .attr('x1', 0).attr('y1', 0)
        .attr('x2', x).attr('y2', y)
        .attr('stroke', '#ddd').attr('stroke-width', 0.5)

      const labelR = radius + 22
      const lx = Math.cos(angle) * labelR
      const ly = Math.sin(angle) * labelR
      g.append('text')
        .attr('x', lx).attr('y', ly)
        .attr('text-anchor', Math.abs(lx) < 5 ? 'middle' : lx > 0 ? 'start' : 'end')
        .attr('dominant-baseline', ly > 0 ? 'hanging' : ly < -5 ? 'auto' : 'middle')
        .style('font-size', '9px').style('font-weight', '600').style('fill', '#555')
        .text(gap)
    })

    // Country polygons
    const radarLine = d3.lineRadial<number>()
      .radius(d => (d / maxValue) * radius)
      .angle((_d, i) => i * angleSlice)
      .curve(d3.curveLinearClosed)

    countryData.forEach((country, ci) => {
      const path = g.append('path')
        .datum(country.values)
        .attr('d', radarLine)
        .attr('fill', country.color)
        .attr('fill-opacity', 0.08)
        .attr('stroke', country.color)
        .attr('stroke-width', 2)
        .attr('stroke-opacity', 0)

      const pathEl = path.node()
      if (pathEl) {
        const length = pathEl.getTotalLength()
        path
          .attr('stroke-dasharray', `${length} ${length}`)
          .attr('stroke-dashoffset', length)
          .transition()
          .duration(1200)
          .delay(ci * 300)
          .attr('stroke-dashoffset', 0)
          .attr('stroke-opacity', 1)
      }

      country.values.forEach((val, i) => {
        const angle = angleSlice * i - Math.PI / 2
        const cx = Math.cos(angle) * (val / maxValue) * radius
        const cy = Math.sin(angle) * (val / maxValue) * radius
        g.append('circle')
          .attr('cx', cx).attr('cy', cy)
          .attr('r', 3)
          .attr('fill', country.color)
          .attr('stroke', '#fff').attr('stroke-width', 1)
          .style('opacity', 0)
          .transition()
          .delay(ci * 300 + 1200)
          .duration(300)
          .style('opacity', 1)
      })
    })

    // Legend
    const legendG = svg.append('g')
      .attr('transform', `translate(${size / 2 - 100},${size + 5})`)

    countryData.forEach((country, i) => {
      legendG.append('rect').attr('x', i * 100).attr('y', 0).attr('width', 12).attr('height', 12).attr('rx', 2).attr('fill', country.color)
      legendG.append('text').attr('x', i * 100 + 16).attr('y', 10).style('font-size', '11px').style('fill', '#333').text(country.name)
    })

    return () => { container.innerHTML = '' }
  }, [])

  return <div ref={containerRef} style={{ width: '100%', maxWidth: 460, margin: '0 auto' }} />
}
