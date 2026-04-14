import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const countryData = [
  { name: 'Nigeria', score: 4.8, cx: 218, cy: 268 },
  { name: 'Kenya', score: 4.2, cx: 340, cy: 310 },
  { name: 'Bangladesh', score: 4.5, cx: 580, cy: 215 },
  { name: 'Ethiopia', score: 3.8, cx: 330, cy: 280 },
  { name: 'Tanzania', score: 3.5, cx: 330, cy: 340 },
  { name: 'Ghana', score: 3.2, cx: 195, cy: 265 },
  { name: 'Uganda', score: 3.6, cx: 315, cy: 310 },
  { name: 'Mozambique', score: 2.8, cx: 340, cy: 390 },
  { name: 'Mali', score: 2.5, cx: 190, cy: 230 },
  { name: 'Niger', score: 2.3, cx: 220, cy: 230 },
  { name: 'India', score: 3.9, cx: 530, cy: 225 },
  { name: 'Myanmar', score: 2.1, cx: 570, cy: 240 },
  { name: 'Senegal', score: 2.6, cx: 155, cy: 240 },
  { name: 'Rwanda', score: 3.4, cx: 320, cy: 325 },
  { name: 'Malawi', score: 3.0, cx: 340, cy: 370 },
]

export default function PriorityZonesChoropleth() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    container.innerHTML = ''

    const width = container.clientWidth
    const height = 460

    const svg = d3.select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')

    const colorScale = d3.scaleLinear<string>()
      .domain([2, 3.5, 5])
      .range(['#e0e0e0', '#FFB300', '#00695C'])

    // Background
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', '#f8fafc')
      .attr('rx', 8)

    // Simplified continental outlines as context
    svg.append('text')
      .attr('x', 210)
      .attr('y', 180)
      .attr('text-anchor', 'middle')
      .style('font-size', '13px')
      .style('fill', '#94a3b8')
      .style('font-weight', '600')
      .text('AFRICA')

    svg.append('text')
      .attr('x', 550)
      .attr('y', 180)
      .attr('text-anchor', 'middle')
      .style('font-size', '13px')
      .style('fill', '#94a3b8')
      .style('font-weight', '600')
      .text('SOUTH ASIA')

    // Scale factor for mapping
    const scaleX = width / 700

    // Draw country bubbles
    countryData.forEach((country, i) => {
      const cx = country.cx * scaleX
      const cy = country.cy
      const r = 18 + country.score * 4

      const g = svg.append('g')

      g.append('circle')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', 0)
        .attr('fill', colorScale(country.score))
        .attr('stroke', country.score >= 4.0 ? '#004D40' : '#999')
        .attr('stroke-width', country.score >= 4.0 ? 2 : 1)
        .attr('opacity', 0.85)
        .transition()
        .duration(600)
        .delay(i * 80)
        .attr('r', r)

      g.append('text')
        .attr('x', cx)
        .attr('y', cy - 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '9px')
        .style('font-weight', '700')
        .style('fill', country.score >= 3.5 ? '#fff' : '#333')
        .style('opacity', 0)
        .text(country.name)
        .transition()
        .delay(i * 80 + 400)
        .duration(300)
        .style('opacity', 1)

      g.append('text')
        .attr('x', cx)
        .attr('y', cy + 10)
        .attr('text-anchor', 'middle')
        .style('font-size', '10px')
        .style('font-weight', '800')
        .style('fill', country.score >= 3.5 ? '#fff' : '#333')
        .style('opacity', 0)
        .text(country.score.toFixed(1))
        .transition()
        .delay(i * 80 + 400)
        .duration(300)
        .style('opacity', 1)
    })

    // Legend
    const legendData = [
      { label: 'High Priority (4+)', color: '#00695C' },
      { label: 'Medium (3-4)', color: '#FFB300' },
      { label: 'Low (<3)', color: '#e0e0e0' },
    ]

    const legendG = svg.append('g')
      .attr('transform', `translate(${width / 2 - 180}, ${height - 35})`)

    legendData.forEach((d, i) => {
      legendG.append('circle')
        .attr('cx', i * 140)
        .attr('cy', 6)
        .attr('r', 6)
        .attr('fill', d.color)
      legendG.append('text')
        .attr('x', i * 140 + 12)
        .attr('y', 10)
        .style('font-size', '11px')
        .style('fill', '#555')
        .text(d.label)
    })

    return () => { container.innerHTML = '' }
  }, [])

  return <div ref={containerRef} style={{ width: '100%' }} />
}
