import Card from '../components/common/Card'
import ConvergenceDiagram from '../components/visualizations/ConvergenceDiagram'
import PortfolioBalance from '../components/visualizations/PortfolioBalance'

const opportunities = [
  { rank: 1, name: 'Drought-tolerant maize - Northern Nigeria', score: 87, geo: 92, demand: 88, supply: 85, gaps: 78, invest: 82 },
  { rank: 2, name: 'Climate-smart rice - Bangladesh Haor', score: 82, geo: 85, demand: 90, supply: 80, gaps: 72, invest: 78 },
  { rank: 3, name: 'Biofortified cassava - Southern Nigeria', score: 79, geo: 82, demand: 78, supply: 85, gaps: 68, invest: 75 },
  { rank: 4, name: 'Digital advisory - Kenya Highlands', score: 76, geo: 78, demand: 72, supply: 82, gaps: 70, invest: 80 },
  { rank: 5, name: 'Improved sorghum - NW Nigeria', score: 74, geo: 80, demand: 75, supply: 72, gaps: 65, invest: 70 },
  { rank: 6, name: 'Rice seed systems - Rangpur Bangladesh', score: 72, geo: 75, demand: 82, supply: 68, gaps: 62, invest: 68 },
  { rank: 7, name: 'Wheat varieties - Rift Valley Kenya', score: 70, geo: 72, demand: 68, supply: 75, gaps: 60, invest: 72 },
  { rank: 8, name: 'Cowpea value chain - NE Nigeria', score: 68, geo: 70, demand: 72, supply: 65, gaps: 58, invest: 65 },
  { rank: 9, name: 'Aquaculture systems - Khulna Bangladesh', score: 65, geo: 68, demand: 70, supply: 60, gaps: 55, invest: 62 },
  { rank: 10, name: 'Potato storage - Central Kenya', score: 62, geo: 65, demand: 58, supply: 68, gaps: 52, invest: 60 },
  { rank: 11, name: 'Soil health toolkit - Nigeria', score: 60, geo: 62, demand: 65, supply: 58, gaps: 50, invest: 55 },
  { rank: 12, name: 'Cassava processing - Southern Nigeria', score: 58, geo: 60, demand: 62, supply: 55, gaps: 48, invest: 52 },
  { rank: 13, name: 'Millet varieties - Niger/Nigeria', score: 55, geo: 58, demand: 55, supply: 52, gaps: 45, invest: 48 },
  { rank: 14, name: 'Livestock feed - Western Kenya', score: 52, geo: 55, demand: 50, supply: 55, gaps: 42, invest: 50 },
  { rank: 15, name: 'Fertilizer micro-dosing - Sahel', score: 48, geo: 50, demand: 48, supply: 50, gaps: 38, invest: 45 },
]

function SparkBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = (value / max) * 100
  const color = value >= 75 ? '#00695C' : value >= 50 ? '#F9A825' : '#ef5350'
  return (
    <div className="flex items-center gap-1">
      <div className="w-12 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs text-gray-500 w-6 text-right">{value}</span>
    </div>
  )
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 75 ? 'bg-emerald-100 text-emerald-800' : score >= 50 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${score}%`,
            backgroundColor: score >= 75 ? '#00695C' : score >= 50 ? '#F9A825' : '#ef5350',
          }}
        />
      </div>
      <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded-full ${color}`}>
        {score}
      </span>
    </div>
  )
}

export default function ScalingOpportunity() {
  return (
    <div className="space-y-8 max-w-6xl">
      <div className="bg-[#00695C] text-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">Scaling Opportunity</h1>
        <p className="text-white/80">
          The convergence point of all five demand signaling dimensions.
          This is where effective demand is identified -- innovations that match
          real needs, in priority geographies, with feasible investment pathways.
        </p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Convergence Diagram</h2>
        <p className="text-sm text-gray-500 mb-4">
          Top scaling opportunities as central nodes connected to the five dimensions they score well on. Node size reflects opportunity score, link color reflects the dimension.
        </p>
        <Card>
          <ConvergenceDiagram />
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Opportunity Rankings</h2>
        <p className="text-sm text-gray-500 mb-4">
          Top 15 scaling opportunities ranked by composite score with dimension-level breakdowns.
        </p>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 px-2 font-semibold text-gray-700 w-8">#</th>
                  <th className="py-2 px-2 font-semibold text-gray-700">Opportunity</th>
                  <th className="py-2 px-2 font-semibold text-gray-700 w-36">Composite Score</th>
                  <th className="py-2 px-2 font-semibold text-gray-700 text-center w-20">Geo</th>
                  <th className="py-2 px-2 font-semibold text-gray-700 text-center w-20">Demand</th>
                  <th className="py-2 px-2 font-semibold text-gray-700 text-center w-20">Supply</th>
                  <th className="py-2 px-2 font-semibold text-gray-700 text-center w-20">Gaps</th>
                  <th className="py-2 px-2 font-semibold text-gray-700 text-center w-20">Invest</th>
                </tr>
              </thead>
              <tbody>
                {opportunities.map((opp) => (
                  <tr key={opp.rank} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-2 px-2 font-bold text-gray-500">{opp.rank}</td>
                    <td className="py-2 px-2 text-gray-800 font-medium">{opp.name}</td>
                    <td className="py-2 px-2"><ScoreBadge score={opp.score} /></td>
                    <td className="py-2 px-2"><SparkBar value={opp.geo} /></td>
                    <td className="py-2 px-2"><SparkBar value={opp.demand} /></td>
                    <td className="py-2 px-2"><SparkBar value={opp.supply} /></td>
                    <td className="py-2 px-2"><SparkBar value={opp.gaps} /></td>
                    <td className="py-2 px-2"><SparkBar value={opp.invest} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Portfolio Balance</h2>
        <p className="text-sm text-gray-500 mb-4">
          Distribution of 47 active opportunities across readiness-impact quadrants, informing portfolio-level strategy.
        </p>
        <Card>
          <PortfolioBalance />
        </Card>
      </div>
    </div>
  )
}
