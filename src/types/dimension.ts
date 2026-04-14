/**
 * Types for the 5 Demand Signaling Dimensions + Scaling Opportunity center.
 */

export interface Dimension {
  id: string
  name: string
  step: number
  description: string
  question: string
  inputDomains: string[]
  outputs: string[]
}

export type DimensionId =
  | 'geography-priority'
  | 'demand-signals'
  | 'innovation-supply'
  | 'demand-gaps'
  | 'investment-feasibility'

export interface DimensionScore {
  dimensionId: DimensionId
  entityId: string
  score: number
  confidence: number
  components: Record<string, number>
}

export interface ScalingOpportunity {
  id: string
  title: string
  description: string
  country: string
  region: string
  sector: string
  innovationId: string
  compositeScore: number
  dimensionScores: DimensionScore[]
  feasibility: 'high' | 'medium' | 'low'
  priority: 'critical' | 'high' | 'medium' | 'low'
  estimatedImpact: string
  requiredInvestment: string
  createdAt: string
  updatedAt: string
}
