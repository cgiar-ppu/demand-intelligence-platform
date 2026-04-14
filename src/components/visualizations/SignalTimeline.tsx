import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const signals = [
  { name: 'Nigeria Ag Policy Review', country: 'Nigeria', start: '2024-01', end: '2024-06', strength: 4.2 },
  { name: 'Bangladesh Delta Plan Update', country: 'Bangladesh', start: '2024-02', end: '2024-09', strength: 4.5 },
  { name: 'Kenya Big 4 Assessment', country: 'Kenya', start: '2024-03', end: '2024-08', strength: 3.8 },
  { name: 'CAADP Biennial Review', country: 'Nigeria', start: '2024-04', end: '2024-10', strength: 3.5 },
  { name: 'Rice Value Chain Study', country: 'Bangladesh', start: '2024-05', end: '2025-01', strength: 4.0 },
  { name: 'Maize Demand Survey', country: 'Nigeria', start: '2024-06', end: '2025-02', strength: 4.8 },
  { name: 'Climate Adaptation Plan', country: 'Kenya', start: '2024-07', end: '2025-03', strength: 3.6 },
  { name: 'Seed Sector Assessment', country: 'Nigeria', start: '2024-08', end: '2025-04', strength: 4.1 },
  { name: 'Dairy Sector Analysis', country: 'Kenya', start: '2024-09', end: '2025-06', strength: 4.2 },
  { name: 'Digital Ag Strategy', country: 'Bangladesh', start: '2024-10', end: '2025-05', strength: 3.9 },
  { name: 'Cassava Processing Study', country: 'Nigeria', start: '2025-01', end: '2025-08', strength: 3.7 },
  { name: 'Nutrition Policy Review', country: 'Bangladesh', start: '2025-02', end: '2025-09', strength: 4.3 },
  { name: 'Potato Market Assessment', country: 'Kenya', start: '2025-03', end: '2025-10', strength: 3.4 },
  { name: 'Cowpea Demand Analysis', country: 'Nigeria', start: '2025-04', end: '2025-11', strength: 3.8 },
  { name: 'Aquaculture Demand Study', country: 'Bangladesh', start: '2025-06', end: '2026-01', strength: 4.0 },
  { name: 'Sorghum Value Chain', country: 'Nigeria', start: '2025-07', end: '2026-02', strength: 3.6 },
  { name: 'Livestock Feed Analysis', country: 'Kenya', start: '2025-08', end: '2026-03', strength: 3.5 },
  { name: 'Wheat Import Substitution', country: 'Nigeria', start: '2025-09', end: '2026-04', strength: 4.4 },
]

const countryColors: Record<string, string> = {
  Nigeria: '#00695C',
  Bangladesh: '#1565C0',
  Kenya: '#F9A825',
}

export default function SignalTimeline() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    container.innerHTML = ''

    const margin = { top: 30, right: 20, bottom: 40, left: 190 }
    const rowH = 24
    const height = margin.top + signals.length * rowH + margin.bottom
    const width = container.clientWidth
    const innerW = width - margin.left - margin.right

    const svg = d3.select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const parseDate = d3.timeParse('%Y-%m')
    const timeExtent = [parseDate('2024-01')!, parseDate('2026-04')!]
    const x = d3.scaleTime().domain(timeExtent).range([0, innerW])

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${signals.length * rowH})`)
      .call(d3.axisBottom(x).ticks(8).tickFormat(d3.timeFormat('%b %Y') as (d: d3.NumberValue) => string))
      .selectAll('text')
      .style('font-size', '9px')
      .attr('transform', 'rotate(-30)')
      .attr('text-anchor', 'end')

    // Grid
    g.append('g')
      .call(d3.axisBottom(x).ticks(8).tickSize(signals.length * rowH).tickFormat(() => ''))
      .attr('stroke-opacity', 0.08)
      .select('.domain').remove()

    signals.forEach((signal, i) => {
      const y = i * rowH
      const startDate = parseDate(signal.start)!
      const endDate = parseDate(signal.end)!
      const barWidth = x(endDate) - x(startDate)

      // Label
      g.append('text')
        .attr('x', -8)
        .attr('y', y + rowH / 2 + 3)
        .attr('text-anchor', 'end')
        .style('font-size', '9px')
        .style('fill', '#374151')
        .text(signal.name)

      // Bar
      g.append('rect')
        .attr('x', x(startDate))
        .attr('y', y + 4)
        .attr('width', 0)
        .attr('height', rowH - 8)
        .attr('fill', countryColors[signal.country])
        .attr('rx', 3)
        .attr('opacity', 0.7 + (signal.strength - 3) * 0.15)
        .transition()
        .duration(600)
        .delay(i * 40)
        .attr('width', barWidth)

      // Strength dot
      g.append('circle')
        .attr('cx', x(endDate))
        .attr('cy', y + rowH / 2)
        .attr('r', 0)
        .attr('fill', countryColors[signal.country])
        .transition()
        .delay(i * 40 + 500)
        .duration(300)
        .attr('r', signal.strength)
    })

    // Legend
    const legendG = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${height - 12})`)

    Object.entries(countryColors).forEach(([name, color], i) => {
      legendG.append('rect').attr('x', i * 110).attr('y', 0).attr('width', 10).attr('height', 10).attr('rx', 2).attr('fill', color)
      legendG.append('text').attr('x', i * 110 + 14).attr('y', 9).style('font-size', '10px').style('fill', '#555').text(name)
    })

    return () => { container.innerHTML = '' }
  }, [])

  return <div ref={containerRef} style={{ width: '100%' }} />
}
