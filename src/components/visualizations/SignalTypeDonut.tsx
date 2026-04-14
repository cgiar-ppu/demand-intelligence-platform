import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const data = [
  { type: 'Expressed Demand', count: 99, color: '#00695C' },
  { type: 'Latent Demand', count: 62, color: '#1565C0' },
  { type: 'Policy-Driven', count: 49, color: '#F9A825' },
  { type: 'Market-Driven', count: 37, color: '#7B1FA2' },
]

export default function SignalTypeDonut() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    container.innerHTML = ''

    const size = Math.min(container.clientWidth, 420)
    const radius = size / 2 - 30
    const innerRadius = radius * 0.55

    const svg = d3.select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${size} ${size + 50}`)
      .attr('width', '100%')

    const g = svg.append('g')
      .attr('transform', `translate(${size / 2},${size / 2})`)

    const pie = d3.pie<typeof data[0]>()
      .value(d => d.count)
      .sort(null)

    const arc = d3.arc<d3.PieArcDatum<typeof data[0]>>()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .cornerRadius(4)
      .padAngle(0.02)

    const arcs = g.selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')

    arcs.append('path')
      .attr('d', arc)
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
      .text(d => `${Math.round((d.data.count / 247) * 100)}%`)
      .transition()
      .delay(900)
      .duration(300)
      .style('opacity', 1)

    // Center text
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', -8)
      .style('font-size', '28px')
      .style('font-weight', '800')
      .style('fill', '#00695C')
      .text('247')

    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 14)
      .style('font-size', '11px')
      .style('fill', '#666')
      .text('Signals Detected')

    // Legend
    const legendG = svg.append('g')
      .attr('transform', `translate(${size / 2 - 140}, ${size + 10})`)

    data.forEach((d, i) => {
      const lx = i * 72
      legendG.append('rect').attr('x', lx).attr('y', 0).attr('width', 10).attr('height', 10).attr('rx', 2).attr('fill', d.color)
      legendG.append('text').attr('x', lx + 14).attr('y', 9).style('font-size', '9px').style('fill', '#555').text(d.type)
    })

    return () => { container.innerHTML = '' }
  }, [])

  return <div ref={containerRef} style={{ width: '100%', maxWidth: 420, margin: '0 auto' }} />
}
