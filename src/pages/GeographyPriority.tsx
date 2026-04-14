import Badge from '../components/common/Badge'
import Card from '../components/common/Card'

export default function GeographyPriority() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Geography & Priority</h1>
          <Badge label="Dimension 1" variant="primary" />
          <Badge label="Coming Soon" variant="accent" />
        </div>
        <p className="text-gray-600 italic">
          "Where should CGIAR focus its scaling efforts?"
        </p>
      </div>
      <Card title="Overview">
        <p className="text-sm text-gray-700">
          This dimension prioritizes geographies based on need intensity, scaling
          potential, and strategic alignment with CGIAR's mission. It synthesizes
          data from all seven domains to produce geography-level priority scores.
        </p>
      </Card>
      <Card title="Key Outputs">
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>Country and sub-national priority rankings</li>
          <li>Multi-criteria scoring (need, capacity, opportunity)</li>
          <li>Geographic clustering and regional patterns</li>
        </ul>
      </Card>
    </div>
  )
}
