import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const centers = [
  { name: 'IRRI', lab: 12, field: 18, market: 8 },
  { name: 'IITA', lab: 10, field: 15, market: 7 },
  { name: 'CIMMYT', lab: 8, field: 14, market: 9 },
  { name: 'ICRISAT', lab: 9, field: 11, market: 5 },
  { name: 'IWMI', lab: 6, field: 8, market: 3 },
  { name: 'WorldFish', lab: 5, field: 6, market: 3 },
  { name: 'CIP', lab: 7, field: 9, market: 4 },
]

const readinessLevels = ['Lab', 'Field', 'Market']
const levelColors = ['#b2dfdb', '#26a69a', '#00695C']

export default function InnovationByCenter() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    container.innerHTML = ''

    const margin = { top: 20, right: 40, bottom: 40, left: 80 }
    const barH = 30
    const height = margin.top + centers.length * barH + margin.bottom + 10
    const width = container.clientWidth
    const innerW = width - margin.left - margin.right

    const svg = d3.select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const maxTotal = d3.max(centers, c => c.lab + c.field + c.market) || 1

    const x = d3.scaleLinear().domain([0, maxTotal * 1.15]).range([0, innerW])
    const y = d3.scaleBand().domain(centers.map(c => c.name)).range([0, centers.length * barH]).padding(0.2)

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${centers.length * barH})`)
      .call(d3.axisBottom(x).ticks(5))
      .selectAll('text').style('font-size', '10px')

    g.append('text')
      .attr('x', innerW / 2)
      .attr('y', centers.length * barH + 30)
      .attr('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('fill', '#666')
      .text('Number of Innovations')

    // Stacked bars
    centers.forEach((center, ci) => {
      const vals = [center.lab, center.field, center.market]
      let cumX = 0

      // Label
      g.append('text')
        .attr('x', -8)
        .attr('y', y(center.name)! + y.bandwidth() / 2 + 4)
        .attr('text-anchor', 'end')
        .style('font-size', '11px')
        .style('font-weight', '600')
        .style('fill', '#1f2937')
        .text(center.name)

      vals.forEach((val, vi) => {
        g.append('rect')
          .attr('x', x(cumX))
          .attr('y', y(center.name)!)
          .attr('width', 0)
          .attr('height', y.bandwidth())
          .attr('fill', levelColors[vi])
          .attr('rx', vi === 0 ? 3 : vi === vals.length - 1 ? 3 : 0)
          .transition()
          .duration(600)
          .delay(ci * 80 + vi * 100)
          .attr('width', x(val))

        cumX += val
      })

      // Total label
      g.append('text')
        .attr('x', x(cumX) + 6)
        .attr('y', y(center.name)! + y.bandwidth() / 2 + 4)
        .style('font-size', '10px')
        .style('font-weight', '700')
        .style('fill', '#374151')
        .style('opacity', 0)
        .text(center.lab + center.field + center.market)
        .transition()
        .delay(ci * 80 + 600)
        .duration(300)
        .style('opacity', 1)
    })

    // Legend
    const legendG = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${height - 12})`)

    readinessLevels.forEach((level, i) => {
      legendG.append('rect').attr('x', i * 90).attr('y', 0).attr('width', 12).attr('height', 12).attr('rx', 2).attr('fill', levelColors[i])
      legendG.append('text').attr('x', i * 90 + 16).attr('y', 10).style('font-size', '10px').style('fill', '#555').text(level)
    })

    return () => { container.innerHTML = '' }
  }, [])

  return <div ref={containerRef} style={{ width: '100%' }} />
}
