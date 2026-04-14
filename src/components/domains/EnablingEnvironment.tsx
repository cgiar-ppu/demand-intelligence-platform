import Badge from '../common/Badge'
import Card from '../common/Card'

const countries = ['Nigeria', 'Bangladesh', 'Kenya']
const dimensions = ['Policy', 'Regulation', 'Institutions', 'Infrastructure']

const ratings: Record<string, Record<string, 'green' | 'amber' | 'red'>> = {
  Nigeria: { Policy: 'amber', Regulation: 'red', Institutions: 'amber', Infrastructure: 'red' },
  Bangladesh: { Policy: 'green', Regulation: 'amber', Institutions: 'green', Infrastructure: 'amber' },
  Kenya: { Policy: 'amber', Regulation: 'amber', Institutions: 'amber', Infrastructure: 'red' },
}

const colorMap = {
  green: 'bg-green-500',
  amber: 'bg-amber-400',
  red: 'bg-red-500',
}

const labelMap = {
  green: 'Enabling',
  amber: 'Mixed',
  red: 'Constraining',
}

export default function EnablingEnvironment() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Enabling Environment</h1>
          <Badge label="Domain" variant="primary" />
        </div>
        <p className="text-gray-600 italic">
          "What policy, institutional, and systemic conditions enable or constrain the scaling of innovations?"
        </p>
      </div>
      <Card title="Core Elements & Indicators">
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>Policy alignment and regulatory frameworks</li>
          <li>Institutional capacity and governance quality</li>
          <li>Financial inclusion and credit access</li>
          <li>Extension services and knowledge systems</li>
          <li>Digital infrastructure and connectivity</li>
        </ul>
      </Card>
      <div>
        <h2 className="text-base font-semibold text-gray-800 mb-1">Enabling Environment Assessment</h2>
        <p className="text-sm text-gray-500 mb-3">
          Traffic light assessment of enabling conditions across policy, regulation, institutions, and infrastructure for each target country.
        </p>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 px-3 text-left font-semibold text-gray-700">Country</th>
                  {dimensions.map(d => (
                    <th key={d} className="py-2 px-3 text-center font-semibold text-gray-700">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {countries.map(country => (
                  <tr key={country} className="border-b border-gray-100">
                    <td className="py-3 px-3 font-medium text-gray-800">{country}</td>
                    {dimensions.map(dim => {
                      const rating = ratings[country][dim]
                      return (
                        <td key={dim} className="py-3 px-3 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <div className={`w-6 h-6 rounded-full ${colorMap[rating]}`} />
                            <span className="text-xs text-gray-500">{labelMap[rating]}</span>
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
            {Object.entries(colorMap).map(([key, cls]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-full ${cls}`} />
                <span className="text-xs text-gray-500">{labelMap[key as keyof typeof labelMap]}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card title="Analytical Contributions">
        <p className="text-sm text-gray-600">
          Assesses the systemic conditions that facilitate or hinder innovation
          uptake, helping identify enabling interventions required for scaling.
        </p>
      </Card>
    </div>
  )
}
