# NUMM Prototype — Seed Data

Mock material master data for 4 simulated CPSEs, built so an AI matching engine
has real duplicates, near-duplicates, and a couple of deliberate "trap" cases
to detect.

## Files

| File | Description |
|---|---|
| `ONGC_material_master.csv` | 23 rows — Oil & Gas sector material master |
| `NTPC_material_master.csv` | 23 rows — Power sector material master |
| `SAIL_material_master.csv` | 23 rows — Steel sector material master |
| `CIL_material_master.csv`  | 23 rows — Mining sector material master |
| `ground_truth_mapping.csv` | The answer key — which rows across CPSEs are actually the same item |

Each material file has columns: `material_code, description, specification, uom, category, plant`

## What's inside

**18 canonical items** appear across all 4 CPSEs, each described in that
CPSE's own "house style" so the raw text never matches exactly:

- **ONGC** — heavily abbreviated, ALL CAPS (`HEX HD BOLT M12X50 SS304`)
- **NTPC** — natural/semi-formal casing (`Hex Head Bolt M12x50 SS304`)
- **SAIL** — fully spelled out (`Hex Head Bolt M12 x 50 Stainless Steel Grade 304`)
- **CIL** — abbreviated with `*` as a dimension separator (`BOLT HEX M12*50 SS304`)

Units of measurement are also varied per CPSE for the same underlying unit
(e.g. "Nos" appears as `NOS` / `EA` / `PCS` / `Each`), and material codes
follow each CPSE's own numbering scheme — this is exactly the inconsistency
the platform is meant to resolve.

**2 "trap" cases** (Gate Valve 6" Cast Steel, and Seamless Steel Pipe 150mm NB)
look like an obvious textual match but have a genuinely different pressure
rating / schedule in SAIL and CIL. Use these to demonstrate the
attribute-guardrail logic — the AI should flag these as **"Near-duplicate —
review required"**, not silently auto-merge them, even though their
description similarity score will be very high.

**~20 unique, sector-specific items** per CPSE (5 each) that have no
equivalent anywhere else (e.g. ONGC's wireline tools, SAIL's blast furnace
tuyere, CIL's methane detector) — these should correctly come back as
**"No match found"**, so your demo also shows the AI *not* over-matching.

## How to use this in the prototype

1. Load all 4 CSVs into your ingestion layer at startup (this is your seed data).
2. Run the matching engine — you should recover close to the 18 clusters in
   `ground_truth_mapping.csv`.
3. Use `ground_truth_mapping.csv` yourself (not shown to the judge) to sanity-check
   your matching engine is finding the right clusters before demo day.
4. For the two trap cases, make sure your demo explicitly shows the reviewer
   UI catching the spec mismatch — this is a great "aha" moment to narrate
   live during judging ("see, it doesn't just blindly trust the text match").

## Suggested demo narrative order

1. Show the dashboard empty/loading → data ingests → numbers populate (18 CPSEs... wait, 4 CPSEs, 92 total rows).
2. Open the Matching Workbench, sort by confidence — show a few clean high-confidence merges getting approved quickly.
3. Scroll to one of the 2 trap cases — show the attribute mismatch highlighted in red, and reject/flag it live.
4. Open the Unified Repository — show a CNMC entry with all 4 CPSE codes nested under it.
5. Open the Dashboard again — numbers have moved, savings estimate updates.
