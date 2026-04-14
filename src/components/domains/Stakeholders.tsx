import Badge from '../common/Badge'
import Card from '../common/Card'

export default function Stakeholders() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Stakeholders</h1>
          <Badge label="Coming Soon" variant="accent" />
        </div>
        <p className="text-gray-600 italic">
          "Who are the key actors, what are their needs, and how do they influence the demand for and adoption of innovations?"
        </p>
      </div>
      <Card title="Core Elements & Indicators">
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>Stakeholder mapping and network analysis</li>
          <li>Demand articulation and expressed needs</li>
          <li>Adoption capacity and readiness assessment</li>
          <li>Partnership and collaboration dynamics</li>
          <li>Feedback loops and engagement mechanisms</li>
        </ul>
      </Card>
      <Card title="Analytical Contributions">
        <p className="text-sm text-gray-600">
          Maps the stakeholder ecosystem to understand demand articulation, adoption
          capacity, and partnership opportunities for scaling innovations.
        </p>
      </Card>
    </div>
  )
}
