export const Timeouts = {
  // Quick DOM checks — element should already be present.
  ELEMENT: 5_000,

  // Standard interactive wait — network round-trip or animation settle.
  NETWORK: 10_000,

  // Full page load or heavy API response.
  PAGE_LOAD: 30_000,

  //Poppulo API Call time out
  API_TIME_OUT: 30_000,

  //
} as const;
