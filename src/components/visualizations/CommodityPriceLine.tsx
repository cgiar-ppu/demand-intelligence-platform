import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const crops = [
  { name: 'Rice', color: '#00695C', values: [420, 435, 445, 460, 480, 510, 520, 505, 490, 475, 460, 450] },
  { name: 'Maize', color: '#1565C0', values: [280, 275, 290, 310, 340, 365, 380, 370, 345, 320, 295, 285] },
  { name: 'Cassava', color: '#F9A825', values: [150, 155, 160, 170, 185, 195, 200, 190, 180, 170, 158, 152] },
]

export default function CommodityPriceLine() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    container.innerHTML = ''

    const margin = { top: 15, right: 20, bottom: 40, left: 50 }
    const width = container.clientWidth
    const height = 250
    const innerW = width - margin.left - margin.right
    const innerH = height - margin.top - margin.bottom

    const svg = d3.select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3.scalePoint().domain(months).range([0, innerW])
    const y = d3.scaleLinear().domain([100, 550]).range([innerH, 0])

    g.append('g').attr('transform', `translate(0,${innerH})`).call(d3.axisBottom(x)).selectAll('text').style('font-size', '9px')
    g.append('g').call(d3.axisLeft(y).ticks(5).tickFormat(d => `$${d}`)).selectAll('text').style('font-size', '9px')

    g.append('g').call(d3.axisLeft(y).ticks(5).tickSize(-innerW).tickFormat(() => ''))
      .selectAll('line').attr('stroke', '#e5e7eb').attr('stroke-dasharray', '3,3')
    g.selectAll('.domain').filter((_, i) => i > 0).remove()

    const line = d3.line<number>()
      .x((_, i) => x(months[i])!)
      .y(d => y(d))
      .curve(d3.curveMonotoneX)

    crops.forEach((crop, ci) => {
      const path = g.append('path')
        .datum(crop.values)
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', crop.color)
        .attr('stroke-width', 2.5)
        .attr('opacity', 0.85)

      const pathEl = path.node()
      if (pathEl) {
        const length = pathEl.getTotalLength()
        path
          .attr('stroke-dasharray', `${length} ${length}`)
          .attr('stroke-dashoffset', length)
          .transition().duration(1000).delay(ci * 200)
          .attr('stroke-dashoffset', 0)
      }
    })

    const legendG = svg.append('g').attr('transform', `translate(${margin.left}, ${height - 10})`)
    crops.forEach((c, i) => {
      legendG.append('rect').attr('x', i * 90).attr('y', 0).attr('width', 12).attr('height', 3).attr('fill', c.color)
      legendG.append('text').attr('x', i * 90 + 16).attr('y', 5).style('font-size', '10px').style('fill', '#555').text(c.name)
    })

    return () => { container.innerHTML = '' }
  }, [])

  return <div ref={containerRef} style={{ width: '100%' }} />
}
