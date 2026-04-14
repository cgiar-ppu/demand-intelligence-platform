import Badge from '../common/Badge'
import Card from '../common/Card'
import CommodityPriceLine from '../visualizations/CommodityPriceLine'

export default function MarketIntelligence() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Market Intelligence</h1>
          <Badge label="Domain" variant="primary" />
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
      <div>
        <h2 className="text-base font-semibold text-gray-800 mb-1">Commodity Price Trends</h2>
        <p className="text-sm text-gray-500 mb-3">
          Monthly price trends ($/ton) for rice, maize, and cassava over a 12-month period, showing seasonal dynamics.
        </p>
        <Card>
          <CommodityPriceLine />
        </Card>
      </div>
      <Card title="Analytical Contributions">
        <p className="text-sm text-gray-600">
          Provides market-level intelligence to assess commercial viability
          and identify market-based pathways for innovation scaling.
        </p>
      </Card>
    </div>
  )
}
