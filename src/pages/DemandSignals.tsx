import Badge from '../components/common/Badge'
import Card from '../components/common/Card'
import SignalSourceTreemap from '../components/visualizations/SignalSourceTreemap'
import SignalTimeline from '../components/visualizations/SignalTimeline'
import SignalTypeDonut from '../components/visualizations/SignalTypeDonut'

export default function DemandSignals() {
  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Demand Signals</h1>
          <Badge label="Dimension 2" variant="primary" />
        </div>
        <p className="text-gray-600 italic">
          "What is being asked for?"
        </p>
      </div>
      <Card title="Overview">
        <p className="text-sm text-gray-700">
          Captures and analyzes expressed demand from multiple sources -- national
          investment plans, funder strategies, partner requests, and policy documents
          -- using NLP and semantic analysis to identify demand themes and patterns.
        </p>
      </Card>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Signal Source Treemap</h2>
        <p className="text-sm text-gray-500 mb-4">
          Demand signals grouped by source type, showing relative volume from policy documents, consultations, market data, research, and digital sources.
        </p>
        <Card>
          <SignalSourceTreemap />
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Signal Detection Timeline</h2>
        <p className="text-sm text-gray-500 mb-4">
          Temporal view of demand signal detection across 2024-2026, colored by country with signal strength indicators.
        </p>
        <Card>
          <SignalTimeline />
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Signal Type Distribution</h2>
        <p className="text-sm text-gray-500 mb-4">
          Breakdown of 247 detected signals by demand type: expressed, latent, policy-driven, and market-driven.
        </p>
        <Card>
          <SignalTypeDonut />
        </Card>
      </div>
    </div>
  )
}
