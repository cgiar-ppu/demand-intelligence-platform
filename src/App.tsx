import { Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import Footer from './components/layout/Footer'
import Dashboard from './pages/Dashboard'
import DemandExplorer from './pages/DemandExplorer'
import GeographyPriority from './pages/GeographyPriority'
import DemandSignals from './pages/DemandSignals'
import InnovationSupply from './pages/InnovationSupply'
import DemandGaps from './pages/DemandGaps'
import InvestmentFeasibility from './pages/InvestmentFeasibility'
import ScalingOpportunity from './pages/ScalingOpportunity'
import ScalingContext from './components/domains/ScalingContext'
import Sector from './components/domains/Sector'
import Stakeholders from './components/domains/Stakeholders'
import EnablingEnvironment from './components/domains/EnablingEnvironment'
import ResourceInvestment from './components/domains/ResourceInvestment'
import MarketIntelligence from './components/domains/MarketIntelligence'
import InnovationPortfolio from './components/domains/InnovationPortfolio'
import GloMIPExplorer from './pages/GloMIPExplorer'
import Framework from './pages/Framework'

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/explorer" element={<DemandExplorer />} />
            <Route path="/geography-priority" element={<GeographyPriority />} />
            <Route path="/demand-signals" element={<DemandSignals />} />
            <Route path="/innovation-supply" element={<InnovationSupply />} />
            <Route path="/demand-gaps" element={<DemandGaps />} />
            <Route path="/investment-feasibility" element={<InvestmentFeasibility />} />
            <Route path="/scaling-opportunity" element={<ScalingOpportunity />} />
            <Route path="/domains/scaling-context" element={<ScalingContext />} />
            <Route path="/domains/sector" element={<Sector />} />
            <Route path="/domains/stakeholders" element={<Stakeholders />} />
            <Route path="/domains/enabling-environment" element={<EnablingEnvironment />} />
            <Route path="/domains/resource-investment" element={<ResourceInvestment />} />
            <Route path="/domains/market-intelligence" element={<MarketIntelligence />} />
            <Route path="/domains/innovation-portfolio" element={<InnovationPortfolio />} />
            <Route path="/market-intelligence" element={<GloMIPExplorer />} />
            <Route path="/framework" element={<Framework />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default App
