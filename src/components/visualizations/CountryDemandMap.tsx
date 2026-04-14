import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'
import type { Topology, GeometryCollection } from 'topojson-specification'

interface CountryFeature {
  type: string
  id: string
  properties: { name: string }
  geometry: GeoJSON.Geometry
}

const highlightedCountries: Record<string, { color: string; label: string; tooltip: string }> = {
  '566': { color: '#2E7D32', label: 'Active Pilot', tooltip: 'Nigeria: 47 demand signals identified, 23 innovations matched, 12 gaps detected' },
  '050': { color: '#1565C0', label: 'Active Pilot', tooltip: 'Bangladesh: 31 demand signals, 18 innovations matched, 8 gaps detected' },
  '404': { color: '#F9A825', label: 'Policy Inventory Complete', tooltip: 'Kenya: 28 demand signals, 15 innovations matched, 11 gaps detected' },
}

export default function CountryDemandMap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    container.querySelectorAll('svg').forEach(el => el.remove())

    const width = container.clientWidth || 700
    const height = width * 0.55

    const svg = d3.select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', '100%')

    const projection = d3.geoNaturalEarth1()
      .scale(width / 5.5)
      .translate([width / 2, height / 2])

    const path = d3.geoPath().projection(projection)

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
      .style('max-width', '260px')
      .style('z-index', '10')

    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(res => res.json())
      .then((world: Topology) => {
        setLoading(false)
        const countries = topojson.feature(
          world,
          world.objects.countries as GeometryCollection
        )

        svg.selectAll('path')
          .data((countries as GeoJSON.FeatureCollection).features)
          .join('path')
          .attr('d', (d) => path(d as GeoJSON.Feature) || '')
          .attr('fill', (d: unknown) => {
            const feat = d as CountryFeature
            const info = highlightedCountries[feat.id]
            return info ? info.color : '#E0E0E0'
          })
          .attr('stroke', '#fff')
          .attr('stroke-width', 0.5)
          .style('cursor', (d: unknown) => {
            const feat = d as CountryFeature
            return highlightedCountries[feat.id] ? 'pointer' : 'default'
          })
          .style('opacity', 0)
          .transition()
          .duration(800)
          .delay((_d, i) => i * 3)
          .style('opacity', 1)

        // Re-select for events (no transitions)
        svg.selectAll('path')
          .on('mouseover', function (event: MouseEvent, d: unknown) {
            const feat = d as CountryFeature
            const info = highlightedCountries[feat.id]
            if (info) {
              d3.select(this).attr('fill-opacity', 0.7)
              tooltip
                .style('opacity', 1)
                .html(`<strong>${info.tooltip.split(':')[0]}</strong><br/>${info.tooltip.split(':')[1]}<br/><em>${info.label}</em>`)
                .style('left', `${event.offsetX + 12}px`)
                .style('top', `${event.offsetY - 12}px`)
            }
          })
          .on('mousemove', function (event: MouseEvent) {
            tooltip
              .style('left', `${event.offsetX + 12}px`)
              .style('top', `${event.offsetY - 12}px`)
          })
          .on('mouseout', function () {
            d3.select(this).attr('fill-opacity', 1)
            tooltip.style('opacity', 0)
          })

        // Legend
        const legend = svg.append('g')
          .attr('transform', `translate(${width - 180},${height - 90})`)

        const legendData = [
          { color: '#2E7D32', label: 'Active Pilot (Nigeria)' },
          { color: '#1565C0', label: 'Active Pilot (Bangladesh)' },
          { color: '#F9A825', label: 'Policy Inventory (Kenya)' },
          { color: '#E0E0E0', label: 'Other Countries' },
        ]

        legend.append('rect')
          .attr('x', -8)
          .attr('y', -8)
          .attr('width', 175)
          .attr('height', legendData.length * 22 + 12)
          .attr('rx', 4)
          .attr('fill', 'rgba(255,255,255,0.9)')
          .attr('stroke', '#ddd')

        legendData.forEach((item, i) => {
          const row = legend.append('g').attr('transform', `translate(4,${i * 22 + 6})`)
          row.append('rect')
            .attr('width', 14)
            .attr('height', 14)
            .attr('rx', 3)
            .attr('fill', item.color)
          row.append('text')
            .attr('x', 20)
            .attr('y', 11)
            .style('font-size', '10px')
            .style('fill', '#333')
            .text(item.label)
        })
      })
      .catch(() => setLoading(false))

    return () => {
      container.querySelectorAll('svg, div').forEach(el => {
        if (el !== container) el.remove()
      })
    }
  }, [])

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', minHeight: 300 }}>
      {loading && (
        <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>
          Loading map data...
        </div>
      )}
    </div>
  )
}
