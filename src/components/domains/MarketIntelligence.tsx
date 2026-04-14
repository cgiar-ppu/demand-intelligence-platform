import Badge from '../common/Badge'
import Card from '../common/Card'

export default function MarketIntelligence() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Market Intelligence</h1>
          <Badge label="Coming Soon" variant="accent" />
        </div>
        <p className="text-gray-600 italic">
          "What are the market dynamics, competitive landscape, and commercial pathways for scaling innovations?"
        </p>
      </div>
      <Card title="Core Elements & Indicators">
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>Market size and growth projections</li>
          <li>Competitive landscape and alternative solutions</li>
          <li>Value chain opportunities and bottlenecks</li>
          <li>Price dynamics and willingness to pay</li>
          <li>Market access and distribution channels</li>
        </ul>
      </Card>
      <Card title="Analytical Contributions">
        <p className="text-sm text-gray-600">
          Provides market-level intelligence to assess commercial viability
          and identify market-based pathways for innovation scaling.
        </p>
      </Card>
    </div>
  )
}
