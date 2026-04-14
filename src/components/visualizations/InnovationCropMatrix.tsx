import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const crops = ['Rice', 'Maize', 'Cassava', 'Sorghum', 'Wheat', 'Cowpea']
const innovTypes = ['Varieties', 'Agronomic Practices', 'Digital Tools', 'Business Models', 'Policy Instruments']

const matrixData = [
  [23, 15, 8, 5, 4],  // Rice
  [18, 15, 10, 7, 3], // Maize
  [12, 10, 6, 8, 3],  // Cassava
  [9, 8, 4, 3, 2],    // Sorghum
  [14, 7, 5, 4, 3],   // Wheat
  [7, 6, 3, 2, 2],    // Cowpea
]

export default function InnovationCropMatrix() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    container.innerHTML = ''

    const margin = { top: 60, right: 20, bottom: 30, left: 100 }
    const cellSize = 80
    const width = margin.left + innovTypes.length * cellSize + margin.right
    const height = margin.top + crops.length * cellSize + margin.bottom

    const svg = d3.select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')

    const maxVal = d3.max(matrixData.flat()) || 1
    const radiusScale = d3.scaleSqrt().domain([0, maxVal]).range([0, cellSize * 0.38])
    const colorScale = d3.scaleLinear<string>().domain([0, maxVal / 2, maxVal]).range(['#b2dfdb', '#26a69a', '#00695C'])

    // Column headers
    innovTypes.forEach((t, i) => {
      svg.append('text')
        .attr('x', margin.left + i * cellSize + cellSize / 2)
        .attr('y', margin.top - 15)
        .attr('text-anchor', 'middle')
        .style('font-size', '10px')
        .style('font-weight', '700')
        .style('fill', '#374151')
        .text(t)
    })

    // Row labels
    crops.forEach((c, i) => {
      svg.append('text')
        .attr('x', margin.left - 10)
        .attr('y', margin.top + i * cellSize + cellSize / 2 + 4)
        .attr('text-anchor', 'end')
        .style('font-size', '12px')
        .style('font-weight', '600')
        .style('fill', '#1f2937')
        .text(c)
    })

    // Grid lines
    crops.forEach((_, i) => {
      svg.append('line')
        .attr('x1', margin.left).attr('x2', margin.left + innovTypes.length * cellSize)
        .attr('y1', margin.top + i * cellSize).attr('y2', margin.top + i * cellSize)
        .attr('stroke', '#e5e7eb').attr('stroke-width', 0.5)
    })
    innovTypes.forEach((_, i) => {
      svg.append('line')
        .attr('y1', margin.top).attr('y2', margin.top + crops.length * cellSize)
        .attr('x1', margin.left + i * cellSize).attr('x2', margin.left + i * cellSize)
        .attr('stroke', '#e5e7eb').attr('stroke-width', 0.5)
    })

    // Bubbles
    matrixData.forEach((row, ri) => {
      row.forEach((val, ci) => {
        const cx = margin.left + ci * cellSize + cellSize / 2
        const cy = margin.top + ri * cellSize + cellSize / 2

        svg.append('circle')
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', 0)
          .attr('fill', colorScale(val))
          .attr('opacity', 0.8)
          .transition()
          .duration(500)
          .delay(ri * 60 + ci * 40)
          .attr('r', radiusScale(val))

        svg.append('text')
          .attr('x', cx)
          .attr('y', cy + 4)
          .attr('text-anchor', 'middle')
          .style('font-size', '10px')
          .style('font-weight', '700')
          .style('fill', val > maxVal * 0.4 ? '#fff' : '#374151')
          .style('opacity', 0)
          .text(val)
          .transition()
          .delay(ri * 60 + ci * 40 + 400)
          .duration(200)
          .style('opacity', 1)
      })
    })

    return () => { container.innerHTML = '' }
  }, [])

  return <div ref={containerRef} style={{ width: '100%' }} />
}
