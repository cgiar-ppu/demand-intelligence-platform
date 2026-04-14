import Badge from '../common/Badge'
import Card from '../common/Card'

export default function Sector() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Sector</h1>
          <Badge label="Coming Soon" variant="accent" />
        </div>
        <p className="text-gray-600 italic">
          "What are the sector-specific dynamics, trends, and structural conditions that shape demand for agricultural innovation?"
        </p>
      </div>
      <Card title="Core Elements & Indicators">
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>Crop and livestock value chain structures</li>
          <li>Sector growth trajectories and productivity trends</li>
          <li>Technology adoption patterns across sectors</li>
          <li>Sector-level policy and regulatory landscape</li>
          <li>Research and development investment by sector</li>
        </ul>
      </Card>
      <Card title="Analytical Contributions">
        <p className="text-sm text-gray-600">
          Identifies sector-specific demand patterns and structural conditions that
          determine where innovations can have the greatest impact.
        </p>
      </Card>
    </div>
  )
}
