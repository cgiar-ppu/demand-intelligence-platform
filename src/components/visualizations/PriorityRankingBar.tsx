import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const data = [
  { zone: 'Northern Nigeria - Maize', score: 4.8, country: 'Nigeria' },
  { zone: 'Rangpur Bangladesh - Rice', score: 4.5, country: 'Bangladesh' },
  { zone: 'Western Kenya - Dairy', score: 4.2, country: 'Kenya' },
  { zone: 'NW Nigeria - Sorghum', score: 4.1, country: 'Nigeria' },
  { zone: 'Sylhet Bangladesh - Rice', score: 4.0, country: 'Bangladesh' },
  { zone: 'Rift Valley Kenya - Wheat', score: 3.9, country: 'Kenya' },
  { zone: 'NE Nigeria - Cowpea', score: 3.8, country: 'Nigeria' },
  { zone: 'Khulna Bangladesh - Fish', score: 3.7, country: 'Bangladesh' },
  { zone: 'Central Kenya - Potato', score: 3.5, country: 'Kenya' },
  { zone: 'South Nigeria - Cassava', score: 3.4, country: 'Nigeria' },
]

const countryColors: Record<string, string> = {
  Nigeria: '#00695C',
  Bangladesh: '#1565C0',
  Kenya: '#F9A825',
}

export default function PriorityRankingBar() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    container.innerHTML = ''

    const margin = { top: 20, right: 60, bottom: 30, left: 200 }
    const barH = 32
    const height = margin.top + data.length * barH + margin.bottom
    const width = container.clientWidth
    const innerW = width - margin.left - margin.right

    const svg = d3.select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3.scaleLinear().domain([0, 5]).range([0, innerW])
    const y = d3.scaleBand().domain(data.map(d => d.zone)).range([0, data.length * barH]).padding(0.25)

    // Grid lines
    g.append('g')
      .call(d3.axisBottom(x).ticks(5).tickSize(data.length * barH).tickFormat(() => ''))
      .attr('stroke-opacity', 0.1)
      .select('.domain').remove()

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${data.length * barH})`)
      .call(d3.axisBottom(x).ticks(5))
      .selectAll('text')
      .style('font-size', '10px')

    // Bars
    data.forEach((d, i) => {
      g.append('rect')
        .attr('x', 0)
        .attr('y', y(d.zone)!)
        .attr('width', 0)
        .attr('height', y.bandwidth())
        .attr('fill', countryColors[d.country])
        .attr('rx', 3)
        .attr('opacity', 0.85)
        .transition()
        .duration(800)
        .delay(i * 60)
        .attr('width', x(d.score))

      // Label
      g.append('text')
        .attr('x', -8)
        .attr('y', y(d.zone)! + y.bandwidth() / 2 + 4)
        .attr('text-anchor', 'end')
        .style('font-size', '11px')
        .style('fill', '#374151')
        .text(d.zone)

      // Score
      g.append('text')
        .attr('x', x(d.score) + 6)
        .attr('y', y(d.zone)! + y.bandwidth() / 2 + 4)
        .style('font-size', '11px')
        .style('font-weight', '700')
        .style('fill', '#374151')
        .style('opacity', 0)
        .text(d.score.toFixed(1))
        .transition()
        .delay(i * 60 + 600)
        .duration(300)
        .style('opacity', 1)
    })

    // Legend
    const legendG = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${height - 8})`)

    Object.entries(countryColors).forEach(([country, color], i) => {
      legendG.append('rect').attr('x', i * 110).attr('y', 0).attr('width', 10).attr('height', 10).attr('rx', 2).attr('fill', color)
      legendG.append('text').attr('x', i * 110 + 14).attr('y', 9).style('font-size', '10px').style('fill', '#555').text(country)
    })

    return () => { container.innerHTML = '' }
  }, [])

  return <div ref={containerRef} style={{ width: '100%' }} />
}
