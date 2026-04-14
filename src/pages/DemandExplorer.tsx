import Badge from '../components/common/Badge'
import Card from '../components/common/Card'

export default function DemandExplorer() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Demand Explorer</h1>
          <Badge label="Coming Soon" variant="accent" />
        </div>
        <p className="text-gray-600">
          Interactive exploration of demand-supply matching across geographies,
          sectors, and innovation types.
        </p>
      </div>
      <Card title="Features">
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>Semantic clustering of demand signals from policy documents</li>
          <li>Demand-supply gap visualization</li>
          <li>Innovation matching and scoring engine</li>
          <li>Country and regional comparison views</li>
        </ul>
      </Card>
    </div>
  )
}
