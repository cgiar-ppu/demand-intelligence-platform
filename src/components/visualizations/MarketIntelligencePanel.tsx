import { useState, useEffect, useRef, useMemo } from 'react'
import * as d3 from 'd3'
import {
  getSegmentsForCountry,
  getTPPCropBreakdown,
  getCropSummariesForCountry,
  TOTAL_SEGMENTS,
  TOTAL_TPPS,
  TOTAL_CROPS,
  TOTAL_COUNTRIES,
  TOTAL_HECTARES,
  DATA_DATE,
} from '../../data/glomipData'
import type { CountrySegment } from '../../data/glomipData'

const countries = ['Nigeria', 'Bangladesh', 'Kenya'] as const
type Country = (typeof countries)[number]

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return n.toLocaleString()
}

// ── Market Coverage Heatmap ──
function MarketCoverageHeatmap({ country }: { country: Country }) {
  const ref = useRef<HTMLDivElement>(null)
  const summaries = useMemo(() => getCropSummariesForCountry(country), [country])

  useEffect(() => {
    if (!ref.current || summaries.length === 0) return
    const container = ref.current
    container.innerHTML = ''

    const metrics = [
      { key: 'segmentCount' as const, label: '# Segments' },
      { key: 'totalHectares' as const, label: 'Total\nHectares' },
      { key: 'tppCount' as const, label: '# TPPs\nLinked' },
      { key: 'productionEnvironments' as const, label: 'Production\nEnvironments' },
      { key: 'germplasmTypes' as const, label: 'Germplasm\nTypes' },
    ]

    const cropNames = summaries.map((s) => s.crop)
    const margin = { top: 80, right: 20, bottom: 30, left: 100 }
    const cellW = 100
    const cellH = 32
    const width = margin.left + metrics.length * cellW + margin.right
    const height = margin.top + cropNames.length * cellH + margin.bottom

    const svg = d3
      .select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')

    // Color scales per metric (each normalised independently)
    const colorScales = metrics.map((m) => {
      const vals = summaries.map((s) => s[m.key])
      const maxVal = d3.max(vals) || 1
      return d3.scaleSequential(d3.interpolateYlGnBu).domain([0, maxVal])
    })

    // Column headers
    metrics.forEach((m, i) => {
      const lines = m.label.split('\n')
      const textG = svg.append('g').attr(
        'transform',
        `translate(${margin.left + i * cellW + cellW / 2},${margin.top - 8})`
      )
      lines.forEach((line, li) => {
        textG
          .append('text')
          .attr('y', -(lines.length - 1 - li) * 13)
          .attr('text-anchor', 'middle')
          .style('font-size', '9px')
          .style('font-weight', '600')
          .style('fill', '#555')
          .text(line)
      })
    })

    // Row labels
    cropNames.forEach((crop, i) => {
      svg
        .append('text')
        .attr('x', margin.left - 8)
        .attr('y', margin.top + i * cellH + cellH / 2 + 4)
        .attr('text-anchor', 'end')
        .style('font-size', '11px')
        .style('font-weight', '600')
        .style('fill', '#333')
        .text(crop)
    })

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    // Cells
    summaries.forEach((summary, ri) => {
      metrics.forEach((m, ci) => {
        const val = summary[m.key]
        const cell = g.append('g')

        cell
          .append('rect')
          .attr('x', ci * cellW + 2)
          .attr('y', ri * cellH + 2)
          .attr('width', cellW - 4)
          .attr('height', cellH - 4)
          .attr('rx', 4)
          .attr('fill', colorScales[ci](val))
          .style('opacity', 0)
          .transition()
          .duration(400)
          .delay(ri * 40 + ci * 30)
          .style('opacity', 1)

        const displayVal = m.key === 'totalHectares' ? formatNumber(val) : val.toString()
        cell
          .append('text')
          .attr('x', ci * cellW + cellW / 2)
          .attr('y', ri * cellH + cellH / 2 + 4)
          .attr('text-anchor', 'middle')
          .style('font-size', '11px')
          .style('font-weight', '700')
          .style('fill', val > (d3.max(summaries.map((s) => s[m.key])) || 1) * 0.6 ? '#fff' : '#333')
          .style('opacity', 0)
          .text(displayVal)
          .transition()
          .delay(500 + ri * 40 + ci * 30)
          .duration(200)
          .style('opacity', 1)
      })
    })

    return () => {
      container.innerHTML = ''
    }
  }, [country, summaries])

  return <div ref={ref} style={{ width: '100%', overflowX: 'auto' }} />
}

// ── Market Segments Table ──
function MarketSegmentsTable({ country }: { country: Country }) {
  const segments: CountrySegment[] = useMemo(() => getSegmentsForCountry(country), [country])

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="text-left p-2 font-semibold text-gray-700 border-b border-gray-200">Crop</th>
            <th className="text-left p-2 font-semibold text-gray-700 border-b border-gray-200">Germplasm Type</th>
            <th className="text-left p-2 font-semibold text-gray-700 border-b border-gray-200">Consumer Product</th>
            <th className="text-left p-2 font-semibold text-gray-700 border-b border-gray-200">Production Env.</th>
            <th className="text-left p-2 font-semibold text-gray-700 border-b border-gray-200">Production System</th>
            <th className="text-right p-2 font-semibold text-gray-700 border-b border-gray-200">Area Harvested (ha)</th>
            <th className="text-center p-2 font-semibold text-gray-700 border-b border-gray-200">TPP</th>
          </tr>
        </thead>
        <tbody>
          {segments.map((seg) => (
            <tr key={seg.msid} className="hover:bg-gray-50 transition-colors">
              <td className="p-2 font-medium text-gray-900 border-b border-gray-100">{seg.crop}</td>
              <td className="p-2 text-gray-600 border-b border-gray-100 text-xs">{seg.germplasm}</td>
              <td className="p-2 text-gray-600 border-b border-gray-100 text-xs max-w-[160px] truncate" title={seg.consumerProduct}>{seg.consumerProduct}</td>
              <td className="p-2 text-gray-600 border-b border-gray-100 text-xs max-w-[140px] truncate" title={seg.productionEnvironment}>{seg.productionEnvironment}</td>
              <td className="p-2 text-gray-600 border-b border-gray-100 text-xs">{seg.productionSystem}</td>
              <td className="p-2 text-right text-gray-700 border-b border-gray-100 font-mono text-xs">
                {formatNumber(seg.areaHarvested)}
              </td>
              <td className="p-2 text-center border-b border-gray-100">
                {seg.hasTPP ? (
                  <span className="inline-block w-5 h-5 rounded-full bg-green-100 text-green-700 text-xs leading-5 font-bold">Y</span>
                ) : (
                  <span className="inline-block w-5 h-5 rounded-full bg-red-50 text-red-400 text-xs leading-5">N</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── TPP Alignment Chart ──
function TPPAlignmentChart({ country }: { country: Country }) {
  const ref = useRef<HTMLDivElement>(null)

  const cropCounts = useMemo(() => getTPPCropBreakdown(country), [country])

  useEffect(() => {
    if (!ref.current || cropCounts.length === 0) return
    const container = ref.current
    container.innerHTML = ''

    const margin = { top: 20, right: 80, bottom: 30, left: 100 }
    const width = container.clientWidth
    const barH = 32
    const height = margin.top + cropCounts.length * barH + margin.bottom

    const svg = d3
      .select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)
    const innerW = width - margin.left - margin.right

    const maxTotal = d3.max(cropCounts, (d) => d.total) || 1

    const y = d3
      .scaleBand()
      .domain(cropCounts.map((d) => d.crop))
      .range([0, cropCounts.length * barH])
      .padding(0.25)

    const x = d3.scaleLinear().domain([0, maxTotal + 1]).range([0, innerW])

    const effortColors = {
      full: '#00695C',
      earlyLate: '#2196F3',
      lateTesting: '#F9A825',
      other: '#90A4AE',
    }

    // Crop labels
    cropCounts.forEach((d) => {
      svg
        .append('text')
        .attr('x', margin.left - 8)
        .attr('y', margin.top + (y(d.crop) ?? 0) + y.bandwidth() / 2 + 4)
        .attr('text-anchor', 'end')
        .style('font-size', '12px')
        .style('font-weight', '600')
        .style('fill', '#333')
        .text(d.crop)
    })

    // Stacked bars
    cropCounts.forEach((d, i) => {
      let xOffset = 0
      const barSegments = [
        { key: 'full', value: d.full, color: effortColors.full },
        { key: 'earlyLate', value: d.earlyLate, color: effortColors.earlyLate },
        { key: 'lateTesting', value: d.lateTesting, color: effortColors.lateTesting },
        { key: 'other', value: d.other, color: effortColors.other },
      ]
      barSegments.forEach((seg) => {
        if (seg.value > 0) {
          g.append('rect')
            .attr('x', x(xOffset))
            .attr('y', y(d.crop) ?? 0)
            .attr('width', 0)
            .attr('height', y.bandwidth())
            .attr('fill', seg.color)
            .attr('rx', 3)
            .transition()
            .duration(600)
            .delay(i * 80)
            .attr('width', x(seg.value))
          xOffset += seg.value
        }
      })

      // Total label
      g.append('text')
        .attr('x', x(d.total) + 6)
        .attr('y', (y(d.crop) ?? 0) + y.bandwidth() / 2 + 4)
        .style('font-size', '12px')
        .style('font-weight', '700')
        .style('fill', '#555')
        .style('opacity', 0)
        .text(`${d.total} TPP${d.total > 1 ? 's' : ''}`)
        .transition()
        .delay(700 + i * 80)
        .duration(200)
        .style('opacity', 1)
    })

    // Legend
    const legendEntries = [
      { label: 'Cat 1: Full', color: effortColors.full },
      { label: 'Cat 2: Early & Late', color: effortColors.earlyLate },
      { label: 'Cat 4: Late Testing', color: effortColors.lateTesting },
      { label: 'Other / Unspecified', color: effortColors.other },
    ]
    const legendG = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${height - 8})`)

    legendEntries.forEach((entry, i) => {
      legendG
        .append('rect')
        .attr('x', i * 140)
        .attr('y', 0)
        .attr('width', 10)
        .attr('height', 10)
        .attr('rx', 2)
        .attr('fill', entry.color)
      legendG
        .append('text')
        .attr('x', i * 140 + 14)
        .attr('y', 9)
        .style('font-size', '10px')
        .style('fill', '#666')
        .text(entry.label)
    })

    return () => {
      container.innerHTML = ''
    }
  }, [country, cropCounts])

  if (cropCounts.length === 0) {
    return <p className="text-gray-500 text-sm italic">No TPPs linked to {country} market segments.</p>
  }

  return <div ref={ref} style={{ width: '100%' }} />
}

// ── Main Panel ──
export default function MarketIntelligencePanel() {
  const [selectedCountry, setSelectedCountry] = useState<Country>('Nigeria')

  return (
    <div className="space-y-8">
      {/* Header Stat Bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <span className="font-bold text-primary text-lg">{TOTAL_SEGMENTS.toLocaleString()}</span>
            <span className="text-gray-500">Market Segments</span>
            <span className="text-gray-300">|</span>
            <span className="font-bold text-primary text-lg">{TOTAL_TPPS.toLocaleString()}</span>
            <span className="text-gray-500">TPPs</span>
            <span className="text-gray-300">|</span>
            <span className="font-bold text-primary text-lg">{TOTAL_CROPS}</span>
            <span className="text-gray-500">Crops</span>
            <span className="text-gray-300">|</span>
            <span className="font-bold text-primary text-lg">{TOTAL_COUNTRIES}</span>
            <span className="text-gray-500">Countries</span>
            <span className="text-gray-300">|</span>
            <span className="font-bold text-primary text-lg">{formatNumber(TOTAL_HECTARES)}</span>
            <span className="text-gray-500">Hectares</span>
          </div>
          <div className="text-xs text-gray-400">
            Data freshness: Last updated {DATA_DATE}
          </div>
        </div>
      </div>

      {/* Country Selector */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-semibold text-gray-700">Select Country:</label>
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value as Country)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none"
        >
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Market Coverage Heatmap */}
      <section>
        <h3 className="text-lg font-bold text-gray-800 mb-1">Market Coverage Heatmap</h3>
        <p className="text-xs text-gray-500 mb-4">
          Crop-level coverage metrics for {selectedCountry}: number of segments, total area harvested, linked TPPs, production environments, and germplasm types
        </p>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <MarketCoverageHeatmap country={selectedCountry} />
        </div>
      </section>

      {/* Market Segments Table */}
      <section>
        <h3 className="text-lg font-bold text-gray-800 mb-1">Seed Product Market Segments</h3>
        <p className="text-xs text-gray-500 mb-4">
          Real market segment data from GloMIP for {selectedCountry}, sorted by area harvested
        </p>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <MarketSegmentsTable country={selectedCountry} />
        </div>
      </section>

      {/* TPP Alignment Chart */}
      <section>
        <h3 className="text-lg font-bold text-gray-800 mb-1">TPP Alignment by Crop</h3>
        <p className="text-xs text-gray-500 mb-4">
          Target Product Profiles linked to {selectedCountry} market segments, colored by breeding effort category
        </p>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <TPPAlignmentChart country={selectedCountry} />
        </div>
      </section>
    </div>
  )
}
