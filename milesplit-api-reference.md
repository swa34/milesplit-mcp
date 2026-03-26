# MileSplit API v1 Reference

Base URL: `https://www.milesplit.com/api/v1`

## API Conventions

- Follows **HAL (Hypertext Application Language)** conventions
- Every response includes `_meta`, `_links`, and either `_embedded` or `data`
- `_links` provides discoverability — follow `self`, `up`, `list`, and named links to navigate resources
- `_embedded` contains related/nested resource objects (e.g., parent athlete on stats/performances endpoints)
- Standard REST verbs; all discovered endpoints use `GET`
- Responses include cache metadata (`fresh`, `ttl`) and HTTP `status_code` in `_meta`
- No authentication required for any tested public endpoint
- All IDs are returned as strings (e.g., `"id": "52189"`)

### Pagination

- **`limit`** — controls number of results returned. Works on `/meets`, `/teams/list`, `/videos`, `/venues`. Default is ~100.
- **`offset`** — skip N results. Works on `/meets`. Does NOT work on `/athletes` search.
- **`page`** — does NOT work (tested on `/meets`, returns same results as page=1).
- No `next`/`prev` links are returned in `_links`.
- `/athletes?q=` always returns up to ~100 results regardless of `limit` or `offset` params.

---

## Endpoints

### Athletes

#### `GET /athletes?q={name}`

Search for athletes by name. Returns a list of matching athlete records.

**Query parameters:**

| Param | Type | Description | Effective? |
|---|---|---|---|
| `q` | string | **Required.** Name search keyword | Yes — matches against firstName |
| `gender` | string | Filter by gender (`M`/`F`) | Accepted but does NOT filter results |
| `state` | string | Filter by state abbreviation | Accepted but does NOT filter results |
| `gradYear` | int | Filter by graduation year | Accepted but does NOT filter results |
| `limit` | int | Max results to return | Accepted but does NOT limit (always ~100) |
| `offset` | int | Skip N results | Accepted but does NOT offset |

> **Note:** Only the `q` parameter actually filters results. Other params are accepted in the URL but the response is not filtered by them server-side. Always returns up to ~100 results.

**Response fields per athlete (search):**

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique athlete identifier |
| `firstName` | string | First name |
| `lastName` | string | Last name |
| `gender` | string | `"M"` or `"F"` |
| `gradYear` | string | Graduation year (`"0"` if unknown) |
| `city` | string | City |
| `state` | string | State abbreviation |
| `country` | string | Country code (e.g., `"USA"`, `"CAN"`) |
| `teamId` | string/null | Associated team ID |

**Navigation links:**

| Link | Target |
|---|---|
| `self` | Current search URL |
| `athlete` | `/athletes/{id}` (template) |
| `team` | `/teams/{teamId}` (template) |
| `search` | `/athletes?q={keyword}` (template) |

---

#### `GET /athletes/{id}`

Returns a single athlete profile with full details.

**Response fields:**

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique athlete identifier |
| `siteSubdomain` | string | State subdomain (e.g., `"nj"`, `"tx"`) |
| `firstName` | string | First name |
| `lastName` | string | Last name |
| `slug` | string | URL-friendly name (e.g., `"sydney-mclaughlin-levrone"`) |
| `gender` | string | `"M"` or `"F"` |
| `schoolId` | string | Associated high school team ID |
| `gradYear` | string | Graduation year (`"0"` if unknown) |
| `collegeYear` | string | College year (empty string if N/A) |
| `collegeId` | string | Associated college ID (`"0"` if none) |
| `nickname` | string | Nickname (empty string if none) |
| `birthDate` | string | Birth date (`"0000-00-00"` if unknown) |
| `birthYear` | string | Birth year (`"0"` if unknown) |
| `note` | string | Notes (empty string if none) |
| `honors` | string | Formatted achievements text (empty string if none) |
| `specialty` | string | Athletic specialty (empty string if none) |
| `city` | string | City |
| `state` | string | State abbreviation |
| `country` | string | Country code |
| `isProfilePhoto` | string | `"0"` or `"1"` |
| `hide` | string | `"0"` or `"1"` |
| `usatf` | string | USATF ID (empty if none) |
| `tfrrsId` | string | TFRRS ID (empty if none) |
| `lastTouch` | string | Unix timestamp of last update |
| `teamId` | string | Associated team ID |
| `profilePhotoUrl` | string | Profile photo URL (empty if none) |

**Embedded resources:** `_embedded.team` — `{ id, name }` (name may be null)

**Navigation links:**

| Link | Target |
|---|---|
| `self` | `/athletes/{id}` |
| `stats` | `/athletes/{id}/stats` |
| `bests` | `/athletes/{id}/performances?view=bests` |
| `progression` | `/athletes/{id}/progression` |
| `team` | `/teams/{teamId}` |

---

#### `GET /athletes/{id}/stats`

Returns all performance records for the athlete, sorted by event. Contains full athlete in `_embedded`.

**Embedded resources:** `_embedded.athlete` — full athlete profile object (same fields as `GET /athletes/{id}`)

**Response `data` array — Performance Record:**

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique performance record ID |
| `meetId` | string | Meet ID where this performance occurred |
| `units` | string | Raw numeric value (milliseconds for time events, unknown unit for field) |
| `meetName` | string | Meet name |
| `eventCode` | string | Event code (e.g., `"100m"`, `"800m"`, `"D"` for discus, `"S"` for shot put) |
| `round` | string | Round: `"f"` (final), `"p"` (prelim) |
| `season` | string | `"indoor"` or `"outdoor"` (lowercase) |
| `mark` | string | Formatted result (e.g., `"11.07"`, `"1:57.90"`, `"38-3.00"`) |

**Navigation links:** `self`, `up` (back to athlete profile)

---

#### `GET /athletes/{id}/performances?view=bests`

Returns personal best performances for the athlete. Same embedded athlete and performance record schema as `/stats`.

**Query parameters:**

| Param | Description |
|---|---|
| `view` | `bests` — returns personal best performances |

**Response `data` array — Performance Record (abbreviated):**

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique performance record ID |
| `teamId` | string | Team ID at time of performance |
| `gender` | string | Gender |
| `state` | string | State |
| `note` | string/null | Performance note |
| `teamName` | string | Team name at time of performance |

> **Note:** The `performances?view=bests` response has fewer fields per record than `/stats` — it omits `meetId`, `units`, `meetName`, `eventCode`, `round`, `season`, `mark`. Use `/stats` for full performance details.

**Navigation links:** `self`, `up` (back to athlete profile)

---

#### `GET /athletes/{id}/progression`

Returns performance progression over time. Same schema as `/stats` — returns `_embedded.athlete` and `data` array of performance records with `id`, `meetId`, `units`, `meetName`, `eventCode`, `round`, `season`, `mark`.

**Navigation links:** `self`, `up` (back to athlete profile)

---

### Teams

#### `GET /teams/{id}`

Returns a single team profile.

**Response fields:**

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique team identifier |
| `name` | string | Team name |
| `abbreviation` | string | Team abbreviation (e.g., `"SCCL"`) |
| `city` | string | City |
| `state` | string | State abbreviation |
| `country` | string | Country code |
| `county` | string | County name |
| `type` | string | Team type: `"H"` (high school), `"M"` (middle school), `"Y"` (youth), `"E"` (elementary) |
| `primaryColor` | string | Hex color (e.g., `"#1118ee"`) |
| `secondaryColor` | string | Hex color |
| `homepage` | string | Team website URL |
| `phone` | string | Contact phone |
| `address` | string | Street address |
| `zip` | string | ZIP code |
| `genre` | string | Genre code (`"0"`) |
| `gender` | string | Gender restriction (empty for co-ed) |
| `profilePhotoUrl` | string | Team logo URL |

**Embedded resources:** `_embedded.filters` — empty array

**Navigation links:** `self`, `list` → `/teams/list`

---

#### `GET /teams/list`

Browse/list teams. Supports filtering by state.

**Query parameters:**

| Param | Type | Description | Effective? |
|---|---|---|---|
| `state` | string | Filter by state abbreviation | Yes |
| `limit` | int | Max results to return | Yes |

**Response:** Array of full team objects (same fields as `GET /teams/{id}`).

**Navigation links:** `self`, `team` → `/teams/{teamId}` (template)

---

#### `GET /teams?q={name}`

Team search endpoint. Exists but returns **unreliable data** — team names and fields are often empty in search results. Use `/teams/list` with `state` filter instead.

---

#### `GET /teams/{id}/athletes`

Returns the **team profile** (same as `/teams/{id}`), NOT a list of athletes. This is an alias, not a roster endpoint.

---

#### `GET /teams/{id}/results`

Returns the **team profile** (same as `/teams/{id}`), NOT result data. This is an alias, not a results endpoint.

---

### Meets

#### `GET /meets`

Returns a paginated list of track and field meets.

**Query parameters:**

| Param | Type | Description | Effective? |
|---|---|---|---|
| `limit` | int | Max results per page | Yes |
| `offset` | int | Skip N results | Yes |
| `state` | string | Filter by venue state | Yes |
| `season` | string | Filter by season (`"Indoor"`, `"Outdoor"`) | Yes |
| `seasonYear` | int | Filter by competition year | Yes |
| `q` | string | Search by name | No — does not filter |
| `page` | int | Page number | No — does not paginate |

**Response fields per meet:**

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique meet identifier |
| `name` | string | Meet name (may include status like "CANCELED") |
| `dateStart` | string | Start date (YYYY-MM-DD) |
| `dateEnd` | string | End date (YYYY-MM-DD) |
| `season` | string | `"Indoor"` or `"Outdoor"` |
| `seasonYear` | string | Competition year |
| `venueCity` | string | Venue city |
| `venueState` | string | Venue state |
| `venueCountry` | string | Venue country |
| `registrationActive` | string/null | `"1"` if registration open, null if not |

**Navigation links:** `self`, `meet` → `/meets/{meetId}` (template)

---

#### `GET /meets/{meetId}`

Returns details for a single meet. Same fields as the list response.

---

#### `GET /meets/{meetId}/results`

Returns the **meet object** (same as `/meets/{meetId}`), NOT actual result data. This endpoint exists but acts as an alias for the meet profile.

---

#### `GET /meets/{meetId}/entries`

**Requires authentication.** Returns HTTP `401 Unauthorized` for unauthenticated requests.

---

### Rankings

#### `GET /rankings`

Top-level rankings endpoint. Returns `data: null` with all tested parameter combinations.

**Tested parameters that did NOT produce data:** `event`, `eventCode`, `gender`, `season`, `seasonYear`, `state`, `limit`.

**Navigation links:** `self`, `subjective` → `/rankings/subjective`

> **Note:** This endpoint may require authentication, specific undiscovered parameter names, or may be deprecated. All tested combinations returned `data: null`.

---

#### `GET /rankings/subjective`

Returns subjective/editorial rankings. Returns `data: []` (empty array) — may be seasonally populated.

---

### Events

#### `GET /events`

Returns the complete list of event types (396 events observed). No pagination needed — returns all events in a single response.

**Response fields per event:**

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique event identifier |
| `code` | string | Event code (e.g., `"100m"`, `"800m"`, `"SP"`, `"HJ"`, `"4x100m"`) |
| `name` | string | Full event name (e.g., `"100 Meter Dash"`, `"Shot Put"`) — may be empty for some entries |
| `shortName` | string | Abbreviated name (e.g., `"100m"`, `"SP"`, `"HJ"`) |

**Event categories include:**
- **Sprints:** 40y through 600m
- **Middle/Long Distance:** 800m, 1500m, Mile, 3000m, 3200m, 5000m, 10000m, etc.
- **Hurdles:** 50mH through 400mH, various heights
- **Relays:** 4x100m, 4x200m, 4x400m, 4x800m, shuttle hurdle relays, DMR, SMR
- **Field Events:** Shot Put, Discus, Javelin, High Jump, Long Jump, Triple Jump, Pole Vault
- **Multi-Events:** Pentathlon, Heptathlon, Decathlon
- **Cross Country:** Various distances
- **Walks:** Race walk events
- **Special:** Obstacle course, tickets, participant entries

**Navigation links:** `self`

---

### Results

#### `GET /results`

Top-level results endpoint. Returns `data: null` with all tested parameter combinations.

**Tested parameters that did NOT produce data:** `meetId`, `limit`.

**Navigation links:** `self`, `rankings` → `/rankings`, `athletes` → `/athletes`

> **Note:** Individual results are accessible through `/athletes/{id}/stats` and `/athletes/{id}/progression`. There is no working endpoint to fetch all results for a meet.

---

### Videos

#### `GET /videos`

Returns a list of video content.

**Query parameters:**

| Param | Type | Description | Effective? |
|---|---|---|---|
| `limit` | int | Max results to return | Accepted in URL (effectiveness not confirmed) |

**Response fields per video:**

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique video identifier |
| `title` | string | Video title |
| `summary` | string | Description (may contain HTML) |
| `genre` | string | Video genre (e.g., `"interview"`, `"race"`) |
| `season` | string | Season (e.g., `"Indoor"`, `"cc"`, `"outdoor"`) — inconsistent casing |
| `seasonYear` | string | Year |
| `meetName` | string/null | Associated meet name |

**Navigation links:** `self`

---

#### `GET /videos/{id}`

Returns a single video. Same fields as the list response.

---

### Venues

#### `GET /venues`

Returns a list of venues/locations.

**Query parameters:**

| Param | Type | Description | Effective? |
|---|---|---|---|
| `q` | string | Search venues by keyword | Yes |
| `limit` | int | Max results to return | Accepted in URL |

**Response fields per venue:**

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique venue identifier |
| `name` | string | Venue name (may be empty) |
| `city` | string | City |
| `state` | string | State abbreviation |
| `country` | string | Country code |

**Navigation links:** `self`, `search` → `/venues?q={keyword}` (template), `venue` → `/venues/{venueId}` (template)

---

#### `GET /venues/{id}`

Returns a single venue.

**Navigation links:** `self`, `venue` → `/venues/list`

---

## Non-Functional Endpoints

These endpoints were probed and found to return no usable data:

| Endpoint | HTTP Status | Notes |
|---|---|---|
| `GET /results` | 200 | `data: null` — no working params found |
| `GET /news` | 200 | `data: null` |
| `GET /seasons` | 200 | `data: null` |
| `GET /conferences` | 200 | `data: null` |
| `GET /divisions` | 200 | `data: null` |
| `GET /photos` | 400 | Bad request |
| `GET /articles` | 404 | Not found |
| `GET /states` | 406 | Not acceptable |
| `GET /meets/{id}/entries` | 401 | Requires authentication |
| `GET /meets/{id}/results` | 200 | Returns meet profile, not results |
| `GET /teams/{id}/athletes` | 200 | Returns team profile, not roster |
| `GET /teams/{id}/results` | 200 | Returns team profile, not results |
| `GET /athletes/{id}/results` | 200 | Returns athlete profile, not results |

---

## Usage Notes

1. **No authentication required** for all working endpoints (public data).
2. **Meet entries require auth** — `/meets/{id}/entries` returns 401.
3. **Discovering more endpoints:** Follow `_links` in any response to find related resources.
4. **Pagination:** Use `limit` + `offset` on `/meets`. Athlete search does not paginate. `/teams/list` supports `limit`.
5. **Nested endpoints are aliases:** `/meets/{id}/results`, `/teams/{id}/athletes`, `/teams/{id}/results`, and `/athletes/{id}/results` all return the parent resource, not child data.
6. **Performance data lives on athlete endpoints:** Use `/athletes/{id}/stats` for full performance records or `/athletes/{id}/progression` for the same data.
7. **Rate limiting:** Unknown. No rate limit headers observed, but treat the API respectfully.
8. **String types:** All IDs and numeric-looking fields are returned as strings, not integers.
9. **Date of discovery:** 2026-03-26. Endpoints and schemas may change over time.
