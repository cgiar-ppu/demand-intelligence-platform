import Badge from '../components/common/Badge'
import Card from '../components/common/Card'

export default function DemandGaps() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Demand Gaps</h1>
          <Badge label="Dimension 4" variant="primary" />
          <Badge label="Coming Soon" variant="accent" />
        </div>
        <p className="text-gray-600 italic">
          "Where does demand exceed available innovation supply?"
        </p>
      </div>
      <Card title="Overview">
        <p className="text-sm text-gray-700">
          Identifies mismatches between expressed demand and available innovations
          by comparing demand signal clusters with the innovation portfolio,
          revealing gaps that require new R&D or partnership strategies.
        </p>
      </Card>
      <Card title="Key Outputs">
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>Demand-supply gap matrix by theme and geography</li>
          <li>Unmet demand identification and prioritization</li>
          <li>R&D pipeline recommendations</li>
        </ul>
      </Card>
    </div>
  )
}
