import Badge from '../common/Badge'
import Card from '../common/Card'
import StakeholderBar from '../visualizations/StakeholderBar'

export default function Stakeholders() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Stakeholders</h1>
          <Badge label="Domain" variant="primary" />
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
      <div>
        <h2 className="text-base font-semibold text-gray-800 mb-1">Stakeholder Engagement by Type</h2>
        <p className="text-sm text-gray-500 mb-3">
          Number of engaged stakeholders across government, research, private sector, farmer, NGO, and donor groups.
        </p>
        <Card>
          <StakeholderBar />
        </Card>
      </div>
      <Card title="Analytical Contributions">
        <p className="text-sm text-gray-600">
          Maps the stakeholder ecosystem to understand demand articulation, adoption
          capacity, and partnership opportunities for scaling innovations.
        </p>
      </Card>
    </div>
  )
}
