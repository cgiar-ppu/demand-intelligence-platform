import Badge from '../common/Badge'
import Card from '../common/Card'
import InfrastructureIndex from '../visualizations/InfrastructureIndex'

export default function ScalingContext() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Scaling Context</h1>
          <Badge label="Domain" variant="primary" />
        </div>
        <p className="text-gray-600 italic">
          "What are the conditions that shape and influence how innovations can be taken to scale?"
        </p>
      </div>
      <Card title="Core Elements & Indicators">
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>National and sub-national policy environments</li>
          <li>Institutional capacity and governance structures</li>
          <li>Socioeconomic and demographic factors</li>
          <li>Climate and agroecological context</li>
          <li>Infrastructure and market access</li>
        </ul>
      </Card>
      <div>
        <h2 className="text-base font-semibold text-gray-800 mb-1">Infrastructure Index by Country</h2>
        <p className="text-sm text-gray-500 mb-3">
          Comparative scores for roads, irrigation, energy, and digital infrastructure across target countries.
        </p>
        <Card>
          <InfrastructureIndex />
        </Card>
      </div>
      <Card title="Analytical Contributions">
        <p className="text-sm text-gray-600">
          Provides contextual intelligence for prioritizing geographies and understanding
          enabling conditions for innovation adoption at scale.
        </p>
      </Card>
    </div>
  )
}
