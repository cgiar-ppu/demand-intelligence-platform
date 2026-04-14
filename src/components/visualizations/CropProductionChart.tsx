import { useEffect, useRef, useMemo } from 'react'
import * as d3 from 'd3'
import { getCropHectaresByCountry } from '../../data/glomipData'

function formatHectares(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return n.toString()
}

const TARGET_COUNTRIES = ['Nigeria', 'Bangladesh', 'Kenya']

export default function CropProductionChart() {
  const containerRef = useRef<HTMLDivElement>(null)

  const countryData = useMemo(() => getCropHectaresByCountry(TARGET_COUNTRIES), [])

  // Get all unique crops across our countries, sorted by max hectares
  const allCrops = useMemo(() => {
    const cropMax = new Map<string, number>()
    countryData.forEach((c) => {
      c.crops.forEach((cr) => {
        cropMax.set(cr.crop, Math.max(cropMax.get(cr.crop) ?? 0, cr.hectares))
      })
    })
    return Array.from(cropMax.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([crop]) => crop)
      .slice(0, 12) // Top 12 crops for readability
  }, [countryData])

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    container.innerHTML = ''

    const margin = { top: 30, right: 20, bottom: 80, left: 75 }
    const width = container.clientWidth
    const height = 420
    const innerW = width - margin.left - margin.right
    const innerH = height - margin.top - margin.bottom

    const svg = d3
      .select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Scales
    const x0 = d3.scaleBand().domain(allCrops).range([0, innerW]).paddingInner(0.2)
    const x1 = d3
      .scaleBand()
      .domain(countryData.map((c) => c.country))
      .range([0, x0.bandwidth()])
      .padding(0.08)

    const maxHa = d3.max(countryData, (c) =>
      d3.max(c.crops.filter((cr) => allCrops.includes(cr.crop)), (cr) => cr.hectares)
    ) || 1

    const y = d3.scaleLinear().domain([0, maxHa * 1.1]).range([innerH, 0])

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${innerH})`)
      .call(d3.axisBottom(x0).tickSizeOuter(0))
      .selectAll('text')
      .style('font-size', '11px')
      .style('font-weight', '600')
      .attr('transform', 'rotate(-25)')
      .attr('text-anchor', 'end')

    // Y axis
    g.append('g')
      .call(d3.axisLeft(y).ticks(6).tickFormat((d) => formatHectares(d as number)))
      .selectAll('text')
      .style('font-size', '10px')

    // Y axis label
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -60)
      .attr('x', -innerH / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('fill', '#666')
      .text('Area Harvested (hectares)')

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .call(
        d3
          .axisLeft(y)
          .ticks(6)
          .tickSize(-innerW)
          .tickFormat(() => '')
      )
      .selectAll('line')
      .attr('stroke', '#e5e7eb')
      .attr('stroke-dasharray', '3,3')

    g.selectAll('.grid .domain').remove()

    // Bars
    countryData.forEach((country) => {
      const barGroup = g.append('g')
      const cropsInChart = country.crops.filter((cr) => allCrops.includes(cr.crop))

      cropsInChart.forEach((crop) => {
        const xPos = x0(crop.crop)
        const x1Pos = x1(country.country)
        if (xPos === undefined || x1Pos === undefined) return

        barGroup
          .append('rect')
          .attr('x', xPos + x1Pos)
          .attr('y', innerH)
          .attr('width', x1.bandwidth())
          .attr('height', 0)
          .attr('fill', country.color)
          .attr('rx', 2)
          .transition()
          .duration(800)
          .delay(allCrops.indexOf(crop.crop) * 60)
          .attr('y', y(crop.hectares))
          .attr('height', innerH - y(crop.hectares))

        // Value label
        if (crop.hectares > maxHa * 0.05) {
          barGroup
            .append('text')
            .attr('x', xPos + x1Pos + x1.bandwidth() / 2)
            .attr('y', y(crop.hectares) - 4)
            .attr('text-anchor', 'middle')
            .style('font-size', '8px')
            .style('fill', '#666')
            .style('opacity', 0)
            .text(formatHectares(crop.hectares))
            .transition()
            .delay(800 + allCrops.indexOf(crop.crop) * 60)
            .duration(300)
            .style('opacity', 1)
        }
      })
    })

    // Legend
    const legend = svg
      .append('g')
      .attr('transform', `translate(${margin.left + innerW / 2 - 120},${height - 18})`)

    countryData.forEach((country, i) => {
      const lx = i * 100
      legend
        .append('rect')
        .attr('x', lx)
        .attr('y', 0)
        .attr('width', 12)
        .attr('height', 12)
        .attr('rx', 2)
        .attr('fill', country.color)
      legend
        .append('text')
        .attr('x', lx + 16)
        .attr('y', 10)
        .style('font-size', '11px')
        .style('fill', '#333')
        .text(country.country)
    })

    return () => {
      container.innerHTML = ''
    }
  }, [allCrops, countryData])

  return (
    <div ref={containerRef} style={{ width: '100%' }} />
  )
}
