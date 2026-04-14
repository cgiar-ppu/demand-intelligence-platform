import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const stages = [
  { stage: 'Discovery', count: 45, color: '#b2dfdb' },
  { stage: 'Proof of Concept', count: 32, color: '#4db6ac' },
  { stage: 'Piloting', count: 28, color: '#26a69a' },
  { stage: 'Scaling', count: 18, color: '#00897b' },
  { stage: 'Commercialized', count: 12, color: '#00695C' },
]

export default function InnovationPipeline() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    container.innerHTML = ''

    const width = container.clientWidth
    const height = 350

    const svg = d3.select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')

    const maxCount = stages[0].count
    const stageH = 50
    const gap = 8
    const startY = 30

    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 18)
      .attr('text-anchor', 'middle')
      .style('font-size', '13px')
      .style('font-weight', '700')
      .style('fill', '#374151')
      .text('135 Innovations Across the Pipeline')

    stages.forEach((stage, i) => {
      const y = startY + i * (stageH + gap)
      const barWidth = (stage.count / maxCount) * (width * 0.7)
      const x = (width - barWidth) / 2

      // Funnel trapezoid
      const nextWidth = i < stages.length - 1
        ? (stages[i + 1].count / maxCount) * (width * 0.7)
        : barWidth * 0.8

      const nextX = (width - nextWidth) / 2

      // Main bar
      svg.append('rect')
        .attr('x', x)
        .attr('y', y)
        .attr('width', 0)
        .attr('height', stageH)
        .attr('fill', stage.color)
        .attr('rx', 6)
        .transition()
        .duration(600)
        .delay(i * 150)
        .attr('width', barWidth)
        .attr('x', x)

      // Connector trapezoid
      if (i < stages.length - 1) {
        svg.append('polygon')
          .attr('points', `${x},${y + stageH} ${x + barWidth},${y + stageH} ${nextX + nextWidth},${y + stageH + gap} ${nextX},${y + stageH + gap}`)
          .attr('fill', stage.color)
          .attr('opacity', 0.3)
          .style('opacity', 0)
          .transition()
          .delay(i * 150 + 400)
          .duration(300)
          .style('opacity', 0.3)
      }

      // Stage name
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', y + stageH / 2 - 4)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('font-weight', '700')
        .style('fill', i >= 2 ? '#fff' : '#1f2937')
        .style('opacity', 0)
        .text(stage.stage)
        .transition()
        .delay(i * 150 + 300)
        .duration(300)
        .style('opacity', 1)

      // Count
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', y + stageH / 2 + 14)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('font-weight', '800')
        .style('fill', i >= 2 ? '#fff' : '#00695C')
        .style('opacity', 0)
        .text(stage.count)
        .transition()
        .delay(i * 150 + 300)
        .duration(300)
        .style('opacity', 1)
    })

    return () => { container.innerHTML = '' }
  }, [])

  return <div ref={containerRef} style={{ width: '100%' }} />
}
