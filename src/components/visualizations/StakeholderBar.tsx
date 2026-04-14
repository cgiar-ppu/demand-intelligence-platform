import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const data = [
  { type: 'Government', count: 34, color: '#00695C' },
  { type: 'Research', count: 28, color: '#1565C0' },
  { type: 'Private Sector', count: 22, color: '#7B1FA2' },
  { type: 'Farmers', count: 18, color: '#F9A825' },
  { type: 'NGOs', count: 15, color: '#E64A19' },
  { type: 'Donors', count: 12, color: '#00838F' },
]

export default function StakeholderBar() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    container.innerHTML = ''

    const margin = { top: 10, right: 50, bottom: 10, left: 100 }
    const barH = 28
    const height = margin.top + data.length * barH + margin.bottom
    const width = container.clientWidth
    const innerW = width - margin.left - margin.right

    const svg = d3.select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3.scaleLinear().domain([0, 40]).range([0, innerW])
    const y = d3.scaleBand().domain(data.map(d => d.type)).range([0, data.length * barH]).padding(0.25)

    data.forEach((d, i) => {
      g.append('text')
        .attr('x', -8).attr('y', y(d.type)! + y.bandwidth() / 2 + 4)
        .attr('text-anchor', 'end')
        .style('font-size', '11px').style('fill', '#374151')
        .text(d.type)

      g.append('rect')
        .attr('x', 0).attr('y', y(d.type)!)
        .attr('width', 0).attr('height', y.bandwidth())
        .attr('fill', d.color).attr('rx', 3).attr('opacity', 0.8)
        .transition().duration(600).delay(i * 70)
        .attr('width', x(d.count))

      g.append('text')
        .attr('x', x(d.count) + 6).attr('y', y(d.type)! + y.bandwidth() / 2 + 4)
        .style('font-size', '11px').style('font-weight', '700').style('fill', '#374151')
        .style('opacity', 0).text(d.count)
        .transition().delay(i * 70 + 500).duration(200).style('opacity', 1)
    })

    return () => { container.innerHTML = '' }
  }, [])

  return <div ref={containerRef} style={{ width: '100%' }} />
}
