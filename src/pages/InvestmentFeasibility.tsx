import Badge from '../components/common/Badge'
import Card from '../components/common/Card'
import InvestmentScorecard from '../components/visualizations/InvestmentScorecard'
import FundingLandscape from '../components/visualizations/FundingLandscape'
import CostBenefitMatrix from '../components/visualizations/CostBenefitMatrix'

export default function InvestmentFeasibility() {
  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Investment Feasibility</h1>
          <Badge label="Dimension 5" variant="primary" />
        </div>
        <p className="text-gray-600 italic">
          "Is it financially viable?"
        </p>
      </div>
      <Card title="Overview">
        <p className="text-sm text-gray-700">
          Assesses the feasibility of scaling opportunities by analyzing available
          funding, partnership capacity, implementation readiness, and risk factors
          to determine what can realistically be pursued.
        </p>
      </Card>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Investment Readiness Scorecard</h2>
        <p className="text-sm text-gray-500 mb-4">
          Country-level investment readiness with overall scores and sub-metrics for ROI potential, risk, institutional support, and market readiness.
        </p>
        <Card>
          <InvestmentScorecard />
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Funding Landscape (2020-2026)</h2>
        <p className="text-sm text-gray-500 mb-4">
          Stacked area chart showing funding flows by source, illustrating the growing government share and overall investment trajectory.
        </p>
        <Card>
          <FundingLandscape />
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Cost-Benefit Matrix</h2>
        <p className="text-sm text-gray-500 mb-4">
          Innovation portfolio plotted by implementation cost vs. expected impact. Bubble size indicates confidence level. Quadrants identify quick wins, strategic bets, and efficiency plays.
        </p>
        <Card>
          <CostBenefitMatrix />
        </Card>
      </div>
    </div>
  )
}
