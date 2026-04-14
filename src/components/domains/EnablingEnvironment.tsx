import Badge from '../common/Badge'
import Card from '../common/Card'

export default function EnablingEnvironment() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Enabling Environment</h1>
          <Badge label="Coming Soon" variant="accent" />
        </div>
        <p className="text-gray-600 italic">
          "What policy, institutional, and systemic conditions enable or constrain the scaling of innovations?"
        </p>
      </div>
      <Card title="Core Elements & Indicators">
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>Policy alignment and regulatory frameworks</li>
          <li>Institutional capacity and governance quality</li>
          <li>Financial inclusion and credit access</li>
          <li>Extension services and knowledge systems</li>
          <li>Digital infrastructure and connectivity</li>
        </ul>
      </Card>
      <Card title="Analytical Contributions">
        <p className="text-sm text-gray-600">
          Assesses the systemic conditions that facilitate or hinder innovation
          uptake, helping identify enabling interventions required for scaling.
        </p>
      </Card>
    </div>
  )
}
