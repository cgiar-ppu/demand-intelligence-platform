/**
 * GloMIP Real Data Module
 *
 * Processes real data extracted from CGIAR Global Market Intelligence Platform
 * (https://glomip.cgiar.org) on 2026-04-14.
 *
 * Exports helper functions for filtering, summarising, and accessing
 * 667 market segments and 433 target product profiles.
 */

import rawSegments from './glomip_market_segments.json'
import rawTPPs from './glomip_target_product_profiles.json'

// ── Types ──

export interface MarketSegment {
  id: number
  ms_id: number
  MSID: string
  crop: string
  crop_group: string
  germplasm: string
  organisation: string
  short_name: string
  long_name: string
  description: string | null
  subregion: string
  countries: string // e.g. "Nigeria(475597); Ghana(400883)"
  total_target_area: string
  material_type: string
  consumer_product_types: string
  agroecological_zone: string
  production_system: string
  maturity: string
  colors: string
  time_horizon: string
  status: string
  is_tpp: string // "Yes" or "-"
  is_pipeline: string
  shareable_link: string
}

export interface TPP {
  tpp_id: number
  CropName: string
  GermplasmType: string
  TPPID: string
  TPPShortName: string
  TPPInternalName: string
  Organisation: string
  TPPLead: string
  Status: string
  Scope: string
  BreedingEffort: string
  Tier: string
  BPShortName: string
  BPLongName: string
  BreedingTeam: string
  TeamLead: string
  MSShortName: string
  TPPDescription: string
  Cost: string
  TPPDateCreated: string
  TPPDateLastEdited: string
}

export interface CountrySegment {
  crop: string
  germplasm: string
  consumerProduct: string
  productionEnvironment: string
  productionSystem: string
  areaHarvested: number
  hasTPP: boolean
  materialType: string
  msid: string
  shortName: string
}

export interface CropSummary {
  crop: string
  segmentCount: number
  totalHectares: number
  tppCount: number
  productionEnvironments: number
  germplasmTypes: number
}

// ── Data ──

const segments = rawSegments as MarketSegment[]
const tpps = rawTPPs as TPP[]

// ── Utility ──

/**
 * Parse "Nigeria(475597); Ghana(400883)" to extract hectares for a given country.
 */
function parseCountryHectares(countriesStr: string, countryName: string): number {
  if (!countriesStr) return 0
  const regex = new RegExp(countryName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\((\\d+)\\)')
  const m = countriesStr.match(regex)
  return m ? parseInt(m[1], 10) : 0
}

/**
 * Check if a country name appears in the countries field.
 */
function countryInSegment(countriesStr: string, countryName: string): boolean {
  if (!countriesStr) return false
  return countriesStr.includes(countryName + '(')
}

// ── Summary Statistics ──

export const TOTAL_SEGMENTS = segments.length
export const TOTAL_TPPS = tpps.length
export const TOTAL_CROPS = new Set(segments.map((s) => s.crop)).size
export const TOTAL_COUNTRIES = 123
export const TOTAL_HECTARES = 484_438_385
export const DATA_DATE = '2026-04-14'

export const ALL_CROPS = Array.from(new Set(segments.map((s) => s.crop))).sort()

// ── Filter by Country ──

export function getSegmentsForCountry(country: string): CountrySegment[] {
  return segments
    .filter((s) => countryInSegment(s.countries, country))
    .map((s) => ({
      crop: s.crop,
      germplasm: s.germplasm,
      consumerProduct: s.consumer_product_types,
      productionEnvironment: s.agroecological_zone,
      productionSystem: s.production_system,
      areaHarvested: parseCountryHectares(s.countries, country),
      hasTPP: s.is_tpp === 'Yes',
      materialType: s.material_type,
      msid: s.MSID,
      shortName: s.short_name,
    }))
    .sort((a, b) => b.areaHarvested - a.areaHarvested)
}

// ── TPPs linked to country segments ──

export function getTPPsForCountry(country: string): TPP[] {
  const countryShortNames = new Set(
    segments
      .filter((s) => countryInSegment(s.countries, country))
      .map((s) => s.short_name)
  )
  return tpps.filter((t) => countryShortNames.has(t.MSShortName))
}

/**
 * Get TPP counts per crop for a country, grouped by breeding effort.
 */
export function getTPPCropBreakdown(country: string): Array<{
  crop: string
  full: number
  earlyLate: number
  lateTesting: number
  other: number
  total: number
}> {
  const countryTPPs = getTPPsForCountry(country)
  const map = new Map<string, { full: number; earlyLate: number; lateTesting: number; other: number }>()

  countryTPPs.forEach((t) => {
    const crop = t.CropName
    if (!map.has(crop)) map.set(crop, { full: 0, earlyLate: 0, lateTesting: 0, other: 0 })
    const entry = map.get(crop)!
    const effort = t.BreedingEffort
    if (effort.includes('Full')) entry.full++
    else if (effort.includes('Early and Late')) entry.earlyLate++
    else if (effort.includes('Late Testing')) entry.lateTesting++
    else entry.other++
  })

  return Array.from(map.entries())
    .map(([crop, counts]) => ({
      crop,
      ...counts,
      total: counts.full + counts.earlyLate + counts.lateTesting + counts.other,
    }))
    .sort((a, b) => b.total - a.total)
}

// ── Crop-level summaries per country ──

export function getCropSummariesForCountry(country: string): CropSummary[] {
  const countrySegs = segments.filter((s) => countryInSegment(s.countries, country))
  const countryShortNames = new Set(countrySegs.map((s) => s.short_name))
  const countryTPPs = tpps.filter((t) => countryShortNames.has(t.MSShortName))

  const cropMap = new Map<string, {
    segmentCount: number
    totalHectares: number
    tppCount: number
    prodEnvs: Set<string>
    germTypes: Set<string>
  }>()

  countrySegs.forEach((s) => {
    const crop = s.crop
    if (!cropMap.has(crop)) {
      cropMap.set(crop, {
        segmentCount: 0,
        totalHectares: 0,
        tppCount: 0,
        prodEnvs: new Set(),
        germTypes: new Set(),
      })
    }
    const entry = cropMap.get(crop)!
    entry.segmentCount++
    entry.totalHectares += parseCountryHectares(s.countries, country)
    if (s.agroecological_zone && s.agroecological_zone !== 'NA') {
      s.agroecological_zone.split('; ').forEach((e) => entry.prodEnvs.add(e))
    }
    if (s.germplasm && s.germplasm !== 'No Germplasm Type') {
      entry.germTypes.add(s.germplasm)
    }
  })

  // Count TPPs per crop
  countryTPPs.forEach((t) => {
    const crop = t.CropName
    if (cropMap.has(crop)) {
      cropMap.get(crop)!.tppCount++
    }
  })

  return Array.from(cropMap.entries())
    .map(([crop, data]) => ({
      crop,
      segmentCount: data.segmentCount,
      totalHectares: data.totalHectares,
      tppCount: data.tppCount,
      productionEnvironments: data.prodEnvs.size,
      germplasmTypes: Math.max(data.germTypes.size, 1),
    }))
    .sort((a, b) => b.totalHectares - a.totalHectares)
}

// ── Area harvested per crop per country (for chart) ──

export function getCropHectaresByCountry(countries: string[]): Array<{
  country: string
  color: string
  crops: Array<{ crop: string; hectares: number }>
}> {
  const colorMap: Record<string, string> = {
    Nigeria: '#00695C',
    Bangladesh: '#1565C0',
    Kenya: '#F9A825',
  }

  return countries.map((country) => {
    const countrySegs = segments.filter((s) => countryInSegment(s.countries, country))
    const cropTotals = new Map<string, number>()

    countrySegs.forEach((s) => {
      const ha = parseCountryHectares(s.countries, country)
      cropTotals.set(s.crop, (cropTotals.get(s.crop) ?? 0) + ha)
    })

    const crops = Array.from(cropTotals.entries())
      .map(([crop, hectares]) => ({ crop, hectares }))
      .sort((a, b) => b.hectares - a.hectares)

    return {
      country,
      color: colorMap[country] ?? '#999',
      crops,
    }
  })
}

// ── Country segment counts (for quick lookup) ──

export const COUNTRY_SEGMENT_COUNTS: Record<string, number> = {
  Nigeria: 81,
  Bangladesh: 30,
  Kenya: 65,
}

export const COUNTRY_HECTARES: Record<string, number> = {
  Nigeria: 47_293_608,
  Bangladesh: 9_407_420,
  Kenya: 4_825_897,
}
