import { NavLink } from 'react-router-dom'

const dimensionLinks = [
  { to: '/geography-priority', label: 'Geography & Priority' },
  { to: '/demand-signals', label: 'Demand Signals' },
  { to: '/innovation-supply', label: 'Innovation Supply' },
  { to: '/demand-gaps', label: 'Demand Gaps' },
  { to: '/investment-feasibility', label: 'Investment Feasibility' },
  { to: '/scaling-opportunity', label: 'Scaling Opportunity' },
]

const domainLinks = [
  { to: '/domains/scaling-context', label: 'Scaling Context' },
  { to: '/domains/sector', label: 'Sector' },
  { to: '/domains/stakeholders', label: 'Stakeholders' },
  { to: '/domains/enabling-environment', label: 'Enabling Environment' },
  { to: '/domains/resource-investment', label: 'Resource & Investment' },
  { to: '/domains/market-intelligence', label: 'Market Intelligence' },
  { to: '/domains/innovation-portfolio', label: 'Innovation Portfolio' },
]

function SidebarSection({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div className="mb-6">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2 px-3">
        {title}
      </h3>
      <ul className="space-y-1">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                `block px-3 py-1.5 text-sm rounded transition-colors ${
                  isActive
                    ? 'bg-primary text-white font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Sidebar() {
  return (
    <aside className="w-60 bg-white border-r border-gray-200 p-4 shrink-0 overflow-y-auto">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `block px-3 py-2 mb-4 text-sm font-medium rounded transition-colors ${
            isActive
              ? 'bg-primary text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`
        }
        end
      >
        Dashboard
      </NavLink>
      <SidebarSection title="Demand Dimensions" links={dimensionLinks} />
      <SidebarSection title="Data Domains" links={domainLinks} />
    </aside>
  )
}
