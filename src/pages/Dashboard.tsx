import { Link } from 'react-router-dom'
import Card from '../components/common/Card'

const domains = [
  {
    name: 'Scaling Context',
    question: 'What conditions shape how innovations can be taken to scale?',
    icon: 'globe',
    to: '/domains/scaling-context',
  },
  {
    name: 'Sector',
    question: 'What sector-specific dynamics shape demand for agricultural innovation?',
    icon: 'layers',
    to: '/domains/sector',
  },
  {
    name: 'Stakeholders',
    question: 'Who are the key actors and what are their needs?',
    icon: 'users',
    to: '/domains/stakeholders',
  },
  {
    name: 'Enabling Environment',
    question: 'What conditions enable or constrain innovation scaling?',
    icon: 'shield',
    to: '/domains/enabling-environment',
  },
  {
    name: 'Resource & Investment',
    question: 'What resources are available and where are funding gaps?',
    icon: 'dollar',
    to: '/domains/resource-investment',
  },
  {
    name: 'Market Intelligence',
    question: 'What are the market dynamics and commercial pathways?',
    icon: 'chart',
    to: '/domains/market-intelligence',
  },
  {
    name: 'Innovation Portfolio',
    question: 'What innovations exist and how well do they match demand?',
    icon: 'lightbulb',
    to: '/domains/innovation-portfolio',
  },
]

const dimensions = [
  {
    name: 'Geography & Priority',
    description: 'Where should CGIAR focus its scaling efforts?',
    to: '/geography-priority',
    step: 1,
  },
  {
    name: 'Demand Signals',
    description: 'What do countries, funders, and partners actually need?',
    to: '/demand-signals',
    step: 2,
  },
  {
    name: 'Innovation Supply',
    description: 'What innovations does CGIAR have ready to offer?',
    to: '/innovation-supply',
    step: 3,
  },
  {
    name: 'Demand Gaps',
    description: 'Where does demand exceed available innovation supply?',
    to: '/demand-gaps',
    step: 4,
  },
  {
    name: 'Investment Feasibility',
    description: 'What is realistic given resources, partnerships, and capacity?',
    to: '/investment-feasibility',
    step: 5,
  },
]

const iconMap: Record<string, string> = {
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 0 1 4 9 15 15 0 0 1-4 9 15 15 0 0 1-4-9 15 15 0 0 1 4-9Z',
  layers: 'M12 2 2 7l10 5 10-5-10-5ZM2 17l10 5 10-5M2 12l10 5 10-5',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z',
  dollar: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
  chart: 'M18 20V10M12 20V4M6 20v-6',
  lightbulb: 'M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z',
}

function DomainIcon({ icon }: { icon: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-primary"
    >
      <path d={iconMap[icon] || iconMap.globe} />
    </svg>
  )
}

export default function Dashboard() {
  return (
    <div className="space-y-10 max-w-6xl">
      {/* Hero */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Demand Intelligence Platform
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Transforming fragmented demand signals into actionable scaling intelligence
        </p>
      </div>

      {/* 7 Domain Cards */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          7 Data Signal Domains
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {domains.map((d) => (
            <Link key={d.name} to={d.to} className="no-underline">
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start gap-3">
                  <DomainIcon icon={d.icon} />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">
                      {d.name}
                    </h4>
                    <p className="text-xs text-gray-500">{d.question}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* 5 Dimension Cards */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          5 Demand Signaling Dimensions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {dimensions.map((d) => (
            <Link key={d.name} to={d.to} className="no-underline">
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold">
                    {d.step}
                  </span>
                  <h4 className="font-semibold text-gray-900 text-sm">{d.name}</h4>
                </div>
                <p className="text-xs text-gray-500">{d.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Scaling Opportunity */}
      <section>
        <Link to="/scaling-opportunity" className="no-underline">
          <div className="bg-primary text-white rounded-lg p-6 text-center hover:bg-primary-dark transition-colors cursor-pointer">
            <h2 className="text-xl font-bold mb-2">Scaling Opportunity</h2>
            <p className="text-white/80 text-sm max-w-lg mx-auto">
              The convergence point where all 5 dimensions meet -- identifying where
              effective demand exists and innovations can be scaled with highest impact
              and feasibility.
            </p>
          </div>
        </Link>
      </section>
    </div>
  )
}
