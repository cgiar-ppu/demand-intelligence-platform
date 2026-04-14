import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026]
const categories = ['Government', 'Donors', 'Private Sector', 'CGIAR']
const colors = ['#2e7d32', '#1565C0', '#7B1FA2', '#00695C']

const fundingData = [
  // Government, Donors, Private Sector, CGIAR
  [45, 62, 18, 28],   // 2020
  [52, 68, 22, 30],   // 2021
  [58, 72, 28, 32],   // 2022
  [68, 75, 35, 34],   // 2023
  [78, 78, 42, 36],   // 2024
  [92, 82, 50, 38],   // 2025
  [105, 85, 58, 40],  // 2026
]

export default function FundingLandscape() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    container.innerHTML = ''

    const margin = { top: 20, right: 30, bottom: 50, left: 60 }
    const width = container.clientWidth
    const height = 380
    const innerW = width - margin.left - margin.right
    const innerH = height - margin.top - margin.bottom

    const svg = d3.select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Transform data for d3.stack
    const stackData = years.map((year, i) => {
      const row: Record<string, number> = { year }
      categories.forEach((cat, ci) => { row[cat] = fundingData[i][ci] })
      return row
    })

    const stack = d3.stack<Record<string, number>>()
      .keys(categories)

    const series = stack(stackData)

    const x = d3.scaleLinear()
      .domain([2020, 2026])
      .range([0, innerW])

    const maxY = d3.max(series[series.length - 1], d => d[1]) || 200

    const y = d3.scaleLinear()
      .domain([0, maxY * 1.1])
      .range([innerH, 0])

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${innerH})`)
      .call(d3.axisBottom(x).ticks(7).tickFormat(d3.format('d')))
      .selectAll('text').style('font-size', '10px')

    g.append('g')
      .call(d3.axisLeft(y).ticks(6).tickFormat(d => `$${d}M`))
      .selectAll('text').style('font-size', '10px')

    // Grid
    g.append('g')
      .call(d3.axisLeft(y).ticks(6).tickSize(-innerW).tickFormat(() => ''))
      .selectAll('line').attr('stroke', '#e5e7eb').attr('stroke-dasharray', '3,3')
    g.selectAll('.grid .domain').remove()

    // Y label
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -45)
      .attr('x', -innerH / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('fill', '#666')
      .text('Funding ($M)')

    // Areas
    const area = d3.area<[number, number] & { data: Record<string, number> }>()
      .x(d => x(d.data.year))
      .y0(d => y(d[0]))
      .y1(d => y(d[1]))
      .curve(d3.curveMonotoneX)

    series.forEach((s, i) => {
      g.append('path')
        .datum(s)
        .attr('d', area as unknown as string)
        .attr('fill', colors[i])
        .attr('opacity', 0)
        .transition()
        .duration(800)
        .delay(i * 200)
        .attr('opacity', 0.65)
    })

    // Legend
    const legendG = svg.append('g')
      .attr('transform', `translate(${margin.left + innerW / 2 - 170}, ${height - 18})`)

    categories.forEach((cat, i) => {
      legendG.append('rect').attr('x', i * 110).attr('y', 0).attr('width', 12).attr('height', 12).attr('rx', 2).attr('fill', colors[i]).attr('opacity', 0.7)
      legendG.append('text').attr('x', i * 110 + 16).attr('y', 10).style('font-size', '10px').style('fill', '#555').text(cat)
    })

    return () => { container.innerHTML = '' }
  }, [])

  return <div ref={containerRef} style={{ width: '100%' }} />
}
