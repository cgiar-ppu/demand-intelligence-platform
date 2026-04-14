import Badge from '../components/common/Badge'
import Card from '../components/common/Card'
import GapWaterfall from '../components/visualizations/GapWaterfall'
import GapRadar from '../components/visualizations/GapRadar'

const criticalGaps = [
  { desc: 'No seed law enforcement for biofortified varieties', domain: 'Institutional/Policy', country: 'Nigeria', severity: 5, innovation: 'Biofortified cassava', status: 'Open' },
  { desc: 'Limited cold chain for potato storage', domain: 'Infrastructure', country: 'Bangladesh', severity: 4, innovation: 'Potato varieties', status: 'In Progress' },
  { desc: 'Absence of digital literacy among smallholders', domain: 'Network/Knowledge', country: 'Kenya', severity: 4, innovation: 'Digital advisory tools', status: 'Open' },
  { desc: 'Fragmented extension service delivery', domain: 'System Readiness', country: 'Nigeria', severity: 5, innovation: 'Agronomic practices', status: 'Open' },
  { desc: 'No certified seed multiplication system', domain: 'Market/Business', country: 'Bangladesh', severity: 4, innovation: 'Rice seed systems', status: 'In Progress' },
  { desc: 'Gender barriers to land access', domain: 'Gender/Inclusion', country: 'Nigeria', severity: 5, innovation: 'All crop varieties', status: 'Open' },
  { desc: 'Weak farmer organization networks', domain: 'Network/Knowledge', country: 'Kenya', severity: 3, innovation: 'Business models', status: 'In Progress' },
  { desc: 'Limited irrigation infrastructure', domain: 'Infrastructure', country: 'Nigeria', severity: 4, innovation: 'Drought-tolerant maize', status: 'Open' },
  { desc: 'Inadequate fertilizer subsidy targeting', domain: 'Institutional/Policy', country: 'Bangladesh', severity: 4, innovation: 'Soil health toolkit', status: 'Open' },
  { desc: 'No crop insurance products available', domain: 'Market/Business', country: 'Kenya', severity: 3, innovation: 'Climate-smart varieties', status: 'Open' },
  { desc: 'Low mobile phone penetration in rural areas', domain: 'Infrastructure', country: 'Nigeria', severity: 3, innovation: 'Digital advisory', status: 'In Progress' },
  { desc: 'Lack of post-harvest processing facilities', domain: 'Market/Business', country: 'Bangladesh', severity: 4, innovation: 'Cassava processing', status: 'Open' },
  { desc: 'Regulatory barriers to GM crop deployment', domain: 'Institutional/Policy', country: 'Kenya', severity: 5, innovation: 'Biotech varieties', status: 'Open' },
  { desc: 'Youth migration from farming communities', domain: 'User Relevance', country: 'Nigeria', severity: 3, innovation: 'Mechanization', status: 'Resolved' },
  { desc: 'Limited access to microfinance', domain: 'Market/Business', country: 'Bangladesh', severity: 4, innovation: 'Business models', status: 'In Progress' },
]

function SeverityBadge({ level }: { level: number }) {
  const colors: Record<number, string> = {
    5: 'bg-red-100 text-red-800',
    4: 'bg-orange-100 text-orange-800',
    3: 'bg-yellow-100 text-yellow-800',
    2: 'bg-green-100 text-green-800',
    1: 'bg-gray-100 text-gray-600',
  }
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded-full ${colors[level] || colors[1]}`}>
      {level}
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Open: 'bg-red-50 text-red-700',
    'In Progress': 'bg-amber-50 text-amber-700',
    Resolved: 'bg-green-50 text-green-700',
  }
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}

export default function DemandGaps() {
  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Demand Gaps</h1>
          <Badge label="Dimension 4" variant="primary" />
        </div>
        <p className="text-gray-600 italic">
          "What prevents scaling?"
        </p>
      </div>
      <Card title="Overview">
        <p className="text-sm text-gray-700">
          Identifies mismatches between expressed demand and available innovations
          by comparing demand signal clusters with the innovation portfolio,
          revealing gaps that require new R&D or partnership strategies.
        </p>
      </Card>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Gap Diagnostic Waterfall</h2>
        <p className="text-sm text-gray-500 mb-4">
          How 247 demand signals are filtered through barrier categories, leaving 60 scaling-ready opportunities.
        </p>
        <Card>
          <GapWaterfall />
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Gap Severity Radar</h2>
        <p className="text-sm text-gray-500 mb-4">
          Gap severity across six gap types for each target country, highlighting where the most critical barriers exist.
        </p>
        <Card>
          <GapRadar />
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Critical Gaps Register</h2>
        <p className="text-sm text-gray-500 mb-4">
          Top 15 most critical gaps identified across target countries, ranked by severity.
        </p>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 px-3 font-semibold text-gray-700">Gap Description</th>
                  <th className="py-2 px-3 font-semibold text-gray-700">Domain</th>
                  <th className="py-2 px-3 font-semibold text-gray-700">Country</th>
                  <th className="py-2 px-3 font-semibold text-gray-700 text-center">Severity</th>
                  <th className="py-2 px-3 font-semibold text-gray-700">Innovation Affected</th>
                  <th className="py-2 px-3 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {criticalGaps.map((gap, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-2 px-3 text-gray-800">{gap.desc}</td>
                    <td className="py-2 px-3 text-gray-600 whitespace-nowrap">{gap.domain}</td>
                    <td className="py-2 px-3 text-gray-600">{gap.country}</td>
                    <td className="py-2 px-3 text-center"><SeverityBadge level={gap.severity} /></td>
                    <td className="py-2 px-3 text-gray-600">{gap.innovation}</td>
                    <td className="py-2 px-3"><StatusBadge status={gap.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
