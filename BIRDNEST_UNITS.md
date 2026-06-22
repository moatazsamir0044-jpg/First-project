# BirdNest Units — Import Status & Backfill Checklist

**Imported:** 2026-06-22 from the official BirdNest unit sheet (19 units).
**Where:** `lib/mock-data.ts` → `mockListings` (the site renders from this today).

## What is REAL (from the sheet)
Per unit: type (Apartment), **view**, **size (m²)**, **bedrooms**, **bed config**
(king/single), **bathrooms (WCs)**, **furnish category**, and **unit code**
(stored in `unitCode`, `view`, `sizeSqm`, `furnishCategory`, `bedConfigKing`,
`bedConfigSingle`, `sourceUrl`). Titles and descriptions are generated from
these real specs.

## What is a PLACEHOLDER (needs real data)
These could not be pulled because this environment's network policy blocks
`birdnestlife.com` and Google Drive (egress allowlist). They need backfilling:

| Field | Current placeholder | Real source |
|---|---|---|
| `pricePerNight` | 1BR 1800 / 2BR 2800 / 3BR 4200 EGP | birdnestlife.com unit page |
| `cleaningFee` / `utilitiesEst` | flat by bedrooms / 150 | unit page |
| `location` / `area` / `city` | "BirdNest Verified Home", "Egypt" | unit page (compound/city) |
| `images` | Unsplash stock by view | unit photo drive / unit page |
| `rating` / `reviewCount` | 0 / 0 (shows "New") | real reviews if any |
| `latitude` / `longitude` | null | map pin |

## How to finish the import (2 options)
1. **Unblock hosts** (recommended): add `birdnestlife.com`, `drive.google.com`,
   `docs.google.com` to the environment's network egress allowlist, then I scrape
   each `sourceUrl` for price/location/amenities/photos automatically.
2. **Upload manually**: drop the photos here (named by unit code) + paste/upload
   price + location per unit.

## The 19 units
| Unit | View | Size m² | BR | Beds (K/S) | Baths | Furnish | Source |
|---|---|---|---|---|---|---|---|
| 5594 | No view | 90 | 1 | 1/0 | 1 | High Quality | /unit/5594 |
| 5291 | Pool view | 80 | 1 | 1/0 | 1 | Standard | /unit/5291 |
| 5735 | Sea | 150 | 2 | 1/2 | 2 | BirdNest Furnish | /unit/5735 |
| 5287 | Canal view | 165 | 3 | 1/4 | 2 | Standard | /unit/5287 |
| 5340 | City | 120 | 2 | 1/2 | 2 | Standard | /unit/5340 |
| 5744 | Canal view | 218 | 3 | 2/2 | 3 | High Quality | /unit/5744 |
| 5296 | Sea view | 124 | 2 | 1/2 | 2 | Standard | /unit/5296 |
| 5589 | Pool | 120 | 2 | 0/4 | 2 | High Quality | /unit/5589 |
| 5295 | No view | ? | 1 | 1/0 | 1 | Standard | /unit/5295 |
| 5673 | No view | 100 | 1 | 1/0 | 1 | Standard | /unit/5673 |
| 5289 | City | 145 | 2 | 1/2 | 2 | Standard | /unit/5289 |
| 5671 | Golf | 140 | 2 | 2/2 | 2 | Standard | /unit/5671 |
| 5595 | Canal view | 102 | 1 | 1/0 | 1 | High Quality | /unit/5595 |
| 5620 | Pool view | 150 | 3+nanny | 1/4 | 2 | High Quality | /unit/5620 |
| 5609 | Garden | 145 | 2 | 1/2 | 2 | Standard | /unit/5609 |
| 5663 | Pool | ? | 2 | ?/? | ? | High Quality | (no link in sheet) |
| 5578 | Canal view | 78 | 1 | 0/2 | 1 | Standard | /unit/5578 |
| 5586 | Pool | 106 | 1 | 0/2 | 2 | Standard | /unit/5586 |
| 5714 | Sea | 200 | 2 | 1/2 | 2 | (blank) | /unit/5714 |

### Cells that were blank/ambiguous in the sheet (verify these)
- **5295**: size blank (left empty).
- **5663**: size, bed config, and WCs blank; **no Unit Link** in the sheet —
  bathrooms defaulted to 2, guests to 4. Needs confirmation.
- **5578**: WCs blank — defaulted to 1.
- **5714**: furnish category blank.
- **5620**: rooms listed as "3+nanny" — modelled as 3 bedrooms + nanny room
  (noted in the description).
