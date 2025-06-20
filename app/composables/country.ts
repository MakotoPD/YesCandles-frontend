// Since the site is only in Polish language with PLN currency, we hardcode the Polish country data
export const useCountry = () => {
  // Create a static Polish country object
  const polishCountry: BaseRegionCountryWithRegionId = {
    id: 'pl_01',
    iso_2: 'PL',
    iso_3: 'POL',
    name: 'Poland',
    display_name: 'Polska',
    region_id: process.env.MEDUSA_REGION, // This should match the region ID used in data.ts
    numeric_code: '616',
  }
  
  // Use a ref with the Polish country data already set
  const country = useState<BaseRegionCountryWithRegionId>('country', () => polishCountry)

  // No need for setCountry since we only use Polish
  const setCountry = () => {}

  return {
    countryCode: computed(() => 'PL'),
    country: readonly(country),
    setCountry: setCountry,
  }
}

// Since the site is only in Polish language with PLN currency, we return only Polish country data
export const useCountries = () => {
  // Create a static Polish country object (same as in useCountry)
  const polishCountry: BaseRegionCountryWithRegionId = {
    id: 'pl_01',
    iso_2: 'PL',
    iso_3: 'POL',
    name: 'Poland',
    display_name: 'Polska',
    region_id: 'reg_01',
    numeric_code: '616',
  }
  
  // Return a ref with only the Polish country
  const countries = ref<BaseRegionCountryWithRegionId[]>([polishCountry])
  
  return countries
}
