import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface SankeyNode {
  name: string
  x: number
  y: number
  color: string
}

interface SankeyLink {
  source: number
  target: number
  value: number
  color: string
}

const domainColors: Record<string, string> = {
  'Scaling Context': '#F9A825',
  'Sector': '#EF6C00',
  'Stakeholders': '#FF8F00',
  'Innovation Portfolio': '#D84315',
  'Enabling Environment': '#FBC02D',
  'Resource & Investment': '#F57F17',
  'Market Intelligence': '#E65100',
}

export default function DomainFlowSankey() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    container.innerHTML = ''

    const width = container.clientWidth || 900
    const height = 500
    const margin = { top: 20, right: 160, bottom: 20, left: 160 }
    const innerW = width - margin.left - margin.right
    const innerH = height - margin.top - margin.bottom

    const svg = d3.select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', '100%')

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    // Column x positions
    const colX = [0, innerW * 0.35, innerW * 0.65, innerW]

    // Nodes: 7 domains (left), 5 dimensions (right-center), 1 scaling opportunity (far right)
    const domainNames = [
      'Scaling Context', 'Sector', 'Stakeholders', 'Innovation Portfolio',
      'Enabling Environment', 'Resource & Investment', 'Market Intelligence'
    ]
    const dimensionNames = [
      'Geography & Priority', 'Demand Signals', 'Innovation Supply', 'Demand Gaps', 'Investment Feasibility'
    ]

    const nodeHeight = 28
    const domainSpacing = innerH / 7
    const dimSpacing = innerH / 5

    const nodes: SankeyNode[] = []

    // Domains (indices 0-6)
    domainNames.forEach((name, i) => {
      nodes.push({ name, x: colX[0], y: domainSpacing * i + domainSpacing / 2, color: domainColors[name] })
    })
    // Dimensions (indices 7-11)
    dimensionNames.forEach((name, i) => {
      nodes.push({ name, x: colX[2], y: dimSpacing * i + dimSpacing / 2, color: '#00838F' })
    })
    // Scaling Opportunity (index 12)
    nodes.push({ name: 'Scaling Opportunity', x: colX[3], y: innerH / 2, color: '#00695C' })

    // Links: domain index -> dimension index, value
    const links: SankeyLink[] = [
      { source: 0, target: 7, value: 8, color: domainColors['Scaling Context'] },   // Scaling Context -> Geography
      { source: 1, target: 8, value: 8, color: domainColors['Sector'] },            // Sector -> Demand Signals
      { source: 2, target: 8, value: 5, color: domainColors['Stakeholders'] },      // Stakeholders -> Demand Signals
      { source: 2, target: 10, value: 5, color: domainColors['Stakeholders'] },     // Stakeholders -> Demand Gaps
      { source: 3, target: 9, value: 8, color: domainColors['Innovation Portfolio'] }, // Innovation -> Innovation Supply
      { source: 4, target: 11, value: 8, color: domainColors['Enabling Environment'] }, // Enabling -> Investment
      { source: 4, target: 10, value: 3, color: domainColors['Enabling Environment'] }, // Enabling -> Demand Gaps
      { source: 5, target: 11, value: 8, color: domainColors['Resource & Investment'] }, // Resource -> Investment
      { source: 6, target: 11, value: 5, color: domainColors['Market Intelligence'] }, // Market -> Investment
      { source: 6, target: 10, value: 5, color: domainColors['Market Intelligence'] }, // Market -> Demand Gaps
      // Dimensions -> Scaling Opportunity
      { source: 7, target: 12, value: 5, color: '#0277BD' },
      { source: 8, target: 12, value: 5, color: '#00838F' },
      { source: 9, target: 12, value: 5, color: '#00695C' },
      { source: 10, target: 12, value: 5, color: '#1565C0' },
      { source: 11, target: 12, value: 5, color: '#004D40' },
    ]

    // Draw curved links
    const linkPaths = g.selectAll('path.link')
      .data(links)
      .join('path')
      .attr('class', 'link')
      .attr('d', d => {
        const sx = nodes[d.source].x + 60
        const sy = nodes[d.source].y
        const tx = nodes[d.target].x - 60
        const ty = nodes[d.target].y
        const mx = (sx + tx) / 2
        return `M${sx},${sy} C${mx},${sy} ${mx},${ty} ${tx},${ty}`
      })
      .attr('fill', 'none')
      .attr('stroke', d => d.color)
      .attr('stroke-width', d => Math.max(d.value * 1.5, 2))
      .attr('stroke-opacity', 0.35)
      .style('pointer-events', 'none')

    // Animate links
    linkPaths.each(function () {
      const path = this as SVGPathElement
      const length = path.getTotalLength()
      d3.select(path)
        .attr('stroke-dasharray', `${length} ${length}`)
        .attr('stroke-dashoffset', length)
        .transition()
        .duration(1500)
        .delay(300)
        .ease(d3.easeCubicInOut)
        .attr('stroke-dashoffset', 0)
    })

    // Draw nodes
    const nodeGroups = g.selectAll('g.node')
      .data(nodes)
      .join('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .style('opacity', 0)

    nodeGroups.transition()
      .duration(600)
      .delay((_d, i) => i * 80)
      .style('opacity', 1)

    nodeGroups.append('rect')
      .attr('x', -55)
      .attr('y', -nodeHeight / 2)
      .attr('width', 110)
      .attr('height', nodeHeight)
      .attr('rx', 6)
      .attr('fill', d => d.color)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)

    nodeGroups.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('fill', '#fff')
      .style('font-size', '8px')
      .style('font-weight', '600')
      .style('pointer-events', 'none')
      .text(d => d.name.length > 18 ? d.name.slice(0, 16) + '...' : d.name)

    return () => { container.innerHTML = '' }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', minHeight: 400, position: 'relative' }}
    />
  )
}
