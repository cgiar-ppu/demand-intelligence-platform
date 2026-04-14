import Badge from '../components/common/Badge'
import Card from '../components/common/Card'

export default function InnovationSupply() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Innovation Supply</h1>
          <Badge label="Dimension 3" variant="primary" />
          <Badge label="Coming Soon" variant="accent" />
        </div>
        <p className="text-gray-600 italic">
          "What innovations does CGIAR have ready to offer?"
        </p>
      </div>
      <Card title="Overview">
        <p className="text-sm text-gray-700">
          Maps the full innovation portfolio across CGIAR centers, assessing
          maturity levels, evidence base, and scaling readiness to determine
          what is available to meet expressed demand.
        </p>
      </Card>
      <Card title="Key Outputs">
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>Innovation inventory with maturity classification</li>
          <li>Scaling readiness assessment scores</li>
          <li>Evidence strength and impact projections</li>
        </ul>
      </Card>
    </div>
  )
}
