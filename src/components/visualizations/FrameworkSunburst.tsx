import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface SunburstNode {
  name: string
  color: string
  description: string
  children?: SunburstNode[]
}

const data: SunburstNode = {
  name: 'Scaling Opportunity',
  color: '#00695C',
  description: 'The convergence of all demand dimensions into actionable scaling intelligence',
  children: [
    {
      name: 'Geography & Priority',
      color: '#0277BD',
      description: 'Where should CGIAR focus its scaling efforts?',
      children: [
        { name: 'Scaling Context', color: '#F9A825', description: 'Conditions shaping how innovations can be taken to scale' },
      ],
    },
    {
      name: 'Demand Signals',
      color: '#00838F',
      description: 'What do countries, funders, and partners actually need?',
      children: [
        { name: 'Sector', color: '#EF6C00', description: 'Sector-specific dynamics shaping demand for agricultural innovation' },
        { name: 'Stakeholders', color: '#FF8F00', description: 'Key actors and their expressed needs and priorities' },
      ],
    },
    {
      name: 'Innovation Supply',
      color: '#00695C',
      description: 'What innovations does CGIAR have ready to offer?',
      children: [
        { name: 'Innovation Portfolio', color: '#D84315', description: 'Available innovations and their readiness for scaling' },
      ],
    },
    {
      name: 'Demand Gaps',
      color: '#1565C0',
      description: 'Where does demand exceed available innovation supply?',
      children: [
        { name: 'Stakeholders (gaps)', color: '#FF8F00', description: 'Unmet stakeholder needs revealing demand gaps' },
        { name: 'Market Intelligence (gaps)', color: '#E65100', description: 'Market-driven gaps between supply and demand' },
      ],
    },
    {
      name: 'Investment Feasibility',
      color: '#004D40',
      description: 'What is realistic given resources, partnerships, and capacity?',
      children: [
        { name: 'Enabling Environment', color: '#FBC02D', description: 'Policy and institutional conditions enabling or constraining scaling' },
        { name: 'Resource & Investment', color: '#F57F17', description: 'Available funding, infrastructure, and resource gaps' },
        { name: 'Market Intelligence', color: '#E65100', description: 'Market dynamics and commercial viability pathways' },
      ],
    },
  ],
}

export default function FrameworkSunburst() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    container.innerHTML = ''

    const width = Math.min(container.clientWidth, 700)
    const height = width
    const radius = width / 2

    const svg = d3.select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', '100%')
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`)

    const hierarchy = d3.hierarchy(data)
      .sum(() => 1)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))

    const partition = d3.partition<SunburstNode>()
      .size([2 * Math.PI, radius])

    const root = partition(hierarchy)

    const arc = d3.arc<d3.HierarchyRectangularNode<SunburstNode>>()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .padAngle(0.02)
      .padRadius(radius / 3)
      .innerRadius(d => {
        if (d.depth === 0) return 0
        if (d.depth === 1) return radius * 0.25
        return radius * 0.52
      })
      .outerRadius(d => {
        if (d.depth === 0) return radius * 0.22
        if (d.depth === 1) return radius * 0.50
        return radius * 0.78
      })

    // Tooltip
    const tooltip = d3.select(container)
      .append('div')
      .style('position', 'absolute')
      .style('background', 'rgba(0,0,0,0.85)')
      .style('color', '#fff')
      .style('padding', '8px 12px')
      .style('border-radius', '6px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('max-width', '220px')
      .style('z-index', '10')

    const paths = svg.selectAll('path')
      .data(root.descendants())
      .join('path')
      .attr('d', arc as never)
      .style('fill', d => d.data.color)
      .style('stroke', '#fff')
      .style('stroke-width', 1.5)
      .style('cursor', 'pointer')
      .style('opacity', 0)

    // Animate in
    paths.transition()
      .duration(1000)
      .delay((_d, i) => i * 60)
      .style('opacity', 1)

    paths
      .on('mouseover', function (event: MouseEvent, d) {
        d3.select(this).style('opacity', 0.8)
        tooltip
          .style('opacity', 1)
          .html(`<strong>${d.data.name}</strong><br/>${d.data.description}`)
          .style('left', `${event.offsetX + 10}px`)
          .style('top', `${event.offsetY - 10}px`)
      })
      .on('mousemove', function (event: MouseEvent) {
        tooltip
          .style('left', `${event.offsetX + 10}px`)
          .style('top', `${event.offsetY - 10}px`)
      })
      .on('mouseout', function () {
        d3.select(this).style('opacity', 1)
        tooltip.style('opacity', 0)
      })

    // Add text labels for middle ring (dimensions)
    const middleNodes = root.descendants().filter(d => d.depth === 1)
    svg.selectAll('text.dimension-label')
      .data(middleNodes)
      .join('text')
      .attr('class', 'dimension-label')
      .attr('transform', d => {
        const angle = (d.x0 + d.x1) / 2
        const r = radius * 0.375
        const x = Math.sin(angle) * r
        const y = -Math.cos(angle) * r
        const rotation = (angle * 180 / Math.PI) - 90 + (angle > Math.PI ? 180 : 0)
        return `translate(${x},${y}) rotate(${rotation})`
      })
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('font-size', '8px')
      .style('font-weight', '600')
      .style('fill', '#fff')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .text(d => d.data.name)
      .transition()
      .delay(1200)
      .duration(400)
      .style('opacity', 1)

    // Center label
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('font-size', '11px')
      .style('font-weight', '700')
      .style('fill', '#fff')
      .style('pointer-events', 'none')
      .text('Scaling')
      .style('opacity', 0)
      .transition()
      .delay(600)
      .duration(400)
      .style('opacity', 1)

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('dy', '14')
      .style('font-size', '11px')
      .style('font-weight', '700')
      .style('fill', '#fff')
      .style('pointer-events', 'none')
      .text('Opportunity')
      .style('opacity', 0)
      .transition()
      .delay(600)
      .duration(400)
      .style('opacity', 1)

    return () => { container.innerHTML = '' }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', minWidth: 300, maxWidth: 700, margin: '0 auto', aspectRatio: '1' }}
    />
  )
}
