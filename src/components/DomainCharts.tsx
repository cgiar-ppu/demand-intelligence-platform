import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, Legend, ScatterChart, Scatter, ZAxis,
} from "recharts";
import {
  type Innovation,
  getScalingContextData, getSectorData, getStakeholderData,
  getEnablingEnvData, getResourceData, getMarketData, getPortfolioData,
} from "@/lib/data";

const COLORS = ["#10b981", "#0ea5e9", "#8b5cf6", "#f59e0b", "#3b82f6", "#ec4899", "#6366f1", "#14b8a6"];
const TOOLTIP_STYLE = { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 };

function ChartTitle({ title, badge }: { title: string; badge?: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h4 className="text-sm font-bold">{title}</h4>
      {badge && <span className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">{badge}</span>}
    </div>
  );
}

function ChartCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass-card !p-4 ${className}`}>
      {children}
    </div>
  );
}

// ==================== SCALING CONTEXT ====================
// "Where does demand occur, and under what conditions?"
function ScalingContextCharts({ data }: { data: Innovation[] }) {
  const d = useMemo(() => getScalingContextData(data), [data]);
  return (
    <>
      <ChartCard>
        <ChartTitle title="Constraints vs Opportunities" badge="Biophysical & Socio-Economic" />
        <p className="text-xs text-muted-foreground mb-3">Geographies, value chains, and ecosystem conditions shaping where demand occurs.</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={d.constraintsVsOpportunities} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey="constraints" fill="#ef4444" radius={[3, 3, 0, 0]} name="Constraints" />
            <Bar dataKey="opportunities" fill="#10b981" radius={[3, 3, 0, 0]} name="Opportunities" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard>
        <ChartTitle title="Infrastructure Access (%)" badge="Coverage" />
        <p className="text-xs text-muted-foreground mb-3">Physical infrastructure availability feeding into Geography &amp; Priority dimension.</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={d.infrastructureAccess} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey="value" fill="#0d9488" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard>
        <ChartTitle title="Spatial Suitability by Country" badge="Score 0-10" />
        <p className="text-xs text-muted-foreground mb-3">Biophysical and institutional fit determining priority geography for scaling.</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={d.spatialSuitability}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="country" tick={{ fontSize: 10 }} />
            <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey="suitability" radius={[4, 4, 0, 0]}>
              {d.spatialSuitability.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </>
  );
}

// ==================== SECTOR ====================
// "What system or problem is being addressed?"
function SectorCharts({ data }: { data: Innovation[] }) {
  const d = useMemo(() => getSectorData(data), [data]);
  return (
    <>
      <ChartCard>
        <ChartTitle title="Sector Performance Indicators" badge="Feeding Demand Signals" />
        <p className="text-xs text-muted-foreground mb-3">Food, seed, water, climate action performance shaping sector-level demand signals.</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={d.performanceIndicators}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey="score" radius={[4, 4, 0, 0]}>
              {d.performanceIndicators.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard>
        <ChartTitle title="Sectoral Constraint Distribution" badge="%" />
        <p className="text-xs text-muted-foreground mb-3">Core sectoral bottlenecks reducing system productivity and amplifying demand gaps.</p>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={d.constraintsDistribution} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
              {d.constraintsDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={TOOLTIP_STYLE} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard>
        <ChartTitle title="Water-Energy-Food Nexus" badge="WEF Radar" />
        <p className="text-xs text-muted-foreground mb-3">Cross-sectoral interdependencies determining systemic investment priorities.</p>
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={d.wefNexus}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11 }} />
            <PolarRadiusAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
            <Radar dataKey="value" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} strokeWidth={2} dot={{ r: 3, fill: "#f59e0b" }} />
          </RadarChart>
        </ResponsiveContainer>
      </ChartCard>
    </>
  );
}

// ==================== STAKEHOLDERS ====================
// "Who shapes and legitimizes demand?"
function StakeholderCharts({ data }: { data: Innovation[] }) {
  const d = useMemo(() => getStakeholderData(data), [data]);
  return (
    <>
      <ChartCard>
        <ChartTitle title="Stakeholder Actor Composition" badge="Typology" />
        <p className="text-xs text-muted-foreground mb-3">Public, private, investors, NGOs, researchers, farmers shaping demand legitimacy.</p>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={d.stakeholderTypes} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
              {d.stakeholderTypes.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={TOOLTIP_STYLE} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard>
        <ChartTitle title="Adoption Gaps by Country" badge="Willingness vs Capacity" />
        <p className="text-xs text-muted-foreground mb-3">Gap between stated willingness and actual capacity to adopt — a key demand gap indicator.</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={d.adoptionGaps} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="country" tick={{ fontSize: 10 }} />
            <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey="willingness" fill="#f59e0b" radius={[3, 3, 0, 0]} name="Willingness" />
            <Bar dataKey="capacity" fill="#8b5cf6" radius={[3, 3, 0, 0]} name="Capacity" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard>
        <ChartTitle title="Stakeholder Network Strength" badge="Score 0-10" />
        <p className="text-xs text-muted-foreground mb-3">Trust, coordination, information flow and inclusivity across innovation networks.</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={d.networkStrength} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" domain={[0, 10]} tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey="score" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </>
  );
}

// ==================== ENABLING ENVIRONMENT ====================
// "Can demand translate into action?"
function EnablingEnvCharts({ data }: { data: Innovation[] }) {
  const d = useMemo(() => getEnablingEnvData(data), [data]);
  return (
    <>
      <ChartCard>
        <ChartTitle title="Policy & Institutional Strength" badge="By Country" />
        <p className="text-xs text-muted-foreground mb-3">Policies, institutions, and governance conditions enabling demand to translate into action.</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={d.policyStrength} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="country" tick={{ fontSize: 10 }} />
            <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="policy" fill="#10b981" radius={[3, 3, 0, 0]} name="Policy" />
            <Bar dataKey="regulatory" fill="#0ea5e9" radius={[3, 3, 0, 0]} name="Regulatory" />
            <Bar dataKey="institutional" fill="#8b5cf6" radius={[3, 3, 0, 0]} name="Institutional" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard>
        <ChartTitle title="Governance Quality" badge="Score 0-10" />
        <p className="text-xs text-muted-foreground mb-3">Transparency, accountability, participation and rule of law feeding Investment Feasibility.</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={d.governanceQuality} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" domain={[0, 10]} tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey="score" radius={[0, 4, 4, 0]}>
              {d.governanceQuality.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </>
  );
}

// ==================== RESOURCE & INVESTMENT ====================
// "Is demand fundable?"
function ResourceCharts({ data }: { data: Innovation[] }) {
  const d = useMemo(() => getResourceData(data), [data]);
  return (
    <>
      <ChartCard>
        <ChartTitle title="Capital Flow Distribution" badge="By Source" />
        <p className="text-xs text-muted-foreground mb-3">Finance and credit systems, financial actors, instruments and capital flows for scaling.</p>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={d.fundingDistribution} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
              {d.fundingDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={TOOLTIP_STYLE} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard>
        <ChartTitle title="Finance Accessibility by Country" badge="Access & Instruments" />
        <p className="text-xs text-muted-foreground mb-3">Access to financial instruments and infrastructure enabling investment feasibility.</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={d.financeAccessibility} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="country" tick={{ fontSize: 10 }} />
            <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey="access" fill="#0ea5e9" radius={[3, 3, 0, 0]} name="Access" />
            <Bar dataKey="instruments" fill="#f59e0b" radius={[3, 3, 0, 0]} name="Instruments" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard>
        <ChartTitle title="Risk vs Return Profile" badge="Investment Criteria" />
        <p className="text-xs text-muted-foreground mb-3">Investment criteria and risk-return profiles for key innovation archetypes.</p>
        <ResponsiveContainer width="100%" height={220}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" dataKey="risk" name="Risk" domain={[0, 10]} tick={{ fontSize: 11 }} label={{ value: "Risk", position: "bottom", fontSize: 11 }} />
            <YAxis type="number" dataKey="return" name="Return" domain={[0, 10]} tick={{ fontSize: 11 }} label={{ value: "Return", angle: -90, position: "insideLeft", fontSize: 11 }} />
            <ZAxis type="number" range={[80, 200]} />
            <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value: number, name: string) => [value, name]} />
            <Scatter data={d.riskReturn} fill="#0ea5e9" name="Innovations" />
          </ScatterChart>
        </ResponsiveContainer>
      </ChartCard>
    </>
  );
}

// ==================== MARKET INTELLIGENCE ====================
// "Is demand economically viable?"
function MarketCharts({ data }: { data: Innovation[] }) {
  const d = useMemo(() => getMarketData(data), [data]);
  return (
    <>
      <ChartCard>
        <ChartTitle title="Demand Signal Trends" badge="6-Month" />
        <p className="text-xs text-muted-foreground mb-3">Demand trends, prices, and consumer behavior driving Investment Feasibility and Demand Gaps.</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={d.demandTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="demand" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} name="Demand Signal" />
            <Line type="monotone" dataKey="supply" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} name="Supply Response" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard>
        <ChartTitle title="Price Signals by Country" badge="Volatility & Margin" />
        <p className="text-xs text-muted-foreground mb-3">Price volatility and value-chain margins indicating market access conditions.</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={d.priceSignals} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="country" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey="volatility" fill="#f59e0b" radius={[3, 3, 0, 0]} name="Volatility" />
            <Bar dataKey="margin" fill="#10b981" radius={[3, 3, 0, 0]} name="Margin" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard>
        <ChartTitle title="Regional Demand Intensity" badge="Score 0-10" />
        <p className="text-xs text-muted-foreground mb-3">Aggregate demand signal strength by country indicating market readiness.</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={d.regionalDemand}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="country" tick={{ fontSize: 10 }} />
            <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey="demand" radius={[4, 4, 0, 0]}>
              {d.regionalDemand.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </>
  );
}

// ==================== INNOVATION PORTFOLIO ====================
// "What solutions exist, are possible, and fit?"
function PortfolioCharts({ data }: { data: Innovation[] }) {
  const d = useMemo(() => getPortfolioData(data), [data]);
  return (
    <>
      <ChartCard>
        <ChartTitle title="Innovation Supply Readiness" badge="Portfolio Levels" />
        <p className="text-xs text-muted-foreground mb-3">Inventory, pipeline readiness, and adoption maturity feeding Innovation Supply dimension.</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={d.readinessLevels}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="level" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {d.readinessLevels.map((_, i) => <Cell key={i} fill={["#ef4444", "#f59e0b", "#0ea5e9", "#10b981"][i]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard>
        <ChartTitle title="Innovation Typology" badge="Delivery Models" />
        <p className="text-xs text-muted-foreground mb-3">Innovation archetypes and delivery models shaping supply readiness and bundling options.</p>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={d.innovationTypes} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
              {d.innovationTypes.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={TOOLTIP_STYLE} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard>
        <ChartTitle title="Portfolio Performance Radar" badge="5-Dimension Fit" />
        <p className="text-xs text-muted-foreground mb-3">Portfolio alignment across Geography, Demand, Supply, Feasibility, and evidence base.</p>
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={d.performanceRadar}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis dataKey="axis" tick={{ fontSize: 10 }} />
            <PolarRadiusAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
            <Radar dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.15} strokeWidth={2} dot={{ r: 3, fill: "#8b5cf6" }} />
          </RadarChart>
        </ResponsiveContainer>
      </ChartCard>
    </>
  );
}

// ==================== MAIN EXPORT ====================
interface DomainChartsProps {
  data: Innovation[];
  activeDomain: string;
}

const DOMAINS = [
  { id: "scaling", label: "Scaling Context" },
  { id: "sector", label: "Sector" },
  { id: "stakeholders", label: "Stakeholders" },
  { id: "enabling", label: "Enabling Env." },
  { id: "resource", label: "Resources" },
  { id: "market", label: "Market Intel." },
  { id: "portfolio", label: "Portfolio" },
];

export { DOMAINS };

export function DomainCharts({ data, activeDomain }: DomainChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {activeDomain === "scaling" && <ScalingContextCharts data={data} />}
      {activeDomain === "sector" && <SectorCharts data={data} />}
      {activeDomain === "stakeholders" && <StakeholderCharts data={data} />}
      {activeDomain === "enabling" && <EnablingEnvCharts data={data} />}
      {activeDomain === "resource" && <ResourceCharts data={data} />}
      {activeDomain === "market" && <MarketCharts data={data} />}
      {activeDomain === "portfolio" && <PortfolioCharts data={data} />}
    </div>
  );
}
