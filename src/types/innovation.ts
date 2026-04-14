/**
 * Types for innovation portfolio data.
 */

export type MaturityLevel =
  | 'concept'
  | 'proof-of-concept'
  | 'pilot'
  | 'scaling'
  | 'mature'

export type InnovationType =
  | 'technology'
  | 'practice'
  | 'policy'
  | 'service'
  | 'platform'

export interface Innovation {
  id: string
  name: string
  description: string
  type: InnovationType
  maturity: MaturityLevel
  sectors: string[]
  countries: string[]
  regions: string[]
  center: string
  scalingReadiness: number
  evidenceStrength: number
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface InnovationMatch {
  innovationId: string
  demandSignalId: string
  matchScore: number
  matchType: 'direct' | 'partial' | 'potential'
  matchedAttributes: string[]
}

export interface InnovationGap {
  demandTheme: string
  gapSeverity: 'critical' | 'significant' | 'moderate' | 'minor'
  affectedCountries: string[]
  affectedSectors: string[]
  description: string
  recommendedActions: string[]
}
