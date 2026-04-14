import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const innovations = [
  { name: 'Drought-tolerant maize', cost: 2.1, impact: 35, confidence: 85, crop: 'Maize' },
  { name: 'Climate-smart rice', cost: 3.5, impact: 42, confidence: 78, crop: 'Rice' },
  { name: 'Biofortified cassava', cost: 1.8, impact: 28, confidence: 82, crop: 'Cassava' },
  { name: 'Digital advisory', cost: 1.2, impact: 18, confidence: 70, crop: 'Digital' },
  { name: 'Improved sorghum', cost: 2.8, impact: 22, confidence: 75, crop: 'Sorghum' },
  { name: 'Wheat rust resistant', cost: 4.2, impact: 38, confidence: 88, crop: 'Wheat' },
  { name: 'Cowpea varieties', cost: 1.5, impact: 15, confidence: 72, crop: 'Cowpea' },
  { name: 'Potato cold storage', cost: 5.8, impact: 12, confidence: 65, crop: 'Potato' },
  { name: 'Rice seed systems', cost: 3.0, impact: 30, confidence: 80, crop: 'Rice' },
  { name: 'Maize mechanization', cost: 6.5, impact: 25, confidence: 60, crop: 'Maize' },
  { name: 'Cassava processing', cost: 4.0, impact: 20, confidence: 68, crop: 'Cassava' },
  { name: 'Soil health toolkit', cost: 0.8, impact: 22, confidence: 74, crop: 'Digital' },
  { name: 'Millet varieties', cost: 1.0, impact: 10, confidence: 66, crop: 'Millet' },
  { name: 'Aquaculture systems', cost: 7.2, impact: 32, confidence: 55, crop: 'Fish' },
  { name: 'Fertilizer micro-dose', cost: 0.5, impact: 16, confidence: 78, crop: 'Sorghum' },
  { name: 'Market info platform', cost: 1.8, impact: 14, confidence: 62, crop: 'Digital' },
]

const cropColors: Record<string, string> = {
  Maize: '#00695C',
  Rice: '#1565C0',
  Cassava: '#7B1FA2',
  Sorghum: '#F9A825',
  Wheat: '#E64A19',
  Cowpea: '#00838F',
  Potato: '#6D4C41',
  Digital: '#455A64',
  Millet: '#827717',
  Fish: '#0277BD',
}

export default function CostBenefitMatrix() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    container.innerHTML = ''

    const margin = { top: 30, right: 30, bottom: 60, left: 60 }
    const width = container.clientWidth
    const height = 450
    const innerW = width - margin.left - margin.right
    const innerH = height - margin.top - margin.bottom

    const svg = d3.select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3.scaleLinear().domain([0, 10]).range([0, innerW])
    const y = d3.scaleLinear().domain([0, 50]).range([innerH, 0])
    const rScale = d3.scaleSqrt().domain([50, 90]).range([5, 18])

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${innerH})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d => `$${d}M`))
      .selectAll('text').style('font-size', '10px')

    g.append('g')
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${d}M`))
      .selectAll('text').style('font-size', '10px')

    // Axis labels
    g.append('text')
      .attr('x', innerW / 2).attr('y', innerH + 40)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px').style('fill', '#666')
      .text('Implementation Cost ($M)')

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -45).attr('x', -innerH / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px').style('fill', '#666')
      .text('Expected Impact (Beneficiaries, Millions)')

    // Quadrant lines
    const midX = 5
    const midY = 25

    g.append('line')
      .attr('x1', x(midX)).attr('x2', x(midX))
      .attr('y1', 0).attr('y2', innerH)
      .attr('stroke', '#ccc').attr('stroke-dasharray', '5,5')

    g.append('line')
      .attr('x1', 0).attr('x2', innerW)
      .attr('y1', y(midY)).attr('y2', y(midY))
      .attr('stroke', '#ccc').attr('stroke-dasharray', '5,5')

    // Quadrant labels
    const qlabels = [
      { text: 'Quick Wins', x: innerW * 0.15, y: 16, color: '#2e7d32' },
      { text: 'Strategic Bets', x: innerW * 0.80, y: 16, color: '#1565C0' },
      { text: 'Efficiency Plays', x: innerW * 0.15, y: innerH - 8, color: '#F9A825' },
      { text: 'Low Priority', x: innerW * 0.80, y: innerH - 8, color: '#999' },
    ]

    qlabels.forEach(ql => {
      g.append('text')
        .attr('x', ql.x).attr('y', ql.y)
        .attr('text-anchor', 'middle')
        .style('font-size', '10px')
        .style('font-weight', '700')
        .style('fill', ql.color)
        .style('opacity', 0.6)
        .text(ql.text)
    })

    // Dots
    innovations.forEach((inn, i) => {
      g.append('circle')
        .attr('cx', x(inn.cost))
        .attr('cy', y(inn.impact))
        .attr('r', 0)
        .attr('fill', cropColors[inn.crop] || '#999')
        .attr('opacity', 0.7)
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .transition()
        .duration(500)
        .delay(i * 50)
        .attr('r', rScale(inn.confidence))

      // Label top innovations
      if (inn.impact > 25 || inn.cost < 1.5) {
        g.append('text')
          .attr('x', x(inn.cost))
          .attr('y', y(inn.impact) - rScale(inn.confidence) - 4)
          .attr('text-anchor', 'middle')
          .style('font-size', '8px')
          .style('fill', '#374151')
          .style('opacity', 0)
          .text(inn.name)
          .transition()
          .delay(i * 50 + 400)
          .duration(300)
          .style('opacity', 1)
      }
    })

    return () => { container.innerHTML = '' }
  }, [])

  return <div ref={containerRef} style={{ width: '100%' }} />
}
