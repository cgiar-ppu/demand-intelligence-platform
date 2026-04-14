import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface NodeItem {
  id: string
  name: string
  score: number
  type: string
}

interface LinkData {
  source: string
  target: string
  strength: number
}

const opportunities: NodeItem[] = [
  { id: 'o1', name: 'Drought-tolerant maize\nNorthern Nigeria', score: 87, type: 'opportunity' },
  { id: 'o2', name: 'Climate-smart rice\nBangladesh Haor', score: 82, type: 'opportunity' },
  { id: 'o3', name: 'Biofortified cassava\nSouthern Nigeria', score: 79, type: 'opportunity' },
  { id: 'o4', name: 'Digital advisory\nKenya Highlands', score: 76, type: 'opportunity' },
  { id: 'o5', name: 'Improved sorghum\nNW Nigeria', score: 74, type: 'opportunity' },
  { id: 'o6', name: 'Rice seed systems\nRangpur Bangladesh', score: 72, type: 'opportunity' },
  { id: 'o7', name: 'Wheat varieties\nRift Valley Kenya', score: 70, type: 'opportunity' },
  { id: 'o8', name: 'Cowpea value chain\nNE Nigeria', score: 68, type: 'opportunity' },
  { id: 'o9', name: 'Aquaculture systems\nKhulna Bangladesh', score: 65, type: 'opportunity' },
  { id: 'o10', name: 'Potato storage\nCentral Kenya', score: 62, type: 'opportunity' },
]

const dimensions: NodeItem[] = [
  { id: 'd1', name: 'Geography', score: 0, type: 'dimension' },
  { id: 'd2', name: 'Demand', score: 0, type: 'dimension' },
  { id: 'd3', name: 'Supply', score: 0, type: 'dimension' },
  { id: 'd4', name: 'Gaps', score: 0, type: 'dimension' },
  { id: 'd5', name: 'Investment', score: 0, type: 'dimension' },
]

const links: LinkData[] = [
  { source: 'o1', target: 'd1', strength: 0.9 }, { source: 'o1', target: 'd2', strength: 0.85 },
  { source: 'o1', target: 'd3', strength: 0.8 }, { source: 'o1', target: 'd5', strength: 0.7 },
  { source: 'o2', target: 'd1', strength: 0.85 }, { source: 'o2', target: 'd2', strength: 0.9 },
  { source: 'o2', target: 'd3', strength: 0.75 }, { source: 'o2', target: 'd4', strength: 0.6 },
  { source: 'o3', target: 'd2', strength: 0.8 }, { source: 'o3', target: 'd3', strength: 0.85 },
  { source: 'o3', target: 'd5', strength: 0.7 },
  { source: 'o4', target: 'd1', strength: 0.7 }, { source: 'o4', target: 'd3', strength: 0.9 },
  { source: 'o4', target: 'd5', strength: 0.8 },
  { source: 'o5', target: 'd1', strength: 0.8 }, { source: 'o5', target: 'd2', strength: 0.7 },
  { source: 'o5', target: 'd4', strength: 0.75 },
  { source: 'o6', target: 'd2', strength: 0.85 }, { source: 'o6', target: 'd3', strength: 0.7 },
  { source: 'o7', target: 'd1', strength: 0.7 }, { source: 'o7', target: 'd5', strength: 0.65 },
  { source: 'o8', target: 'd2', strength: 0.75 }, { source: 'o8', target: 'd4', strength: 0.8 },
  { source: 'o9', target: 'd3', strength: 0.65 }, { source: 'o9', target: 'd5', strength: 0.6 },
  { source: 'o10', target: 'd4', strength: 0.7 }, { source: 'o10', target: 'd1', strength: 0.6 },
]

const dimColors: Record<string, string> = {
  d1: '#00695C',
  d2: '#1565C0',
  d3: '#7B1FA2',
  d4: '#E64A19',
  d5: '#F9A825',
}

export default function ConvergenceDiagram() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    container.innerHTML = ''

    const width = container.clientWidth
    const height = 550
    const centerX = width / 2
    const centerY = height / 2

    const svg = d3.select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')

    // Position dimensions in a circle around center
    const dimRadius = Math.min(width, height) * 0.42
    const dimPositions: Record<string, { x: number; y: number }> = {}

    dimensions.forEach((dim, i) => {
      const angle = (2 * Math.PI * i) / dimensions.length - Math.PI / 2
      dimPositions[dim.id] = {
        x: centerX + Math.cos(angle) * dimRadius,
        y: centerY + Math.sin(angle) * dimRadius,
      }
    })

    // Position opportunities in an inner circle
    const oppRadius = dimRadius * 0.5
    const oppPositions: Record<string, { x: number; y: number }> = {}

    opportunities.forEach((opp, i) => {
      const angle = (2 * Math.PI * i) / opportunities.length - Math.PI / 2
      const jitter = (Math.random() - 0.5) * 20
      oppPositions[opp.id] = {
        x: centerX + Math.cos(angle) * (oppRadius + jitter),
        y: centerY + Math.sin(angle) * (oppRadius + jitter),
      }
    })

    // Draw links
    links.forEach((link, i) => {
      const source = oppPositions[link.source]
      const target = dimPositions[link.target]
      if (!source || !target) return

      svg.append('line')
        .attr('x1', source.x).attr('y1', source.y)
        .attr('x2', source.x).attr('y2', source.y)
        .attr('stroke', dimColors[link.target])
        .attr('stroke-width', link.strength * 2)
        .attr('opacity', 0)
        .transition()
        .duration(800)
        .delay(i * 30 + 500)
        .attr('x2', target.x).attr('y2', target.y)
        .attr('opacity', link.strength * 0.3)
    })

    // Draw dimension nodes
    dimensions.forEach((dim, i) => {
      const pos = dimPositions[dim.id]
      const g = svg.append('g')

      g.append('circle')
        .attr('cx', pos.x).attr('cy', pos.y)
        .attr('r', 0)
        .attr('fill', dimColors[dim.id])
        .attr('opacity', 0.9)
        .attr('stroke', '#fff')
        .attr('stroke-width', 3)
        .transition()
        .duration(600)
        .delay(i * 100)
        .attr('r', 28)

      g.append('text')
        .attr('x', pos.x).attr('y', pos.y + 4)
        .attr('text-anchor', 'middle')
        .style('font-size', '10px')
        .style('font-weight', '700')
        .style('fill', '#fff')
        .style('opacity', 0)
        .text(dim.name)
        .transition()
        .delay(i * 100 + 400)
        .duration(300)
        .style('opacity', 1)
    })

    // Draw opportunity nodes
    opportunities.forEach((opp, i) => {
      const pos = oppPositions[opp.id]
      const r = 12 + (opp.score - 60) * 0.4
      const g = svg.append('g')

      g.append('circle')
        .attr('cx', pos.x).attr('cy', pos.y)
        .attr('r', 0)
        .attr('fill', '#fff')
        .attr('stroke', '#00695C')
        .attr('stroke-width', 2)
        .attr('filter', 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))')
        .transition()
        .duration(500)
        .delay(300 + i * 60)
        .attr('r', r)

      g.append('text')
        .attr('x', pos.x).attr('y', pos.y + 3)
        .attr('text-anchor', 'middle')
        .style('font-size', '10px')
        .style('font-weight', '800')
        .style('fill', '#00695C')
        .style('opacity', 0)
        .text(opp.score)
        .transition()
        .delay(300 + i * 60 + 400)
        .duration(200)
        .style('opacity', 1)

      // Name label
      const lines = opp.name.split('\n')
      lines.forEach((line: string, li: number) => {
        g.append('text')
          .attr('x', pos.x)
          .attr('y', pos.y + r + 12 + li * 11)
          .attr('text-anchor', 'middle')
          .style('font-size', '7px')
          .style('fill', '#555')
          .style('opacity', 0)
          .text(line)
          .transition()
          .delay(800 + i * 60)
          .duration(300)
          .style('opacity', 1)
      })
    })

    // Legend
    const legendG = svg.append('g')
      .attr('transform', `translate(10, ${height - 20})`)

    const dimNames = ['Geography', 'Demand', 'Supply', 'Gaps', 'Investment']
    Object.entries(dimColors).forEach(([, color], i) => {
      legendG.append('circle').attr('cx', i * (width / 5.2)).attr('cy', 0).attr('r', 6).attr('fill', color)
      legendG.append('text').attr('x', i * (width / 5.2) + 10).attr('y', 4).style('font-size', '10px').style('fill', '#555').text(dimNames[i])
    })

    return () => { container.innerHTML = '' }
  }, [])

  return <div ref={containerRef} style={{ width: '100%' }} />
}
