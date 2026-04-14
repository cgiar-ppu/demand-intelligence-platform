import { Link } from 'react-router-dom'
import Card from '../components/common/Card'
import FrameworkSunburst from '../components/visualizations/FrameworkSunburst'
import DomainFlowSankey from '../components/visualizations/DomainFlowSankey'
import CountryDemandMap from '../components/visualizations/CountryDemandMap'
import DemandRadar from '../components/visualizations/DemandRadar'
import DemandClusterBubble from '../components/visualizations/DemandClusterBubble'
import InvestmentFeasibilityGauge from '../components/visualizations/InvestmentFeasibilityGauge'
import CropProductionChart from '../components/visualizations/CropProductionChart'
import {
  TOTAL_SEGMENTS,
  TOTAL_TPPS,
  TOTAL_CROPS,
  TOTAL_COUNTRIES,
} from '../data/glomipData'

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
      width="20"
      height="20"
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

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-1 h-6 bg-primary rounded-full" />
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      </div>
      {subtitle && (
        <p className="text-sm text-gray-500 ml-[19px]">{subtitle}</p>
      )}
    </div>
  )
}

export default function Dashboard() {
  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Demand Intelligence Platform
        </h1>
        <p className="text-lg text-primary font-medium mb-4">
          Transforming fragmented demand signals into actionable scaling intelligence
        </p>
        <p className="text-sm text-gray-600 max-w-3xl mx-auto leading-relaxed">
          The CGIAR Demand Intelligence Platform operationalizes a novel analytical framework
          that synthesizes seven data signal domains through five demand signaling dimensions
          to identify a single, evidence-based Scaling Opportunity. By systematically mapping
          where effective demand exists, what innovations are ready, and what gaps remain, the
          platform enables CGIAR to allocate resources with precision and scale impact where it
          matters most.
        </p>
      </div>

      {/* Framework Visualization Row */}
      <section>
        <SectionHeader
          title="The 7 - 5 - 1 Framework"
          subtitle="From data domains to scaling opportunity"
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <Card className="overflow-hidden">
            <FrameworkSunburst />
          </Card>
          <div className="space-y-4">
            <Card>
              <h3 className="text-lg font-bold text-primary mb-3">How It Works</h3>
              <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">7</span>
                  <p><strong>Data Signal Domains</strong> capture the full landscape of information -- from scaling context and sector dynamics to stakeholder needs, enabling environment, resources, markets, and innovation portfolios.</p>
                </div>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">5</span>
                  <p><strong>Demand Signaling Dimensions</strong> synthesize these domains into actionable analytics: Geography and Priority, Demand Signals, Innovation Supply, Demand Gaps, and Investment Feasibility.</p>
                </div>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary-dark text-white flex items-center justify-center text-xs font-bold">1</span>
                  <p><strong>Scaling Opportunity</strong> emerges at the convergence -- the precise point where effective demand, available innovations, and feasible investments align for maximum impact.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Country Overview Row */}
      <section>
        <SectionHeader
          title="Country Demand Landscape"
          subtitle="Active pilots and demand intelligence coverage"
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CountryDemandMap />
            </Card>
          </div>
          <div>
            <Card title="Effective Demand Scores">
              <InvestmentFeasibilityGauge />
            </Card>
          </div>
        </div>
      </section>

      {/* Analytics Deep Dive Row */}
      <section>
        <SectionHeader
          title="Data Flow Architecture"
          subtitle="How 7 domains flow through analytics into 5 dimensions and converge on scaling opportunity"
        />
        <Card>
          <DomainFlowSankey />
        </Card>
      </section>

      {/* Market Intelligence Preview */}
      <section>
        <SectionHeader
          title="Market Intelligence Preview"
          subtitle="Area harvested data from GloMIP -- CGIAR Global Market Intelligence Platform"
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card title="Crop Market Segments -- Area Harvested (ha)">
              <CropProductionChart />
            </Card>
          </div>
          <div>
            <Card>
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-lg font-bold text-primary mb-4">GloMIP Coverage</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-primary">{TOTAL_SEGMENTS}</div>
                      <div className="text-xs text-gray-500 mt-1">Market Segments</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-primary">{TOTAL_TPPS}</div>
                      <div className="text-xs text-gray-500 mt-1">TPPs</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-primary">{TOTAL_CROPS}</div>
                      <div className="text-xs text-gray-500 mt-1">Crops</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-primary">{TOTAL_COUNTRIES}</div>
                      <div className="text-xs text-gray-500 mt-1">Countries</div>
                    </div>
                  </div>
                </div>
                <Link
                  to="/market-intelligence"
                  className="mt-6 block text-center bg-primary text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors no-underline"
                >
                  Explore Market Intelligence &rarr;
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Demand Landscape Row */}
      <section>
        <SectionHeader
          title="Demand Analytics"
          subtitle="Cluster analysis and multi-country domain scoring"
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Demand Clusters by Sector">
            <DemandClusterBubble />
          </Card>
          <Card title="Domain Scores by Country">
            <DemandRadar />
          </Card>
        </div>
      </section>

      {/* Domain Cards Grid */}
      <section>
        <SectionHeader
          title="7 Data Signal Domains"
          subtitle="Explore each domain in detail"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {domains.map((d) => (
            <Link key={d.name} to={d.to} className="no-underline">
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer p-3">
                <div className="flex flex-col items-center text-center gap-2">
                  <DomainIcon icon={d.icon} />
                  <h4 className="font-semibold text-gray-900 text-xs leading-tight">
                    {d.name}
                  </h4>
                  <p className="text-[10px] text-gray-500 leading-snug">{d.question}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Scaling Opportunity CTA */}
      <section>
        <Link to="/scaling-opportunity" className="no-underline">
          <div className="bg-primary text-white rounded-lg p-8 text-center hover:bg-primary-dark transition-colors cursor-pointer shadow-lg">
            <h2 className="text-2xl font-bold mb-2">Scaling Opportunity</h2>
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
