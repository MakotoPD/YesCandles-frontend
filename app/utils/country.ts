import type { StoreRegion, StoreRegionCountry } from '@medusajs/types'

// Fix API type
export interface BaseRegionCountryWithRegionId extends StoreRegionCountry {
  region_id: string
}

// Since we're only using Polish locale, this function always returns the Polish country object
export function getCountryFromCountryCode(countries?: BaseRegionCountryWithRegionId[], countryCode?: string) {
  // Always return the first country (Polish) regardless of input
  // This ensures backward compatibility with existing code
  return countries?.[0]
}

// Since we're only using Polish locale, this function always returns an array with just the Polish country
export function getCountriesFromRegions(regions?: StoreRegion[]) {
  // Create a static Polish country object
  const polishCountry: BaseRegionCountryWithRegionId = {
    id: 'pl_01',
    iso_2: 'PL',
    iso_3: 'POL',
    name: 'Poland',
    display_name: 'Polska',
    region_id: 'reg_01',
    numeric_code: '616',
  }
  
  // Always return an array with just the Polish country
  return [polishCountry]
}
