# Assets — Figma export manifest

**Status: fulfilled.** Every image below is now a real PNG export in
`src/assets/`, and each entry's `ratio` in `projects.ts` matches the file's
measured intrinsic dimensions.

Keep this table as the record of which Figma node each file came from, so a
re-export later lands in the right place.

## How to replace one

1. In Figma, select the node listed below.
2. Export as **PNG, 2x**.
3. Overwrite the file of that name in `src/assets/<folder>/`.
4. Update that item's `ratio` in `projects.ts` to the new pixel dimensions.

`src/data/assets.ts` resolves images by name, so nothing else changes. The
`ratio` is only used to reserve space before load — it is released once the
browser knows the real size, so a wrong value costs a small layout shift and
never a distorted image.

File key: `xbNlhyfWuoGdGYpjusY0eD`

## Not from Figma

The development projects' images are generated SVGs, not exports, and have no
Figma node behind them:

| File | What it is |
| --- | --- |
| `<project>/cover.svg` | Editorial cover — 1600×1000 (16:10, the preview stage's ratio). Dark ground, mono kicker, serif hook, structural motif, stack line. |
| `expense-ai/cover.svg` | The development Expense AI entry's cover. The UI/UX entry (`ai-expense-agent`) keeps its Figma export. |
| `<project>/architecture.svg` | Architecture figure on paper ground. Every node, port, protocol and rule ID is quoted from that repository. |

Edit them as text, or regenerate. If a real screenshot arrives later, drop the
`.png` in beside the `.svg` and `assets.ts` prefers it automatically.

---

> The portrait is no longer used — the hero is typography-led — so
> `src/assets/profile/` has been removed.

## `src/assets/about/` — section `AboutSection`

Supplied images, not Figma exports. All four are processed for the web rather
than dropped in at source size.

| File | What it is |
| --- | --- |
| `portrait-cut.png` | Supplied already cut out of its backdrop (`NeubinImagenew.png`), then bounding-box cropped, padded on the empty side to bring the **face close to the file's horizontal centre**, and resized to 593×820 RGBA. The identity panel's arched window takes this file's aspect ratio and the image fills it, so the head lands under the apex of the arch with no offset in CSS. Replacing the portrait means redoing that crop-and-pad and updating `aspect-ratio: 593 / 820` in `AboutSection.vue` to match — otherwise the face drifts out from under the arch. |
| `mountains.png` | Flat vector landscape, resized to 1200×1200 and quantised to 128 colours. |
| `snow.png` | Flat vector landscape, resized to 1200×759 and quantised to 128 colours. |
| `music-mask.png` | Headphones drawn out of musical notes, 760×630. Used as a CSS `mask-image`, not as an `<img>`: the RGB is discarded and only the alpha is kept, so the artwork takes the panel's own ink instead of arriving with a ground of its own. |

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
