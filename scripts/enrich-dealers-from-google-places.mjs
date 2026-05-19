#!/usr/bin/env node

/**
 * Enrich dealer rows using Places API (New) — not the legacy Find Place / Details URLs.
 *
 * Enable in Google Cloud Console (same project as your API key):
 *   APIs & Services → Library → "Places API (New)" → Enable
 * Billing must be on. Restrict the key to Places API (New) for scripts.
 *
 * @see https://developers.google.com/maps/documentation/places/web-service/text-search
 * @see https://developers.google.com/maps/documentation/places/web-service/place-details
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const TEXT_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function inferState(address = "") {
  const states = ["NSW", "VIC", "QLD", "WA", "SA", "ACT", "NT", "TAS"];
  const match = states.find((state) => address.includes(` ${state} `) || address.endsWith(` ${state}`));
  return match ?? "";
}

function assertInputDealer(dealer, index) {
  if (!dealer?.name) {
    throw new Error(`Invalid dealer at index ${index}. Each entry needs at least { name }`);
  }
  if (!dealer.city && !dealer.address) {
    throw new Error(`Invalid dealer at index ${index}. Provide { city } and/or { address }`);
  }
}

function buildTextQuery({ name, city, address }) {
  if (address?.trim()) {
    return `${name} ${address}`.trim();
  }
  return `${name} ${city} Australia`.trim();
}

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

/** Text Search (New) — replaces legacy findplacefromtext */
async function searchPlace(textQuery, apiKey) {
  const response = await fetch(TEXT_SEARCH_URL, {
    method: "POST",
    headers: placesHeaders(
      apiKey,
      "places.id,places.name,places.displayName,places.formattedAddress,places.location",
    ),
    body: JSON.stringify({
      textQuery,
      regionCode: "AU",
      languageCode: "en",
    }),
  });

  if (!response.ok) {
    throw new Error(`Text Search failed: ${await parsePlacesError(response)}`);
  }

  const json = await response.json();
  const place = json.places?.[0];
  if (!place?.id) {
    throw new Error(`No place found for query: "${textQuery}"`);
  }
  return place;
}

/** Place Details (New) — replaces legacy place/details/json */
async function fetchPlaceDetails(placeId, apiKey) {
  const response = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
    method: "GET",
    headers: placesHeaders(
      apiKey,
      "id,displayName,formattedAddress,location,rating,userRatingCount,websiteUri,nationalPhoneNumber,internationalPhoneNumber,currentOpeningHours",
    ),
  });

  if (!response.ok) {
    throw new Error(`Place Details failed: ${await parsePlacesError(response)}`);
  }

  const place = await response.json();
  if (place.location?.latitude == null || place.location?.longitude == null) {
    throw new Error(`No coordinates for place id "${placeId}"`);
  }
  return place;
}

function toDealerModel(details, manual = {}) {
  const address = details.formattedAddress ?? manual.address ?? "";
  const state = inferState(address);
  const displayName = details.displayName?.text ?? manual.name ?? "";

  return {
    id: slugify(`${displayName}-${manual.city ?? ""}`),
    name: displayName,
    city: manual.city ?? "",
    state,
    address,
    lat: details.location.latitude,
    lng: details.location.longitude,
    website: details.websiteUri ?? "",
    phone: details.nationalPhoneNumber ?? details.internationalPhoneNumber ?? "",
    googleRating: details.rating ?? null,
    reviewCount: details.userRatingCount ?? null,
    brands: manual.brands ?? [],
    description: manual.description ?? "",
    instagram: manual.instagram ?? "",
    featured: manual.featured ?? false,
    heroImage: manual.heroImage ?? "",
    placeId: details.id ?? manual.placeId ?? "",
    sourceAddress: details.formattedAddress ?? "",
    openingNow: details.currentOpeningHours?.openNow ?? null,
  };
}

async function main() {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GOOGLE_MAPS_API_KEY (or NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) environment variable.");
  }

  const inputPath = process.argv[2] ?? "data/dealers-curated-input.json";
  const outputPath = process.argv[3] ?? "data/dealers-enriched-output.json";
  const pauseMs = Number(process.argv[4] ?? 250);

  const resolvedInput = path.resolve(process.cwd(), inputPath);
  const resolvedOutput = path.resolve(process.cwd(), outputPath);

  const rawInput = await readFile(resolvedInput, "utf-8");
  const curatedDealers = JSON.parse(rawInput);
  if (!Array.isArray(curatedDealers)) {
    throw new Error("Input file must be a JSON array.");
  }

  const enriched = [];

  for (let index = 0; index < curatedDealers.length; index += 1) {
    const manual = curatedDealers[index];
    assertInputDealer(manual, index);

    const textQuery = buildTextQuery(manual);
    console.log(`Processing [${index + 1}/${curatedDealers.length}] ${textQuery}`);

    const candidate = await searchPlace(textQuery, apiKey);
    const details = await fetchPlaceDetails(candidate.id, apiKey);
    enriched.push(toDealerModel(details, { ...manual, placeId: candidate.id }));

    if (pauseMs > 0) {
      await sleep(pauseMs);
    }
  }

  await writeFile(resolvedOutput, `${JSON.stringify(enriched, null, 2)}\n`, "utf-8");
  console.log(`Done. Wrote ${enriched.length} enriched dealers to ${resolvedOutput}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
