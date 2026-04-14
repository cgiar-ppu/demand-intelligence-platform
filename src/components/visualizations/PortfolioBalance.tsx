import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const data = [
  { category: 'High Readiness / High Impact', count: 12, color: '#00695C' },
  { category: 'High Readiness / Lower Impact', count: 9, color: '#26a69a' },
  { category: 'Emerging Opportunities', count: 16, color: '#1565C0' },
  { category: 'Long-term Strategic', count: 10, color: '#7B1FA2' },
]

export default function PortfolioBalance() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    container.innerHTML = ''

    const size = Math.min(container.clientWidth, 400)
    const radius = size / 2 - 30
    const innerRadius = radius * 0.55

    const svg = d3.select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${size} ${size + 60}`)
      .attr('width', '100%')

    const g = svg.append('g')
      .attr('transform', `translate(${size / 2},${size / 2})`)

    const pie = d3.pie<typeof data[0]>()
      .value(d => d.count)
      .sort(null)
      .padAngle(0.03)

    const arc = d3.arc<d3.PieArcDatum<typeof data[0]>>()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .cornerRadius(5)

    const arcs = g.selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')

    arcs.append('path')
      .attr('fill', d => d.data.color)
      .attr('opacity', 0.85)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .each(function (d) {
        const interp = d3.interpolate({ startAngle: d.startAngle, endAngle: d.startAngle }, d)
        d3.select(this)
          .transition()
          .duration(800)
          .attrTween('d', () => t => arc(interp(t)) || '')
      })

    // Percentage labels
    const labelArc = d3.arc<d3.PieArcDatum<typeof data[0]>>()
      .innerRadius(radius * 0.78)
      .outerRadius(radius * 0.78)

    arcs.append('text')
      .attr('transform', d => `translate(${labelArc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('font-weight', '700')
      .style('fill', '#fff')
      .style('opacity', 0)
      .text(d => `${Math.round((d.data.count / 47) * 100)}%`)
      .transition()
      .delay(900)
      .duration(300)
      .style('opacity', 1)

    // Center
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', -6)
      .style('font-size', '28px')
      .style('font-weight', '800')
      .style('fill', '#00695C')
      .text('47')

    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 14)
      .style('font-size', '10px')
      .style('fill', '#666')
      .text('Active Opportunities')

    // Legend below
    const legendG = svg.append('g')
      .attr('transform', `translate(16, ${size + 10})`)

    data.forEach((d, i) => {
      const ly = i * 16
      legendG.append('rect').attr('x', 0).attr('y', ly).attr('width', 10).attr('height', 10).attr('rx', 2).attr('fill', d.color)
      legendG.append('text').attr('x', 16).attr('y', ly + 9).style('font-size', '10px').style('fill', '#555')
        .text(`${d.category} (${d.count})`)
    })

    return () => { container.innerHTML = '' }
  }, [])

  return <div ref={containerRef} style={{ width: '100%', maxWidth: 400, margin: '0 auto' }} />
}
