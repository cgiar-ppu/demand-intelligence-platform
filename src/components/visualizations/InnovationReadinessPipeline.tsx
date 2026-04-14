import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const stages = [
  { stage: 'Discovery', count: 45, color: '#b2dfdb' },
  { stage: 'Proof of Concept', count: 32, color: '#80cbc4' },
  { stage: 'Piloting', count: 28, color: '#4db6ac' },
  { stage: 'Scaling', count: 18, color: '#26a69a' },
  { stage: 'Commercialized', count: 12, color: '#00695C' },
]

export default function InnovationReadinessPipeline() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    container.innerHTML = ''

    const margin = { top: 10, right: 50, bottom: 10, left: 120 }
    const barH = 28
    const height = margin.top + stages.length * barH + margin.bottom
    const width = container.clientWidth
    const innerW = width - margin.left - margin.right

    const svg = d3.select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const maxVal = d3.max(stages, s => s.count) || 1
    const x = d3.scaleLinear().domain([0, maxVal * 1.2]).range([0, innerW])
    const y = d3.scaleBand().domain(stages.map(s => s.stage)).range([0, stages.length * barH]).padding(0.2)

    stages.forEach((s, i) => {
      g.append('text')
        .attr('x', -8).attr('y', y(s.stage)! + y.bandwidth() / 2 + 4)
        .attr('text-anchor', 'end').style('font-size', '10px').style('fill', '#374151')
        .text(s.stage)

      g.append('rect')
        .attr('x', 0).attr('y', y(s.stage)!)
        .attr('width', 0).attr('height', y.bandwidth())
        .attr('fill', s.color).attr('rx', 3)
        .transition().duration(600).delay(i * 100)
        .attr('width', x(s.count))

      g.append('text')
        .attr('x', x(s.count) + 6).attr('y', y(s.stage)! + y.bandwidth() / 2 + 4)
        .style('font-size', '10px').style('font-weight', '700').style('fill', '#374151')
        .style('opacity', 0).text(s.count)
        .transition().delay(i * 100 + 500).duration(200).style('opacity', 1)
    })

    return () => { container.innerHTML = '' }
  }, [])

  return <div ref={containerRef} style={{ width: '100%' }} />
}
