import Badge from '../components/common/Badge'
import Card from '../components/common/Card'
import InnovationPipeline from '../components/visualizations/InnovationPipeline'
import InnovationCropMatrix from '../components/visualizations/InnovationCropMatrix'
import InnovationByCenter from '../components/visualizations/InnovationByCenter'

export default function InnovationSupply() {
  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Innovation Supply</h1>
          <Badge label="Dimension 3" variant="primary" />
        </div>
        <p className="text-gray-600 italic">
          "What solutions exist?"
        </p>
      </div>
      <Card title="Overview">
        <p className="text-sm text-gray-700">
          Maps the full innovation portfolio across CGIAR centers, assessing
          maturity levels, evidence base, and scaling readiness to determine
          what is available to meet expressed demand.
        </p>
      </Card>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Innovation Maturity Pipeline</h2>
        <p className="text-sm text-gray-500 mb-4">
          135 CGIAR innovations distributed across five maturity stages, from early discovery through commercialization.
        </p>
        <Card>
          <InnovationPipeline />
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Innovation-Crop Matrix</h2>
        <p className="text-sm text-gray-500 mb-4">
          Bubble matrix showing innovation counts by crop and innovation type. Larger bubbles indicate more available innovations.
        </p>
        <Card>
          <InnovationCropMatrix />
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Innovation Readiness by CGIAR Center</h2>
        <p className="text-sm text-gray-500 mb-4">
          Innovation counts per CGIAR research center, segmented by readiness level (Lab, Field, Market).
        </p>
        <Card>
          <InnovationByCenter />
        </Card>
      </div>
    </div>
  )
}
