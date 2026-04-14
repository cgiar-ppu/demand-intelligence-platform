import Badge from '../components/common/Badge'
import Card from '../components/common/Card'

export default function InvestmentFeasibility() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Investment Feasibility</h1>
          <Badge label="Dimension 5" variant="primary" />
          <Badge label="Coming Soon" variant="accent" />
        </div>
        <p className="text-gray-600 italic">
          "What is realistic given resources, partnerships, and capacity?"
        </p>
      </div>
      <Card title="Overview">
        <p className="text-sm text-gray-700">
          Assesses the feasibility of scaling opportunities by analyzing available
          funding, partnership capacity, implementation readiness, and risk factors
          to determine what can realistically be pursued.
        </p>
      </Card>
      <Card title="Key Outputs">
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>Feasibility scoring by opportunity</li>
          <li>Resource requirement and availability matching</li>
          <li>Risk assessment and mitigation strategies</li>
        </ul>
      </Card>
    </div>
  )
}
