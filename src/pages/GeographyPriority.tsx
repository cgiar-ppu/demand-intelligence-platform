import Badge from '../components/common/Badge'
import Card from '../components/common/Card'
import PriorityZonesChoropleth from '../components/visualizations/PriorityZonesChoropleth'
import SubnationalHeatmap from '../components/visualizations/SubnationalHeatmap'
import PriorityRankingBar from '../components/visualizations/PriorityRankingBar'

export default function GeographyPriority() {
  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Geography & Priority</h1>
          <Badge label="Dimension 1" variant="primary" />
        </div>
        <p className="text-gray-600 italic">
          "Where is demand, and for whom?"
        </p>
      </div>
      <Card title="Overview">
        <p className="text-sm text-gray-700">
          This dimension prioritizes geographies based on need intensity, scaling
          potential, and strategic alignment with CGIAR's mission. It synthesizes
          data from all seven domains to produce geography-level priority scores.
        </p>
      </Card>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Priority Zones Map</h2>
        <p className="text-sm text-gray-500 mb-4">
          Demand priority scores across Africa and South Asia. Bubble size and color intensity reflect composite priority scoring.
        </p>
        <Card>
          <PriorityZonesChoropleth />
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Subnational Heatmap -- Nigeria</h2>
        <p className="text-sm text-gray-500 mb-4">
          Regional breakdown of population, poverty, agricultural land, and demand priority across Nigeria's six geopolitical zones.
        </p>
        <Card>
          <SubnationalHeatmap />
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Priority Zone Rankings</h2>
        <p className="text-sm text-gray-500 mb-4">
          Top 10 priority zones ranked by composite demand score across all three target countries.
        </p>
        <Card>
          <PriorityRankingBar />
        </Card>
      </div>
    </div>
  )
}
