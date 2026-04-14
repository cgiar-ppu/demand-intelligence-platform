import Badge from '../components/common/Badge'
import Card from '../components/common/Card'

export default function DemandSignals() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Demand Signals</h1>
          <Badge label="Dimension 2" variant="primary" />
          <Badge label="Coming Soon" variant="accent" />
        </div>
        <p className="text-gray-600 italic">
          "What do countries, funders, and partners actually need?"
        </p>
      </div>
      <Card title="Overview">
        <p className="text-sm text-gray-700">
          Captures and analyzes expressed demand from multiple sources -- national
          investment plans, funder strategies, partner requests, and policy documents
          -- using NLP and semantic analysis to identify demand themes and patterns.
        </p>
      </Card>
      <Card title="Key Outputs">
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>Demand signal taxonomy and clustering</li>
          <li>Source-level demand mapping (countries, funders, partners)</li>
          <li>Temporal demand trend analysis</li>
        </ul>
      </Card>
    </div>
  )
}
