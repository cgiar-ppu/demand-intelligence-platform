import Badge from '../common/Badge'
import Card from '../common/Card'
import InnovationReadinessPipeline from '../visualizations/InnovationReadinessPipeline'

export default function InnovationPortfolio() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Innovation Portfolio</h1>
          <Badge label="Domain" variant="primary" />
        </div>
        <p className="text-gray-600 italic">
          "What innovations exist, at what stage of maturity, and how well do they match expressed demand?"
        </p>
      </div>
      <Card title="Core Elements & Indicators">
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>Innovation inventory and classification</li>
          <li>Technology readiness and maturity levels</li>
          <li>Evidence base and impact assessment</li>
          <li>Demand-supply matching scores</li>
          <li>Scaling readiness and pathway analysis</li>
        </ul>
      </Card>
      <div>
        <h2 className="text-base font-semibold text-gray-800 mb-1">Innovation Readiness Pipeline</h2>
        <p className="text-sm text-gray-500 mb-3">
          Distribution of innovations across five maturity stages, from discovery through commercialization.
        </p>
        <Card>
          <InnovationReadinessPipeline />
        </Card>
      </div>
      <Card title="Analytical Contributions">
        <p className="text-sm text-gray-600">
          Catalogs the innovation supply side and assesses readiness, enabling
          demand-supply matching and portfolio-level scaling strategy.
        </p>
      </Card>
    </div>
  )
}
