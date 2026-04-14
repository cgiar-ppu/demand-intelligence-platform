import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const countries = [
  {
    name: 'Nigeria',
    readiness: 52,
    color: '#00695C',
    metrics: { roi: 58, risk: 45, institutional: 48, market: 55 },
  },
  {
    name: 'Bangladesh',
    readiness: 61,
    color: '#1565C0',
    metrics: { roi: 68, risk: 55, institutional: 62, market: 59 },
  },
  {
    name: 'Kenya',
    readiness: 48,
    color: '#F9A825',
    metrics: { roi: 52, risk: 40, institutional: 45, market: 52 },
  },
]

const metricLabels = ['ROI Potential', 'Risk Level', 'Institutional', 'Market Ready']

export default function InvestmentScorecard() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    container.innerHTML = ''

    const cardWidth = Math.min(container.clientWidth / 3 - 16, 220)
    const totalWidth = countries.length * (cardWidth + 16)
    const height = 310

    const svg = d3.select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${totalWidth} ${height}`)
      .attr('width', '100%')

    countries.forEach((country, ci) => {
      const cx = ci * (cardWidth + 16) + cardWidth / 2
      const g = svg.append('g')

      // Card background
      g.append('rect')
        .attr('x', ci * (cardWidth + 16) + 4)
        .attr('y', 4)
        .attr('width', cardWidth - 8)
        .attr('height', height - 8)
        .attr('fill', '#fff')
        .attr('stroke', '#e5e7eb')
        .attr('rx', 10)
        .attr('filter', 'drop-shadow(0 1px 3px rgba(0,0,0,0.08))')

      // Country name
      g.append('text')
        .attr('x', cx)
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('font-weight', '700')
        .style('fill', '#1f2937')
        .text(country.name)

      // Progress ring
      const ringR = 50
      const ringY = 100

      const bgArc = d3.arc()
        .innerRadius(ringR - 8)
        .outerRadius(ringR)
        .startAngle(0)
        .endAngle(2 * Math.PI)

      g.append('path')
        .attr('transform', `translate(${cx},${ringY})`)
        .attr('d', bgArc({} as d3.DefaultArcObject) || '')
        .attr('fill', '#e5e7eb')

      const fgArc = d3.arc()
        .innerRadius(ringR - 8)
        .outerRadius(ringR)
        .startAngle(0)
        .cornerRadius(4)

      g.append('path')
        .attr('transform', `translate(${cx},${ringY})`)
        .attr('fill', country.color)
        .transition()
        .duration(1200)
        .delay(ci * 200)
        .attrTween('d', () => {
          const interp = d3.interpolate(0, (country.readiness / 100) * 2 * Math.PI)
          return (t: number) => fgArc({ endAngle: interp(t) } as d3.DefaultArcObject) || ''
        })

      // Percentage
      g.append('text')
        .attr('x', cx)
        .attr('y', ringY + 6)
        .attr('text-anchor', 'middle')
        .style('font-size', '22px')
        .style('font-weight', '800')
        .style('fill', country.color)
        .text(`${country.readiness}%`)

      // Mini metrics
      const metricValues = [country.metrics.roi, country.metrics.risk, country.metrics.institutional, country.metrics.market]
      const startY = 175
      const barW = cardWidth - 50
      const barStartX = ci * (cardWidth + 16) + 25

      metricLabels.forEach((label, mi) => {
        const my = startY + mi * 30

        g.append('text')
          .attr('x', barStartX)
          .attr('y', my)
          .style('font-size', '9px')
          .style('fill', '#6b7280')
          .text(label)

        // Background bar
        g.append('rect')
          .attr('x', barStartX)
          .attr('y', my + 4)
          .attr('width', barW)
          .attr('height', 8)
          .attr('fill', '#f1f5f9')
          .attr('rx', 4)

        // Value bar
        g.append('rect')
          .attr('x', barStartX)
          .attr('y', my + 4)
          .attr('width', 0)
          .attr('height', 8)
          .attr('fill', country.color)
          .attr('rx', 4)
          .attr('opacity', 0.7)
          .transition()
          .duration(800)
          .delay(ci * 200 + mi * 100)
          .attr('width', (metricValues[mi] / 100) * barW)

        // Value text
        g.append('text')
          .attr('x', barStartX + barW + 4)
          .attr('y', my + 12)
          .style('font-size', '9px')
          .style('font-weight', '700')
          .style('fill', '#374151')
          .text(metricValues[mi])
      })
    })

    return () => { container.innerHTML = '' }
  }, [])

  return <div ref={containerRef} style={{ width: '100%' }} />
}
