// Mock priority subscriptions for demo purposes
// In production this would come from the database

export interface PrioritySubscription {
  memberId: string;
  countries: string[];
  classifications: string[];
  expiresAt: string;
}

export const MOCK_PRIORITY_SUBSCRIPTIONS: PrioritySubscription[] = [
  {
    memberId: 'm1',
    countries: ['Peru', 'Vietnam', 'Cambodia'],
    classifications: ['community', 'sustainable', 'eco'],
    expiresAt: '2027-01-01',
  },
  {
    memberId: 'm3',
    countries: ['Spain', 'Italy', 'Japan'],
    classifications: ['gastronomy', 'cultural'],
    expiresAt: '2027-01-01',
  },
];

export function isTripPriority(
  tripMemberId: string,
  tripCountries: string[],
  tripClassifications: string[],
  filterCountry?: string,
  filterClassification?: string
): boolean {
  const now = new Date().toISOString();

  return MOCK_PRIORITY_SUBSCRIPTIONS.some((sub) => {
    if (sub.memberId !== tripMemberId) return false;
    if (sub.expiresAt < now) return false;

    const countryMatch =
      !filterCountry ||
      filterCountry === 'all' ||
      sub.countries.includes(filterCountry);

    const classMatch =
      !filterClassification ||
      filterClassification === 'all' ||
      sub.classifications.includes(filterClassification);

    // Must match at least one of the subscription's targeted criteria
    const tripMatchesSubCountry = tripCountries.some((c) =>
      sub.countries.includes(c)
    );
    const tripMatchesSubClass = tripClassifications.some((c) =>
      sub.classifications.includes(c)
    );

    return (
      (tripMatchesSubCountry || tripMatchesSubClass) &&
      (countryMatch || classMatch)
    );
  });
}
