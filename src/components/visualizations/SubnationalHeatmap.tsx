import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const regions = [
  { region: 'North West', population: 49.6, povertyRate: 77.7, agLand: 7.2, priority: 5 },
  { region: 'North East', population: 26.3, povertyRate: 76.3, agLand: 4.8, priority: 5 },
  { region: 'North Central', population: 29.1, povertyRate: 67.5, agLand: 5.6, priority: 4 },
  { region: 'South West', population: 38.3, povertyRate: 53.5, agLand: 2.8, priority: 3 },
  { region: 'South South', population: 28.8, povertyRate: 56.2, agLand: 2.1, priority: 3 },
  { region: 'South East', population: 22.4, povertyRate: 58.8, agLand: 1.9, priority: 2 },
]

const columns = ['Population (M)', 'Poverty Rate (%)', 'Ag Land (Mha)', 'Demand Priority']

export default function SubnationalHeatmap() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    container.innerHTML = ''

    const margin = { top: 50, right: 20, bottom: 20, left: 120 }
    const cellW = 130
    const cellH = 42
    const width = margin.left + columns.length * cellW + margin.right
    const height = margin.top + regions.length * cellH + margin.bottom

    const svg = d3.select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')

    // Column headers
    columns.forEach((col, i) => {
      svg.append('text')
        .attr('x', margin.left + i * cellW + cellW / 2)
        .attr('y', margin.top - 12)
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('font-weight', '700')
        .style('fill', '#374151')
        .text(col)
    })

    const priorityColor = d3.scaleLinear<string>()
      .domain([1, 3, 5])
      .range(['#e8f5e9', '#FFB300', '#00695C'])

    const povertyColor = d3.scaleLinear<string>()
      .domain([50, 65, 80])
      .range(['#fff9c4', '#ff8f00', '#d32f2f'])

    regions.forEach((row, ri) => {
      const y = margin.top + ri * cellH

      // Row label
      svg.append('text')
        .attr('x', margin.left - 10)
        .attr('y', y + cellH / 2 + 4)
        .attr('text-anchor', 'end')
        .style('font-size', '12px')
        .style('font-weight', '600')
        .style('fill', '#1f2937')
        .text(row.region)

      const values = [row.population, row.povertyRate, row.agLand, row.priority]
      const formats = [(v: number) => v.toFixed(1), (v: number) => v.toFixed(1) + '%', (v: number) => v.toFixed(1), (v: number) => v.toFixed(0)]

      values.forEach((val, ci) => {
        const x = margin.left + ci * cellW

        let bgColor = '#f1f5f9'
        if (ci === 3) bgColor = priorityColor(val)
        else if (ci === 1) bgColor = povertyColor(val)
        else if (ci === 0) bgColor = d3.interpolateBlues(val / 55)
        else if (ci === 2) bgColor = d3.interpolateGreens(val / 8)

        const textColor = (ci === 3 && val >= 4) || (ci === 1 && val >= 70) ? '#fff' : '#1f2937'

        svg.append('rect')
          .attr('x', x + 2)
          .attr('y', y + 2)
          .attr('width', cellW - 4)
          .attr('height', cellH - 4)
          .attr('rx', 4)
          .attr('fill', bgColor)
          .attr('opacity', 0)
          .transition()
          .duration(400)
          .delay(ri * 80 + ci * 50)
          .attr('opacity', 0.85)

        svg.append('text')
          .attr('x', x + cellW / 2)
          .attr('y', y + cellH / 2 + 4)
          .attr('text-anchor', 'middle')
          .style('font-size', '13px')
          .style('font-weight', '700')
          .style('fill', textColor)
          .style('opacity', 0)
          .text(formats[ci](val))
          .transition()
          .delay(ri * 80 + ci * 50 + 200)
          .duration(300)
          .style('opacity', 1)
      })
    })

    return () => { container.innerHTML = '' }
  }, [])

  return <div ref={containerRef} style={{ width: '100%' }} />
}
