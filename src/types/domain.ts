/**
 * Types for the 7 Data Signal Domains.
 */

export interface DomainElement {
  id: string
  name: string
  description: string
  indicators: string[]
}

export interface Domain {
  id: string
  name: string
  slug: string
  description: string
  guidingQuestion: string
  elements: DomainElement[]
  analyticalContributions: string[]
}

export type DomainSlug =
  | 'scaling-context'
  | 'sector'
  | 'stakeholders'
  | 'enabling-environment'
  | 'resource-investment'
  | 'market-intelligence'
  | 'innovation-portfolio'

export interface DomainDataPoint {
  domainId: string
  elementId: string
  indicatorId: string
  value: number | string
  source: string
  year: number
  country?: string
  region?: string
}

export interface DomainSummary {
  domain: Domain
  completeness: number
  lastUpdated: string
  dataPointCount: number
}
