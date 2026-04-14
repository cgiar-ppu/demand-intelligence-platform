import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const treeData = {
  name: 'Demand Signals',
  children: [
    {
      name: 'Policy Documents',
      children: [
        { name: 'Nigeria National Ag Policy 2024', value: 12 },
        { name: 'Bangladesh Delta Plan 2100', value: 10 },
        { name: 'Kenya Big 4 Agenda', value: 8 },
        { name: 'AU Malabo Declaration', value: 6 },
        { name: 'CAADP Country Plans', value: 5 },
      ],
    },
    {
      name: 'Stakeholder Consultations',
      children: [
        { name: 'NARS Priority Setting', value: 8 },
        { name: 'Farmer Focus Groups', value: 7 },
        { name: 'Private Sector Roundtables', value: 6 },
        { name: 'Donor Coordination Meetings', value: 5 },
      ],
    },
    {
      name: 'Market Data',
      children: [
        { name: 'Commodity Price Signals', value: 7 },
        { name: 'Trade Flow Analysis', value: 5 },
        { name: 'Import Substitution Needs', value: 4 },
        { name: 'Value Chain Assessments', value: 4 },
      ],
    },
    {
      name: 'Research Literature',
      children: [
        { name: 'CGIAR Working Papers', value: 5 },
        { name: 'Peer-reviewed Studies', value: 4 },
        { name: 'Impact Evaluations', value: 3 },
        { name: 'Foresight Analyses', value: 3 },
      ],
    },
    {
      name: 'Media & Digital',
      children: [
        { name: 'Social Media Trends', value: 3 },
        { name: 'News Analytics', value: 2 },
      ],
    },
  ],
}

const groupColors: Record<string, string> = {
  'Policy Documents': '#00695C',
  'Stakeholder Consultations': '#1565C0',
  'Market Data': '#F9A825',
  'Research Literature': '#7B1FA2',
  'Media & Digital': '#E64A19',
}

export default function SignalSourceTreemap() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    container.innerHTML = ''

    const width = container.clientWidth
    const height = 400

    const svg = d3.select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')

    const root = d3.hierarchy(treeData)
      .sum(d => (d as { value?: number }).value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0))

    d3.treemap<typeof treeData>()
      .size([width, height - 30])
      .padding(2)
      .paddingTop(20)(root)

    // Group rectangles
    const groups = svg.selectAll('.group')
      .data(root.children || [])
      .enter()
      .append('g')

    groups.append('rect')
      .attr('x', d => (d as d3.HierarchyRectangularNode<typeof treeData>).x0)
      .attr('y', d => (d as d3.HierarchyRectangularNode<typeof treeData>).y0)
      .attr('width', d => (d as d3.HierarchyRectangularNode<typeof treeData>).x1 - (d as d3.HierarchyRectangularNode<typeof treeData>).x0)
      .attr('height', d => (d as d3.HierarchyRectangularNode<typeof treeData>).y1 - (d as d3.HierarchyRectangularNode<typeof treeData>).y0)
      .attr('fill', d => groupColors[d.data.name] || '#ccc')
      .attr('opacity', 0.2)
      .attr('rx', 4)

    groups.append('text')
      .attr('x', d => (d as d3.HierarchyRectangularNode<typeof treeData>).x0 + 6)
      .attr('y', d => (d as d3.HierarchyRectangularNode<typeof treeData>).y0 + 14)
      .style('font-size', '10px')
      .style('font-weight', '700')
      .style('fill', d => groupColors[d.data.name] || '#333')
      .text(d => {
        const w = (d as d3.HierarchyRectangularNode<typeof treeData>).x1 - (d as d3.HierarchyRectangularNode<typeof treeData>).x0
        return w > 80 ? d.data.name : ''
      })

    // Leaf nodes
    const leaves = svg.selectAll('.leaf')
      .data(root.leaves())
      .enter()
      .append('g')

    leaves.append('rect')
      .attr('x', d => (d as d3.HierarchyRectangularNode<typeof treeData>).x0)
      .attr('y', d => (d as d3.HierarchyRectangularNode<typeof treeData>).y0)
      .attr('width', 0)
      .attr('height', 0)
      .attr('fill', d => {
        const parent = d.parent
        return parent ? groupColors[parent.data.name] || '#ccc' : '#ccc'
      })
      .attr('opacity', 0.7)
      .attr('rx', 3)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .transition()
      .duration(600)
      .delay((_, i) => i * 40)
      .attr('width', d => Math.max(0, (d as d3.HierarchyRectangularNode<typeof treeData>).x1 - (d as d3.HierarchyRectangularNode<typeof treeData>).x0))
      .attr('height', d => Math.max(0, (d as d3.HierarchyRectangularNode<typeof treeData>).y1 - (d as d3.HierarchyRectangularNode<typeof treeData>).y0))

    leaves.append('text')
      .attr('x', d => (d as d3.HierarchyRectangularNode<typeof treeData>).x0 + 4)
      .attr('y', d => (d as d3.HierarchyRectangularNode<typeof treeData>).y0 + 14)
      .style('font-size', '8px')
      .style('fill', '#fff')
      .style('font-weight', '600')
      .style('opacity', 0)
      .text(d => {
        const w = (d as d3.HierarchyRectangularNode<typeof treeData>).x1 - (d as d3.HierarchyRectangularNode<typeof treeData>).x0
        return w > 70 ? d.data.name : ''
      })
      .transition()
      .delay(800)
      .duration(300)
      .style('opacity', 1)

    // Legend at bottom
    const legendG = svg.append('g')
      .attr('transform', `translate(10, ${height - 22})`)

    Object.entries(groupColors).forEach(([name, color], i) => {
      const lx = i * (width / 5.2)
      legendG.append('rect').attr('x', lx).attr('y', 0).attr('width', 10).attr('height', 10).attr('rx', 2).attr('fill', color).attr('opacity', 0.8)
      legendG.append('text').attr('x', lx + 14).attr('y', 9).style('font-size', '9px').style('fill', '#555').text(name)
    })

    return () => { container.innerHTML = '' }
  }, [])

  return <div ref={containerRef} style={{ width: '100%' }} />
}
