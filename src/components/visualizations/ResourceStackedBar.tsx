import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const data = [
  { country: 'Nigeria', government: 45, donors: 32, private: 18, cgiar: 12 },
  { country: 'Bangladesh', government: 38, donors: 28, private: 15, cgiar: 14 },
  { country: 'Kenya', government: 22, donors: 25, private: 20, cgiar: 10 },
]

const sources = ['Government', 'Donors', 'Private', 'CGIAR']
const sourceKeys = ['government', 'donors', 'private', 'cgiar'] as const
const colors = ['#2e7d32', '#1565C0', '#7B1FA2', '#00695C']

export default function ResourceStackedBar() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    container.innerHTML = ''

    const margin = { top: 10, right: 40, bottom: 40, left: 90 }
    const barH = 35
    const height = margin.top + data.length * barH + margin.bottom + 10
    const width = container.clientWidth
    const innerW = width - margin.left - margin.right

    const svg = d3.select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const maxTotal = d3.max(data, d => d.government + d.donors + d.private + d.cgiar) || 1
    const x = d3.scaleLinear().domain([0, maxTotal * 1.15]).range([0, innerW])
    const y = d3.scaleBand().domain(data.map(d => d.country)).range([0, data.length * barH]).padding(0.25)

    g.append('g').attr('transform', `translate(0,${data.length * barH})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d => `$${d}M`))
      .selectAll('text').style('font-size', '9px')

    data.forEach((row, ri) => {
      g.append('text')
        .attr('x', -8).attr('y', y(row.country)! + y.bandwidth() / 2 + 4)
        .attr('text-anchor', 'end').style('font-size', '11px').style('font-weight', '600').style('fill', '#1f2937')
        .text(row.country)

      let cumX = 0
      sourceKeys.forEach((key, ki) => {
        const val = row[key]
        g.append('rect')
          .attr('x', x(cumX)).attr('y', y(row.country)!)
          .attr('width', 0).attr('height', y.bandwidth())
          .attr('fill', colors[ki]).attr('opacity', 0.8)
          .transition().duration(500).delay(ri * 80 + ki * 80)
          .attr('width', x(val))
        cumX += val
      })

      g.append('text')
        .attr('x', x(cumX) + 6).attr('y', y(row.country)! + y.bandwidth() / 2 + 4)
        .style('font-size', '10px').style('font-weight', '700').style('fill', '#374151')
        .style('opacity', 0).text(`$${cumX}M`)
        .transition().delay(ri * 80 + 400).duration(200).style('opacity', 1)
    })

    const legendG = svg.append('g').attr('transform', `translate(${margin.left}, ${height - 14})`)
    sources.forEach((s, i) => {
      legendG.append('rect').attr('x', i * 85).attr('y', 0).attr('width', 10).attr('height', 10).attr('rx', 2).attr('fill', colors[i])
      legendG.append('text').attr('x', i * 85 + 14).attr('y', 9).style('font-size', '9px').style('fill', '#555').text(s)
    })

    return () => { container.innerHTML = '' }
  }, [])

  return <div ref={containerRef} style={{ width: '100%' }} />
}
