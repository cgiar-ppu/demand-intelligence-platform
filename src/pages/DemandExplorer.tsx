import Card from '../components/common/Card'

const demandCards = [
  { name: 'Drought-tolerant Maize Varieties', country: 'Nigeria', score: 87, signals: 34, gaps: 3, feasibility: 82, status: 'ready' },
  { name: 'Climate-smart Rice Systems', country: 'Bangladesh', score: 82, signals: 28, gaps: 5, feasibility: 78, status: 'ready' },
  { name: 'Biofortified Cassava Flour', country: 'Nigeria', score: 79, signals: 22, gaps: 4, feasibility: 75, status: 'ready' },
  { name: 'Digital Advisory Platform', country: 'Kenya', score: 76, signals: 18, gaps: 6, feasibility: 80, status: 'progress' },
  { name: 'Improved Sorghum Varieties', country: 'Nigeria', score: 74, signals: 20, gaps: 5, feasibility: 70, status: 'progress' },
  { name: 'Rice Seed Multiplication', country: 'Bangladesh', score: 72, signals: 15, gaps: 7, feasibility: 68, status: 'progress' },
  { name: 'Cold-tolerant Potato Storage', country: 'Kenya', score: 62, signals: 12, gaps: 8, feasibility: 60, status: 'blocked' },
  { name: 'Cowpea Processing Technology', country: 'Nigeria', score: 58, signals: 10, gaps: 9, feasibility: 52, status: 'blocked' },
  { name: 'Aquaculture Feed Systems', country: 'Bangladesh', score: 65, signals: 14, gaps: 6, feasibility: 62, status: 'progress' },
  { name: 'Soil Health Diagnostic Kit', country: 'Kenya', score: 60, signals: 11, gaps: 7, feasibility: 55, status: 'progress' },
]

const statusColors: Record<string, { bg: string; strip: string; label: string }> = {
  ready: { bg: 'border-green-200', strip: 'bg-green-500', label: 'Scaling Ready' },
  progress: { bg: 'border-amber-200', strip: 'bg-amber-500', label: 'In Progress' },
  blocked: { bg: 'border-red-200', strip: 'bg-red-500', label: 'Blocked' },
}

const countryColors: Record<string, string> = {
  Nigeria: 'text-[#00695C]',
  Bangladesh: 'text-blue-700',
  Kenya: 'text-amber-700',
}

function ScoreCircle({ score }: { score: number }) {
  const color = score >= 75 ? '#00695C' : score >= 50 ? '#F9A825' : '#ef5350'
  const circumference = 2 * Math.PI * 18
  const offset = circumference - (score / 100) * circumference
  return (
    <div className="relative w-12 h-12">
      <svg viewBox="0 0 44 44" className="w-full h-full -rotate-90">
        <circle cx="22" cy="22" r="18" fill="none" stroke="#e5e7eb" strokeWidth="3" />
        <circle
          cx="22" cy="22" r="18" fill="none" stroke={color} strokeWidth="3"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color }}>
        {score}
      </span>
    </div>
  )
}

export default function DemandExplorer() {
  return (
    <div className="space-y-6 max-w-6xl">
      {/* Summary Stats Bar */}
      <div className="bg-[#00695C] text-white rounded-lg px-6 py-3 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-8 text-sm font-medium">
          <span><strong className="text-lg font-bold">247</strong> Demand Signals</span>
          <span className="text-white/40">|</span>
          <span><strong className="text-lg font-bold">135</strong> Innovations</span>
          <span className="text-white/40">|</span>
          <span><strong className="text-lg font-bold">60</strong> Scaling Opportunities</span>
          <span className="text-white/40">|</span>
          <span><strong className="text-lg font-bold">3</strong> Countries</span>
        </div>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Demand Explorer</h1>
        <p className="text-gray-600">
          Interactive exploration of demand-supply matching across geographies,
          sectors, and innovation types.
        </p>
      </div>

      {/* Filter Panel */}
      <Card>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Country</label>
            <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00695C]/30">
              <option>All Countries</option>
              <option>Nigeria</option>
              <option>Bangladesh</option>
              <option>Kenya</option>
            </select>
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Crop</label>
            <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00695C]/30">
              <option>All Crops</option>
              <option>Rice</option>
              <option>Maize</option>
              <option>Cassava</option>
              <option>Sorghum</option>
              <option>Wheat</option>
              <option>Cowpea</option>
              <option>Potato</option>
            </select>
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Domain</label>
            <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00695C]/30">
              <option>All Domains</option>
              <option>Scaling Context</option>
              <option>Sector</option>
              <option>Stakeholders</option>
              <option>Enabling Environment</option>
              <option>Market Intelligence</option>
            </select>
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Dimension</label>
            <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00695C]/30">
              <option>All Dimensions</option>
              <option>Geography & Priority</option>
              <option>Demand Signals</option>
              <option>Innovation Supply</option>
              <option>Demand Gaps</option>
              <option>Investment Feasibility</option>
            </select>
          </div>
          <button className="px-4 py-2 bg-[#00695C] text-white text-sm font-medium rounded-md hover:bg-[#00796B] transition-colors">
            Apply Filters
          </button>
        </div>
      </Card>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {demandCards.map((card, i) => {
          const s = statusColors[card.status]
          return (
            <div
              key={i}
              className={`bg-white rounded-lg border ${s.bg} shadow-sm overflow-hidden hover:shadow-md transition-shadow`}
            >
              <div className={`h-1 ${s.strip}`} />
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm">{card.name}</h3>
                    <p className={`text-xs font-medium mt-0.5 ${countryColors[card.country]}`}>{card.country}</p>
                  </div>
                  <ScoreCircle score={card.score} />
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                  <span><strong className="text-gray-700">{card.signals}</strong> signals</span>
                  <span><strong className="text-gray-700">{card.gaps}</strong> gaps</span>
                  <span><strong className="text-gray-700">{card.feasibility}%</strong> feasibility</span>
                </div>
                <div className="mt-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    card.status === 'ready' ? 'bg-green-50 text-green-700' :
                    card.status === 'progress' ? 'bg-amber-50 text-amber-700' :
                    'bg-red-50 text-red-700'
                  }`}>
                    {s.label}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
