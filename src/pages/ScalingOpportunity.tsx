import Card from '../components/common/Card'

export default function ScalingOpportunity() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-primary text-white rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">Scaling Opportunity</h1>
        <p className="text-white/80">
          The convergence point of all five demand signaling dimensions.
          This is where effective demand is identified -- innovations that match
          real needs, in priority geographies, with feasible investment pathways.
        </p>
      </div>
      <Card title="How It Works">
        <p className="text-sm text-gray-700 mb-3">
          Scaling Opportunity represents the center of the analytical framework,
          synthesizing outputs from all five dimensions:
        </p>
        <ol className="list-decimal pl-5 text-sm text-gray-700 space-y-2">
          <li>
            <strong>Geography & Priority</strong> identifies where to focus
          </li>
          <li>
            <strong>Demand Signals</strong> captures what is needed
          </li>
          <li>
            <strong>Innovation Supply</strong> maps what is available
          </li>
          <li>
            <strong>Demand Gaps</strong> reveals where supply falls short
          </li>
          <li>
            <strong>Investment Feasibility</strong> determines what is achievable
          </li>
        </ol>
      </Card>
      <Card title="Outputs">
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>Ranked scaling opportunities with composite scores</li>
          <li>Country-innovation matching recommendations</li>
          <li>Investment case summaries for priority opportunities</li>
          <li>Portfolio-level scaling strategy guidance</li>
        </ul>
      </Card>
    </div>
  )
}
