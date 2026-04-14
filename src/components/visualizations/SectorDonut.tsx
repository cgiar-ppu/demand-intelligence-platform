import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const data = [
  { sector: 'Agriculture', pct: 45, color: '#00695C' },
  { sector: 'Water', pct: 20, color: '#1565C0' },
  { sector: 'Climate', pct: 18, color: '#F9A825' },
  { sector: 'Food Systems', pct: 12, color: '#7B1FA2' },
  { sector: 'Other', pct: 5, color: '#9e9e9e' },
]

export default function SectorDonut() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    container.innerHTML = ''

    const size = Math.min(container.clientWidth, 320)
    const radius = size / 2 - 20
    const innerRadius = radius * 0.5

    const svg = d3.select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${size} ${size + 30}`)
      .attr('width', '100%')

    const g = svg.append('g')
      .attr('transform', `translate(${size / 2},${size / 2})`)

    const pie = d3.pie<typeof data[0]>().value(d => d.pct).sort(null).padAngle(0.02)
    const arc = d3.arc<d3.PieArcDatum<typeof data[0]>>().innerRadius(innerRadius).outerRadius(radius).cornerRadius(3)

    g.selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('fill', d => d.data.color)
      .attr('opacity', 0.85)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .each(function (d) {
        const interp = d3.interpolate({ startAngle: d.startAngle, endAngle: d.startAngle }, d)
        d3.select(this).transition().duration(700).attrTween('d', () => t => arc(interp(t)) || '')
      })

    const labelArc = d3.arc<d3.PieArcDatum<typeof data[0]>>().innerRadius(radius * 0.76).outerRadius(radius * 0.76)
    g.selectAll('.label')
      .data(pie(data))
      .enter()
      .append('text')
      .attr('transform', d => `translate(${labelArc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .style('font-size', '9px').style('font-weight', '700').style('fill', '#fff')
      .style('opacity', 0)
      .text(d => `${d.data.pct}%`)
      .transition().delay(800).duration(300).style('opacity', 1)

    const legendG = svg.append('g').attr('transform', `translate(10, ${size + 6})`)
    data.forEach((d, i) => {
      const lx = i * (size / 5.2)
      legendG.append('rect').attr('x', lx).attr('y', 0).attr('width', 8).attr('height', 8).attr('rx', 2).attr('fill', d.color)
      legendG.append('text').attr('x', lx + 12).attr('y', 8).style('font-size', '8px').style('fill', '#555').text(d.sector)
    })

    return () => { container.innerHTML = '' }
  }, [])

  return <div ref={containerRef} style={{ width: '100%', maxWidth: 320, margin: '0 auto' }} />
}
