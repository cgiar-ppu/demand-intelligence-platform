import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface BubbleData {
  label: string
  sector: string
  strength: number
  detail: string
}

const sectorColors: Record<string, string> = {
  Agriculture: '#2E7D32',
  Water: '#1565C0',
  Climate: '#EF6C00',
  Nutrition: '#7B1FA2',
  'Food Systems': '#00695C',
}

const bubbles: BubbleData[] = [
  { label: 'Drought-tolerant maize', sector: 'Agriculture', strength: 90, detail: '14 countries, high urgency' },
  { label: 'Iron-biofortified rice', sector: 'Nutrition', strength: 78, detail: 'Bangladesh priority, 8 partners' },
  { label: 'Soil health monitoring', sector: 'Agriculture', strength: 65, detail: 'Digital tool, 6 pilots' },
  { label: 'Climate-smart irrigation', sector: 'Water', strength: 85, detail: 'Sub-Saharan Africa focus' },
  { label: 'Seed system reform', sector: 'Agriculture', strength: 72, detail: 'Policy-driven demand' },
  { label: 'Market access digital tools', sector: 'Food Systems', strength: 60, detail: 'Smallholder focus' },
  { label: 'Post-harvest loss reduction', sector: 'Food Systems', strength: 82, detail: 'High economic impact' },
  { label: 'Flood-tolerant rice', sector: 'Climate', strength: 75, detail: 'South Asia priority' },
  { label: 'Zinc-enriched wheat', sector: 'Nutrition', strength: 55, detail: '3 countries targeted' },
  { label: 'Solar-powered pumps', sector: 'Water', strength: 68, detail: 'East Africa demand' },
  { label: 'Pest-resistant beans', sector: 'Agriculture', strength: 58, detail: 'Emerging demand' },
  { label: 'Nutrient management', sector: 'Agriculture', strength: 50, detail: 'Knowledge gap identified' },
  { label: 'Aquaculture systems', sector: 'Water', strength: 45, detail: 'Growing interest' },
  { label: 'Heat-tolerant crops', sector: 'Climate', strength: 88, detail: 'Critical climate adaptation' },
  { label: 'Value chain mapping', sector: 'Food Systems', strength: 42, detail: 'Analytical tool' },
  { label: 'Agroforestry models', sector: 'Climate', strength: 62, detail: 'Carbon credit potential' },
  { label: 'Vitamin A cassava', sector: 'Nutrition', strength: 70, detail: 'West Africa demand' },
  { label: 'Drip irrigation kits', sector: 'Water', strength: 52, detail: 'Affordable tech' },
  { label: 'Crop insurance models', sector: 'Food Systems', strength: 48, detail: 'Fintech integration' },
  { label: 'Livestock feed innovation', sector: 'Agriculture', strength: 55, detail: 'Dual-purpose crops' },
  { label: 'Water harvesting', sector: 'Water', strength: 63, detail: 'Arid zone priority' },
  { label: 'Early warning systems', sector: 'Climate', strength: 76, detail: 'Multi-hazard approach' },
  { label: 'Fortified blended foods', sector: 'Nutrition', strength: 40, detail: 'Emergency + development' },
  { label: 'Mechanization services', sector: 'Agriculture', strength: 35, detail: 'Youth engagement' },
  { label: 'Cold chain solutions', sector: 'Food Systems', strength: 57, detail: 'Last mile delivery' },
  { label: 'Salinity-tolerant rice', sector: 'Climate', strength: 64, detail: 'Coastal zones' },
  { label: 'Community seed banks', sector: 'Agriculture', strength: 38, detail: 'Biodiversity linkage' },
  { label: 'Fish pond management', sector: 'Water', strength: 32, detail: 'Integrated systems' },
  { label: 'Protein crops scaling', sector: 'Nutrition', strength: 44, detail: 'Diet diversification' },
  { label: 'Digital extension', sector: 'Food Systems', strength: 66, detail: 'ICT4Ag growing' },
  { label: 'Organic certification', sector: 'Agriculture', strength: 28, detail: 'Market premium access' },
  { label: 'Rainwater storage', sector: 'Water', strength: 47, detail: 'Household level' },
  { label: 'Carbon sequestration', sector: 'Climate', strength: 53, detail: 'Soil carbon focus' },
]

export default function DemandClusterBubble() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    container.innerHTML = ''

    const width = container.clientWidth || 600
    const height = 450

    const svg = d3.select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', '100%')

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

    const radiusScale = d3.scaleSqrt().domain([10, 100]).range([12, 45])

    const simulation = d3.forceSimulation(bubbles as d3.SimulationNodeDatum[])
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(height / 2).strength(0.05))
      .force('charge', d3.forceManyBody().strength(2))
      .force('collision', d3.forceCollide<BubbleData & d3.SimulationNodeDatum>()
        .radius(d => radiusScale(d.strength) + 2)
        .strength(0.8)
      )
      .on('tick', ticked)

    const nodeGroup = svg.selectAll('g.bubble')
      .data(bubbles)
      .join('g')
      .attr('class', 'bubble')
      .style('cursor', 'pointer')

    nodeGroup.append('circle')
      .attr('r', d => radiusScale(d.strength))
      .attr('fill', d => sectorColors[d.sector])
      .attr('fill-opacity', 0.75)
      .attr('stroke', d => sectorColors[d.sector])
      .attr('stroke-width', 1.5)

    // Labels on large bubbles
    nodeGroup
      .filter(d => d.strength >= 55)
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('font-size', d => d.strength > 75 ? '8px' : '7px')
      .style('fill', '#fff')
      .style('font-weight', '600')
      .style('pointer-events', 'none')
      .text(d => d.label.length > 20 ? d.label.slice(0, 18) + '..' : d.label)

    nodeGroup
      .on('mouseover', function (event: MouseEvent, d) {
        d3.select(this).select('circle').attr('fill-opacity', 1)
        tooltip
          .style('opacity', 1)
          .html(`<strong>${d.label}</strong><br/>Sector: ${d.sector}<br/>Signal Strength: ${d.strength}<br/>${d.detail}`)
          .style('left', `${event.offsetX + 10}px`)
          .style('top', `${event.offsetY - 10}px`)
      })
      .on('mousemove', function (event: MouseEvent) {
        tooltip
          .style('left', `${event.offsetX + 10}px`)
          .style('top', `${event.offsetY - 10}px`)
      })
      .on('mouseout', function () {
        d3.select(this).select('circle').attr('fill-opacity', 0.75)
        tooltip.style('opacity', 0)
      })

    function ticked() {
      nodeGroup.attr('transform', d => {
        const node = d as BubbleData & d3.SimulationNodeDatum
        return `translate(${node.x ?? 0},${node.y ?? 0})`
      })
    }

    // Legend
    const legendSvg = svg.append('g')
      .attr('transform', `translate(10, ${height - 30})`)

    const sectors = Object.entries(sectorColors)
    sectors.forEach(([sector, color], i) => {
      const lx = i * 110
      legendSvg.append('circle')
        .attr('cx', lx + 6)
        .attr('cy', 6)
        .attr('r', 5)
        .attr('fill', color)
      legendSvg.append('text')
        .attr('x', lx + 15)
        .attr('y', 10)
        .style('font-size', '10px')
        .style('fill', '#333')
        .text(sector)
    })

    return () => {
      simulation.stop()
      container.innerHTML = ''
    }
  }, [])

  return (
    <div ref={containerRef} style={{ width: '100%', minHeight: 400, position: 'relative' }} />
  )
}
