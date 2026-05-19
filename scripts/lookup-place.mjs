#!/usr/bin/env node

/**
 * One-off lookup: pass a single "name + address" string on the command line.
 *
 *   node scripts/lookup-place.mjs "Eminere Melbourne Level 3/257 Collins St Melbourne VIC 3000"
 *
 * Requires Places API (New) enabled and GOOGLE_MAPS_API_KEY in the environment.
 */

const TEXT_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText";

function placesHeaders(apiKey, fieldMask) {
  return {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey,
    "X-Goog-FieldMask": fieldMask,
  };
}

async function parsePlacesError(response) {
  let message = `HTTP ${response.status}`;
  try {
    const json = await response.json();
    if (json.error?.message) message = json.error.message;
    else if (json.error_message) message = json.error_message;
  } catch {
    // ignore
  }
  return message;
}

async function searchPlace(textQuery, apiKey) {
  const response = await fetch(TEXT_SEARCH_URL, {
    method: "POST",
    headers: placesHeaders(
      apiKey,
      "places.id,places.displayName,places.formattedAddress,places.location",
    ),
    body: JSON.stringify({ textQuery, regionCode: "AU", languageCode: "en" }),
  });
  if (!response.ok) throw new Error(`Text Search: ${await parsePlacesError(response)}`);
  return response.json();
}

async function fetchPlaceDetails(placeId, apiKey) {
  const response = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
    method: "GET",
    headers: placesHeaders(
      apiKey,
      "id,displayName,formattedAddress,location,rating,userRatingCount,websiteUri,nationalPhoneNumber,internationalPhoneNumber,currentOpeningHours",
    ),
  });
  if (!response.ok) throw new Error(`Place Details: ${await parsePlacesError(response)}`);
  return response.json();
}

async function main() {
  const textQuery = process.argv.slice(2).join(" ").trim();
  if (!textQuery) {
    console.error('Usage: node scripts/lookup-place.mjs "Business Name Full Address"');
    process.exit(1);
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error("Set GOOGLE_MAPS_API_KEY or NEXT_PUBLIC_GOOGLE_MAPS_API_KEY");
    process.exit(1);
  }

  const search = await searchPlace(textQuery, apiKey);
  const top = search.places?.[0];
  if (!top?.id) {
    console.error("No matches.");
    process.exit(1);
  }

  console.log("Search match:", JSON.stringify(top, null, 2));
  const details = await fetchPlaceDetails(top.id, apiKey);
  console.log("\nPlace details:", JSON.stringify(details, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
