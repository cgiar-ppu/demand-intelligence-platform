import Card from '../components/common/Card'
import MarketIntelligencePanel from '../components/visualizations/MarketIntelligencePanel'
import CropProductionChart from '../components/visualizations/CropProductionChart'
import {
  TOTAL_SEGMENTS,
  TOTAL_TPPS,
  TOTAL_CROPS,
  TOTAL_COUNTRIES,
} from '../data/glomipData'

export default function GloMIPExplorer() {
  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Market Intelligence
        </h1>
        <p className="text-lg text-primary font-medium mb-2">
          Powered by GloMIP
        </p>
        <p className="text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Real market data from CGIAR's Global Market Intelligence Platform.
          Explore seed product market segments, target product profiles, and
          crop coverage across {TOTAL_CROPS} crops in {TOTAL_COUNTRIES} countries.
        </p>
        {/* Data Source Badge */}
        <div className="mt-4 inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 text-sm text-green-800">
          <span className="font-medium">Real data from glomip.cgiar.org</span>
          <span className="text-green-500">--</span>
          <span>{TOTAL_SEGMENTS} market segments, {TOTAL_TPPS} TPPs</span>
        </div>
      </div>

      {/* Crop Area Harvested Overview */}
      <section>
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1 h-6 bg-primary rounded-full" />
            <h2 className="text-xl font-bold text-gray-800">
              Crop Market Segments -- Area Harvested
            </h2>
          </div>
          <p className="text-sm text-gray-500 ml-[19px]">
            Total area harvested (hectares) per crop across Nigeria, Bangladesh, and Kenya from GloMIP market segments
          </p>
        </div>
        <Card>
          <CropProductionChart />
        </Card>
      </section>

      {/* Market Intelligence Panel */}
      <section>
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1 h-6 bg-primary rounded-full" />
            <h2 className="text-xl font-bold text-gray-800">
              GloMIP Market Intelligence
            </h2>
          </div>
          <p className="text-sm text-gray-500 ml-[19px]">
            Market coverage, seed product market segments, and target product profiles from the CGIAR Global Market Intelligence Platform
          </p>
        </div>
        <MarketIntelligencePanel />
      </section>

      {/* Data Source Footer */}
      <footer className="border-t border-gray-200 pt-6 pb-4">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-500">
            Data sourced from{' '}
            <a
              href="https://glomip.cgiar.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-medium hover:underline"
            >
              GloMIP (glomip.cgiar.org)
            </a>
            {' '}&mdash; CGIAR Initiative on Market Intelligence, led by IRRI.
            Platform covers {TOTAL_SEGMENTS} seed product market segments and {TOTAL_TPPS} target product profiles
            across {TOTAL_CROPS} crops in {TOTAL_COUNTRIES} countries.
          </p>
        </div>
      </footer>
    </div>
  )
}
