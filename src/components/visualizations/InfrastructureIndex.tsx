import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const countries = [
  { name: 'Nigeria', values: { Roads: 42, Irrigation: 28, Energy: 38, Digital: 52 }, color: '#00695C' },
  { name: 'Bangladesh', values: { Roads: 48, Irrigation: 62, Energy: 55, Digital: 45 }, color: '#1565C0' },
  { name: 'Kenya', values: { Roads: 45, Irrigation: 22, Energy: 42, Digital: 58 }, color: '#F9A825' },
]

const categories = ['Roads', 'Irrigation', 'Energy', 'Digital']

export default function InfrastructureIndex() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    container.innerHTML = ''

    const margin = { top: 20, right: 20, bottom: 50, left: 45 }
    const width = container.clientWidth
    const height = 280
    const innerW = width - margin.left - margin.right
    const innerH = height - margin.top - margin.bottom

    const svg = d3.select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const x0 = d3.scaleBand().domain(categories).range([0, innerW]).paddingInner(0.2)
    const x1 = d3.scaleBand().domain(countries.map(c => c.name)).range([0, x0.bandwidth()]).padding(0.08)
    const y = d3.scaleLinear().domain([0, 100]).range([innerH, 0])

    g.append('g').attr('transform', `translate(0,${innerH})`).call(d3.axisBottom(x0).tickSizeOuter(0))
      .selectAll('text').style('font-size', '10px')

    g.append('g').call(d3.axisLeft(y).ticks(5)).selectAll('text').style('font-size', '9px')

    countries.forEach((country) => {
      categories.forEach((cat, ci) => {
        const val = country.values[cat as keyof typeof country.values]
        g.append('rect')
          .attr('x', (x0(cat) || 0) + (x1(country.name) || 0))
          .attr('y', innerH)
          .attr('width', x1.bandwidth())
          .attr('height', 0)
          .attr('fill', country.color)
          .attr('rx', 2)
          .attr('opacity', 0.8)
          .transition()
          .duration(600)
          .delay(ci * 80)
          .attr('y', y(val))
          .attr('height', innerH - y(val))
      })
    })

    const legendG = svg.append('g').attr('transform', `translate(${margin.left}, ${height - 14})`)
    countries.forEach((c, i) => {
      legendG.append('rect').attr('x', i * 100).attr('y', 0).attr('width', 10).attr('height', 10).attr('rx', 2).attr('fill', c.color)
      legendG.append('text').attr('x', i * 100 + 14).attr('y', 9).style('font-size', '10px').style('fill', '#555').text(c.name)
    })

    return () => { container.innerHTML = '' }
  }, [])

  return <div ref={containerRef} style={{ width: '100%' }} />
}
