import Badge from '../common/Badge'
import Card from '../common/Card'

export default function ResourceInvestment() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Resource & Investment</h1>
          <Badge label="Coming Soon" variant="accent" />
        </div>
        <p className="text-gray-600 italic">
          "What resources are available, how are investments flowing, and where are the funding gaps for scaling innovations?"
        </p>
      </div>
      <Card title="Core Elements & Indicators">
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>ODA and development finance flows</li>
          <li>Private sector investment and blended finance</li>
          <li>Research funding allocation patterns</li>
          <li>Cost-effectiveness and ROI analysis</li>
          <li>Resource mobilization and gap identification</li>
        </ul>
      </Card>
      <Card title="Analytical Contributions">
        <p className="text-sm text-gray-600">
          Tracks investment flows and resource availability to identify
          funding opportunities and gaps for innovation scaling.
        </p>
      </Card>
    </div>
  )
}
