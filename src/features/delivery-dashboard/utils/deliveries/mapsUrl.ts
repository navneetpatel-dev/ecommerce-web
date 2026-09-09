export function googleMapsSearchUrl(addressText: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressText)}`;
}
