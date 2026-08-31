# Assets — Figma export manifest

Every image on the site currently renders a **ratio-accurate placeholder** that
names the Figma node it is waiting for. The site is complete apart from these.

## Why they aren't already here

The Figma asset CDN is blocked by this environment's network policy, so the
real bitmaps could not be downloaded automatically. Everything else — all the
copy, statistics, quotes and structure — came straight out of the Figma file.

## How to swap one in

1. In Figma, select the node listed below.
2. Export as **PNG, 2x**.
3. Save it into `src/assets/<folder>/` under the **exact filename** in the table.
4. Delete the `.svg` placeholder sitting next to it.

Nothing else changes. `src/data/assets.ts` resolves images by name, prefers a
real `.png` over a placeholder automatically, and the "Placeholder" badge on the
frame disappears on its own.

File key: `xbNlhyfWuoGdGYpjusY0eD`

---

## `src/assets/profile/`

| File          | Source                                                      |
| ------------- | ----------------------------------------------------------- |
| `portrait.png` | Your photo. Portrait crop, roughly 3:4, at least 900px wide. |

## `src/assets/meet-in-room/` — page `CasestudyMeetingroom`

| File                        | Figma node | Layer name                              |
| --------------------------- | ---------- | --------------------------------------- |
| `cover.png`                 | `1:133`    | Project_Card_Thumbnails                 |
| `hero.png`                  | `1:8`      | Hero Mockup                             |
| `wireframes.png`            | `1:51`     | Paper Wireframes — structure & flow     |
| `ia-sitemap.png`            | `1:62`     | Information Architecture — sitemap      |
| `user-flow.png`             | `1:68`     | User Flow — booking with failure paths  |
| `style-guide.png`           | `1:72`     | Style Guide & Component Library         |
| `solution-availability.png` | `1:80`     | Availability first                      |
| `solution-request.png`      | `1:85`     | Request, don't walk                     |
| `solution-inbox.png`        | `1:90`     | Familiar inbox                          |
| `test-round-1.png`          | `1:119`    | Round 1 — tested at wireframe stage     |
| `test-round-2.png`          | `1:123`    | Round 2 — tested in high fidelity       |
| `ab-test.png`               | `1:127`    | A/B Test — booking entry                |

## `src/assets/ai-expense-agent/` — page `CasestudyExpensereporting`

| File                  | Figma node | Layer name                    |
| --------------------- | ---------- | ----------------------------- |
| `cover.png`           | `1:7319`   | Project_Card_Thumbnails       |
| `hero.png`            | `1:6869`   | Hero Mockup                   |
| `flow-upload.png`     | `9:25064`  | UploadScreen_1                |
| `flow-review.png`     | `9:25194`  | ReviewScreen_0                |
| `flow-justify.png`    | `9:25333`  | ReviewScreen_2_Justification_1 |
| `flow-messages.png`   | `9:25240`  | ReviewScreen_1_messages       |
| `flow-confirm.png`    | `9:25651`  | CofirmScreen                  |
| `flow-submitted.png`  | `9:25698`  | SubmitedScreen                |

## `src/assets/busstop/` — page `CasestudyBusstop`

| File                       | Figma node | Layer name                       |
| -------------------------- | ---------- | -------------------------------- |
| `cover.png`                | `1:1658`   | Project_Card_Thumbnails          |
| `competitive-analysis.png` | `9:8981`   | Group 3972 (competitive matrix)  |
| `persona.png`              | `9:8971`   | Group 3940 (persona)             |
| `ia.png`                   | `9:8886`   | Group 3805 (information arch.)   |
| `user-flow.png`            | `9:8141`   | Group 3977 (user flow)           |
| `wireframes.png`           | `9:8182`   | Group 3978 (wireframes)          |
| `type-color.png`           | `9:3765`   | Group 3981 (typography & colour) |
| `screen-home.png`          | `9:3811`   | Home                             |
| `screen-find-bus.png`      | `9:4344`   | Find Bus - All                   |
| `screen-live-track.png`    | `9:6531`   | Find Bus - 507K                  |
| `screen-alarm.png`         | `9:7935`   | Find Bus - 507K - Set Alarm      |

> The BusStop group IDs were matched by size and position rather than by an
> explicit label, so check each export looks like its caption before shipping.

## `src/assets/evergrove/` — page `Designwork-Webdesign`

| File              | Figma node | Layer name                                     |
| ----------------- | ---------- | ---------------------------------------------- |
| `cover.png`       | `4:2573`   | webDesign — **crop the top ~1080px** for the cover |
| `page.png`        | `4:2573`   | webDesign — the full page                      |
| `components.png`  | `4:3029`   | Components section                             |

## `src/assets/rate-conversion/` — page `Designwork-landingpage`

| File          | Figma node | Layer name           |
| ------------- | ---------- | -------------------- |
| `cover.png`   | `3:2371`   | Responsive_web-1440  |
| `page.png`    | `3:2371`   | Responsive_web-1440  |
| `mockup.png`  | `3:2394`   | Aiimg                |

---

## Not included

`Designwork-Newsletter` is an empty page in Figma, so it has no project entry.
Add one to `src/data/projects.ts` when there is something to show.
