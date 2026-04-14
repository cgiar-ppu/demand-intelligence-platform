import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const steps = [
  { label: 'Total Signals', value: 247, type: 'total' as const },
  { label: 'No Innovation Match', value: -62, type: 'loss' as const },
  { label: 'Policy Barriers', value: -38, type: 'loss' as const },
  { label: 'Finance Gaps', value: -29, type: 'loss' as const },
  { label: 'Capacity Gaps', value: -25, type: 'loss' as const },
  { label: 'Market Barriers', value: -18, type: 'loss' as const },
  { label: 'Infrastructure', value: -15, type: 'loss' as const },
  { label: 'Scaling-Ready', value: 60, type: 'result' as const },
]

export default function GapWaterfall() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    container.innerHTML = ''

    const margin = { top: 30, right: 30, bottom: 80, left: 50 }
    const width = container.clientWidth
    const height = 400
    const innerW = width - margin.left - margin.right
    const innerH = height - margin.top - margin.bottom

    const svg = d3.select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3.scaleBand()
      .domain(steps.map(s => s.label))
      .range([0, innerW])
      .padding(0.25)

    const y = d3.scaleLinear()
      .domain([0, 270])
      .range([innerH, 0])

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${innerH})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .selectAll('text')
      .style('font-size', '9px')
      .attr('transform', 'rotate(-35)')
      .attr('text-anchor', 'end')

    // Y axis
    g.append('g')
      .call(d3.axisLeft(y).ticks(6))
      .selectAll('text').style('font-size', '10px')

    // Grid
    g.append('g')
      .call(d3.axisLeft(y).ticks(6).tickSize(-innerW).tickFormat(() => ''))
      .selectAll('line').attr('stroke', '#e5e7eb').attr('stroke-dasharray', '3,3')
    g.selectAll('.domain').filter((_, i) => i > 0).remove()

    let running = 247

    steps.forEach((step, i) => {
      const xPos = x(step.label)!
      let barTop: number
      let barHeight: number
      let color: string

      if (step.type === 'total') {
        barTop = y(step.value)
        barHeight = innerH - barTop
        color = '#00695C'
      } else if (step.type === 'result') {
        barTop = y(step.value)
        barHeight = innerH - barTop
        color = '#2e7d32'
      } else {
        const oldRunning = running
        running += step.value
        barTop = y(oldRunning)
        barHeight = y(running) - y(oldRunning)
        color = '#ef5350'
      }

      // Bar
      g.append('rect')
        .attr('x', xPos)
        .attr('y', y(0))
        .attr('width', x.bandwidth())
        .attr('height', 0)
        .attr('fill', color)
        .attr('rx', 3)
        .attr('opacity', 0.85)
        .transition()
        .duration(500)
        .delay(i * 120)
        .attr('y', barTop)
        .attr('height', barHeight)

      // Value label
      const labelVal = step.type === 'loss' ? step.value : (step.type === 'result' ? step.value : step.value)
      g.append('text')
        .attr('x', xPos + x.bandwidth() / 2)
        .attr('y', barTop - 6)
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('font-weight', '700')
        .style('fill', step.type === 'loss' ? '#c62828' : '#1b5e20')
        .style('opacity', 0)
        .text(labelVal > 0 ? labelVal : labelVal)
        .transition()
        .delay(i * 120 + 400)
        .duration(200)
        .style('opacity', 1)

      // Connector line
      if (i > 0 && i < steps.length - 1 && step.type === 'loss') {
        g.append('line')
          .attr('x1', xPos + x.bandwidth())
          .attr('x2', x(steps[i + 1].label)!)
          .attr('y1', y(running))
          .attr('y2', y(running))
          .attr('stroke', '#999')
          .attr('stroke-dasharray', '3,2')
          .attr('stroke-width', 1)
          .style('opacity', 0)
          .transition()
          .delay(i * 120 + 400)
          .duration(200)
          .style('opacity', 0.5)
      }
    })

    return () => { container.innerHTML = '' }
  }, [])

  return <div ref={containerRef} style={{ width: '100%' }} />
}
