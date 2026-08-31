import type { Discipline, Project } from '@/types'

/**
 * PROJECT CONTENT
 *
 * Every headline, statistic, quote and paragraph below is transcribed from the
 * case-study pages in the Figma file `xbNlhyfWuoGdGYpjusY0eD`:
 *
 *   CasestudyMeetingroom        → meet-in-room
 *   CasestudyExpensereporting   → ai-expense-agent
 *   CasestudyBusstop            → busstop
 *   Designwork-Webdesign        → evergrove   (gallery — no documented process)
 *   Designwork-landingpage      → rate-conversion (gallery)
 *
 * Three of those pages carry real prototype wiring, and their `links` point at
 * the flow's own starting frame. EverGrove and the landing page have none, so
 * they carry no link.
 *
 * The development entries are transcribed the same way, from the repositories
 * rather than from Figma: source files, Docker and CI configuration, and
 * `git log`. Ports, rule IDs, thresholds and library names are quoted from the
 * code.
 *
 * `ai-expense-agent` and `expense-ai` are the same product told twice on
 * purpose — the designed concept and the thing that was built. They are
 * separate entries because they answer different questions.
 *
 * Nothing here is invented. Where the source is silent — a role title, a
 * prototype link — the field is absent rather than filled in.
 *
 * `Designwork-Newsletter` is an empty page in Figma and has no entry.
 */
export const projects: Project[] = [
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'ai-expense-agent',
    title: 'AI Expense Agent',
    eyebrow: 'Agentic UX · SAP Fiori for iOS',
    headline: 'An AI expense agent that shows its work.',
    hook: 'Why 96% of users picked an AI that asks over one that guesses. A human-in-the-loop agent that cites the policy rule behind every flag.',
    summary:
      'Enterprise expense tools optimise for speed, then reject you for a policy you never saw. I designed a human-in-the-loop AI agent for SAP Fiori for iOS that cites the exact policy rule behind every flag and stops to ask the moment its confidence drops, validated with 30 users and a moderated usability study scoring 74.4 SUS.',
    disciplines: ['ux'],
    year: '2026',
    tags: ['Agentic UX', 'Enterprise', 'iOS'],
    meta: {
      platform: 'iOS · Enterprise finance',
      context: 'SAP Fiori for iOS',
      method: 'Survey → interviews → design → moderated usability study',
      output: '74.4 mean SUS',
    },
    cover: {
      src: 'ai-expense-agent/cover',
      alt: 'AI Expense Agent — two iPhone screens showing the expense review flow',
      ratio: '1210/450',
    },
    presentation: 'case-study',
    featured: true,
    links: [
      {
        label: 'View Figma prototype',
        href: 'https://www.figma.com/proto/xbNlhyfWuoGdGYpjusY0eD/Portfolio?node-id=9-24980&starting-point-node-id=9%3A24980',
        kind: 'prototype',
      },
    ],
    sections: [
      {
        kind: 'stats',
        id: 'headline-numbers',
        marker: 'At a glance',
        items: [
          {
            value: '74.4',
            label: 'Mean SUS score',
            note: 'From a moderated usability study — above the 68.0 industry benchmark for enterprise software.',
          },
          {
            value: '30',
            label: 'Users behind the design',
            note: '26 survey respondents plus 4 in-depth interviews across sales, regional management, and admin roles.',
          },
          {
            value: '0%',
            label: 'Asked for full autonomy',
            note: 'Not one participant chose "the AI can handle everything" — the human-in-the-loop gate was earned, not assumed.',
          },
        ],
      },
      {
        kind: 'media',
        id: 'hero',
        layout: 'full',
        items: [
          {
            src: 'ai-expense-agent/hero',
            alt: 'The expense agent running on iPhone — receipt upload through to a reviewed, flagged report',
            ratio: '1640/1230',
          },
        ],
      },
      {
        kind: 'split',
        id: 'problem',
        marker: '02 — The problem',
        title: 'The business asked for speed. Users were asking for certainty.',
        columns: [
          {
            label: 'The business ask',
            heading: 'Automate expense reporting end to end.',
            body: 'Use AI to extract receipt data, cut submission time, and shrink the rework loop created by rejected claims — all inside SAP Fiori for iOS, using the existing design language.',
          },
          {
            label: 'The real user problem',
            heading: "Users aren't slowed down by typing. They're slowed down by not knowing the rules.",
            body: '"Understanding company policy" scored the highest frustration of any task in the workflow — 46% rated it 5 out of 5 — and half had already been rejected for a rule they never saw.',
          },
        ],
      },
      {
        kind: 'list',
        id: 'constraints',
        title: 'Constraints',
        items: [
          { term: 'Existing design system', detail: 'SAP Fiori for iOS — no new visual language.' },
          { term: 'Auditable by finance', detail: 'Every flag has to be traceable after the fact.' },
          { term: 'User stays accountable', detail: 'The person submitting owns the submission.' },
          { term: 'Mobile-first capture', detail: 'Receipts are photographed, not scanned at a desk.' },
        ],
      },
      {
        kind: 'quote',
        id: 'voice',
        text: "It's not fair to reject the claim; it can be rectified immediately through the app.",
        attribution: 'Interview participant · Regional manager',
      },
      {
        kind: 'stats',
        id: 'research',
        marker: '03 — Research & metrics',
        title: 'Nobody asked for a smarter autofill.',
        items: [
          {
            value: '96.2%',
            label: 'Ambiguity handling',
            note: 'chose "ask me to confirm" over "auto-fill the likely value" when the AI is only 75% sure.',
          },
          {
            value: '92.3%',
            label: 'Transparency → trust',
            note: 'said their trust would rise moderately or significantly if the AI cited the policy rule behind each decision.',
          },
          {
            value: '50%',
            label: 'The hidden rulebook',
            note: 'had already had a report rejected over a policy rule they never knew existed.',
          },
        ],
        footnote:
          'n = 26 survey respondents · 4 in-depth interviews · Roles: sales executives, regional managers, administrative staff',
      },
      {
        kind: 'steps',
        id: 'architecture',
        marker: '04 — The architecture',
        title: 'One confidence gate, every field.',
        lede: "The agent runs a Sense → Plan → Act loop. What makes it scale isn't the model — it's that every field, on every receipt type, is routed through the same threshold and the same explanation format.",
        items: [
          {
            label: '01 · Sense',
            heading: 'Capture & extract',
            body: 'OCR lifts 8–12 fields straight off the receipt image — no typing.',
          },
          {
            label: '02 · Plan',
            heading: 'Validate against policy',
            body: 'Every field is checked against the live rulebook and scored for confidence.',
          },
          {
            label: '03 · Act',
            heading: 'Ask, never guess',
            body: 'Below threshold the agent stops and asks for a justification.',
          },
          {
            label: '04 · Confirm',
            heading: 'The user owns the submit',
            body: 'Nothing is filed without an explicit, deliberate confirmation.',
          },
        ],
      },
      {
        kind: 'media',
        id: 'flow',
        title: 'The flow',
        layout: 'grid',
        items: [
          {
            src: 'ai-expense-agent/flow-upload',
            alt: 'Upload step — receipt attached, extraction in progress',
            ratio: '786/1704',
            caption: 'Upload',
          },
          {
            src: 'ai-expense-agent/flow-review',
            alt: 'Review step — fields marked "Suggested by AI", low-confidence fields flagged amber',
            ratio: '786/1704',
            caption: 'Review — confidence surfaced per field',
          },
          {
            src: 'ai-expense-agent/flow-justify',
            alt: 'Justification step — a policy violation asking for a written justification',
            ratio: '786/1704',
            caption: 'Justify — a violation invites an explanation',
          },
          {
            src: 'ai-expense-agent/flow-messages',
            alt: 'Messages panel grouping errors, warnings and information',
            ratio: '786/1768',
            caption: 'Messages — errors, warnings, information',
          },
          {
            src: 'ai-expense-agent/flow-confirm',
            alt: 'Confirm step — the completed report before submission',
            ratio: '786/1704',
            caption: 'Confirm',
          },
          {
            src: 'ai-expense-agent/flow-submitted',
            alt: 'Submitted confirmation screen',
            ratio: '786/1704',
            caption: 'Submitted',
          },
        ],
      },
      {
        kind: 'steps',
        id: 'scale',
        title: 'Why it scales',
        items: [
          {
            label: '01',
            heading: 'One gate, not a hundred rules.',
            body: 'Every extracted field carries a confidence score routed through a single threshold — green auto-fills, amber stops and asks. A new expense category or receipt type inherits that behaviour for free: no bespoke UI logic to design, test, or maintain per category.',
          },
          {
            label: '02',
            heading: 'Policy IDs, not generated prose.',
            body: 'Explanations are retrieved as policy references — "Policy 7.1 · T2 limit €50" — never written by the model. When finance updates the rulebook the interface updates with it: no redesign, no re-copywriting, and every flag stays auditable after the fact.',
          },
        ],
      },
      {
        kind: 'steps',
        id: 'solution',
        marker: '05 — Annotated solution',
        title: 'Three decisions carry the whole product.',
        items: [
          {
            label: '01',
            heading: 'Amber marks low confidence — the agent asks first.',
            body: 'Confidence is a visible property of every field, not a hidden model detail.',
          },
          {
            label: '02',
            heading: 'Every flag cites the exact policy rule breached.',
            body: 'The rule is named and retrievable, so the decision can be checked and defended.',
          },
          {
            label: '03',
            heading: 'Violations invite a justification, not a dead end.',
            body: 'A flagged claim can be argued in place rather than bounced back days later.',
          },
        ],
      },
      {
        kind: 'stats',
        id: 'impact',
        marker: '06 — Impact',
        title: 'Slower on paper. Trusted in practice.',
        items: [
          {
            value: '74.4',
            label: 'Mean SUS score',
            note: 'From a moderated usability study — above the 68.0 industry benchmark for enterprise software.',
          },
          {
            value: '30',
            label: 'Users behind the design',
            note: '26 survey respondents plus 4 in-depth interviews across sales, regional management, and admin roles.',
          },
          {
            value: '0%',
            label: 'Asked for full autonomy',
            note: 'Not one participant chose "the AI can handle everything" — the human-in-the-loop gate was earned, not assumed.',
          },
        ],
      },
      {
        kind: 'text',
        id: 'lesson',
        title: 'Biggest lesson learned',
        body: [
          'I started out trying to remove steps. The research kept telling me the opposite: what users wanted removed was the uncertainty, not the tap. Once I stopped treating confirmation as friction and started treating it as the product, the flow got slower on paper — and measurably more trusted in testing.',
          'Seamlessness and trust are not the same thing, and in compliance-critical work people will happily trade seconds for the ability to defend their own submission.',
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'meet-in-room',
    title: 'Meet-in-Room',
    eyebrow: 'Meet-in-Room · 8-week solo UX case study',
    headline: 'Turning a 300-metre walk into a three-tap booking.',
    hook: 'No system existed for booking a campus meeting room, so students walked 300 metres to find out if one was free. Availability you can see before you walk.',
    summary:
      'SRH Heidelberg had no system for booking meeting rooms: students and faculty walked between buildings just to find out whether one was free. I designed a mobile app that makes live room availability visible and bookable in seconds, refined across two rounds of usability testing and an A/B test on the booking entry point.',
    disciplines: ['ux'],
    year: '2024',
    tags: ['Mobile app', 'Design thinking', 'Usability testing'],
    meta: {
      platform: 'Mobile app',
      timeline: '8 weeks',
      context: 'SRH University Heidelberg',
      method: 'Interviews → personas → IA → prototype → 2 test rounds + A/B',
      output: '13 screens · 7 components',
    },
    cover: {
      src: 'meet-in-room/cover',
      alt: 'Meet-in-Room — the room booking app shown on two phones',
      ratio: '2440/900',
    },
    presentation: 'case-study',
    featured: true,
    links: [
      {
        label: 'View Figma prototype',
        href: 'https://www.figma.com/proto/xbNlhyfWuoGdGYpjusY0eD/Portfolio?node-id=9-10560&starting-point-node-id=9%3A10560',
        kind: 'prototype',
      },
    ],
    scopeNote:
      'Scope note — a self-directed academic case study. The app was not deployed, so the figures above are process outcomes, not production metrics. Research findings (300m, 60%, zero existing systems) come from 1:1 interviews conducted during the project.',
    sections: [
      {
        kind: 'media',
        id: 'hero',
        layout: 'full',
        items: [
          {
            src: 'meet-in-room/hero',
            alt: 'Meet-in-Room booking flow shown across several phone screens',
            ratio: '3360/1228',
          },
        ],
      },
      {
        kind: 'split',
        id: 'problem',
        marker: '02 — The problem',
        title: 'The ask was a booking form. The problem was visibility.',
        columns: [
          {
            label: 'The business ask',
            heading: 'Build a room-booking tool for campus.',
            body: 'Framed as a scheduling problem — give students and faculty a digital way to reserve a room and retire the walk-and-hope process. The constraints were fixed: one designer, an eight-week window, two user classes with different permissions, and university email that had to remain the source of truth for invites.',
          },
          {
            label: 'The real user problem',
            heading: 'Nobody could see what was free.',
            body: 'Interviews reframed it. Users were not failing to reserve rooms — they were failing to find out that one existed. Students walked 300 metres between Blue Tower and the library to check by eye; faculty arrived half an hour early to physically hold a room. Several did not know how many rooms the campus had. The breakdown was visibility, not booking.',
          },
        ],
      },
      {
        kind: 'quote',
        id: 'voice',
        text: 'I am always frustrated when I walk 300 meters from Blue Tower to the library just to check if any meeting rooms are available.',
        attribution: 'Tim Sebastian, 25 — MSc student, primary persona',
      },
      {
        kind: 'stats',
        id: 'research',
        marker: '03 — Research',
        title: 'What the interviews actually said.',
        items: [
          {
            value: '300m',
            label: 'Walked to check a room',
            note: 'The round trip between Blue Tower and the library — spent purely on reconnaissance, before any booking could happen.',
          },
          {
            value: '60%',
            label: 'Booked at the last minute',
            note: 'Students gave up planning ahead entirely. Faculty, who booked one to two days out, were the ones most often left without a room.',
          },
          {
            value: '0',
            label: 'Ways to see availability',
            note: "No system existed. Availability lived in people's heads and on the doors themselves — several interviewees did not know how many rooms campus had.",
          },
        ],
        footnote:
          'Method — 1:1 qualitative interviews with students and faculty at SRH University Heidelberg, covering current process, pain points, feature preferences, device context and booking behaviour. Findings synthesised into two personas and two journey maps.',
      },
      {
        kind: 'steps',
        id: 'architecture',
        marker: '04 — Architecture',
        title: 'One system, not ten screens.',
        items: [
          {
            label: '01',
            heading: 'Two roles, one flow.',
            body: 'Students and faculty needed different rooms and different rights — faculty explicitly asked for separate faculty spaces. Rather than fork the product, the IA branches at only two points: the room filter and the Requests tab. Adding a third user class is a permissions change, not a redesign.',
          },
          {
            label: '02',
            heading: 'A component library, not a screen set.',
            body: 'Meeting_Room_Card, Head&Back, TabBottom, Select date, Input Field and Chip are composed across all ten screens. New screens are assembled from existing parts, so the visual language holds without being redrawn — and the Request-a-slot flow slotted in without touching the booking path.',
          },
        ],
      },
      {
        kind: 'text',
        id: 'ia',
        marker: 'Information architecture',
        title: 'Three branches, nothing buried.',
        body: [
          'The sitemap splits the product into three task branches off the home page — Book Room, My Bookings and Requests — with Profile as a fourth nav destination. Nothing sits more than three levels deep.',
          'Each branch owns a complete job. My Bookings carries edit and cancel; Requests carries accept, decline and reschedule. Because those live in separate branches rather than inside the booking path, the booking flow never has to account for them. That separation is what let the Requests branch be added after round-one testing without reopening the booking flow.',
        ],
      },
      {
        kind: 'media',
        id: 'ia-media',
        layout: 'pair',
        items: [
          {
            src: 'meet-in-room/wireframes',
            alt: 'Paper wireframes exploring structure and flow',
            ratio: '1624/1280',
            caption: 'Paper wireframes — structure and flow before any styling.',
          },
          {
            src: 'meet-in-room/ia-sitemap',
            alt: 'Sitemap showing three task branches off the home page',
            ratio: '1624/1702',
            caption: 'Sitemap — three task branches, nothing deeper than three levels.',
          },
        ],
      },
      {
        kind: 'text',
        id: 'user-flow',
        marker: 'User flow',
        title: 'The happy path is short. The unhappy path is where the design is.',
        body: [
          'Choose room → add attendees → select slot. Three steps, and then the flow does the thing that matters: when the slot is already taken it does not dead-end. The user requests it, and if that request is declined they are returned to Check New Slot rather than to the start. Login failure loops back to retry rather than out of the app.',
          'Every branch in this diagram terminates in either a booking or another attempt — which is the whole answer to a campus where the old process ended in a 300-metre walk and a locked door.',
        ],
      },
      {
        kind: 'media',
        id: 'flow-media',
        layout: 'pair',
        items: [
          {
            src: 'meet-in-room/user-flow',
            alt: 'User flow diagram including failure paths for taken slots and login errors',
            ratio: '3360/1994',
            caption: 'The booking flow with its failure paths drawn in.',
          },
          {
            src: 'meet-in-room/style-guide',
            alt: 'Style guide showing the type ramp, colour palette and component library',
            ratio: '3360/1370',
            caption:
              'Style guide and component library — IBM Plex Sans type ramp, the five-colour palette, and the seven reusable components every screen is composed from.',
          },
        ],
      },
      {
        kind: 'steps',
        id: 'solution',
        marker: '05 — The solution',
        title: 'Three decisions that did the work.',
        items: [
          {
            label: 'Availability first',
            heading: 'Answer before form — free rooms surface on open.',
            body: 'The app opens on what is free right now, so the question that sent people walking is answered before anything is asked of them.',
          },
          {
            label: "Request, don't walk",
            heading: 'Slot taken? Request it instead of walking over.',
            body: 'A blocked slot becomes an action rather than a dead end — the flow that users themselves asked for once they raised the no-show problem.',
          },
          {
            label: 'Familiar inbox',
            heading: 'Invites land in college mail, not another app.',
            body: 'University email stays the source of truth, so nobody has to adopt a second inbox to be invited to a meeting.',
          },
        ],
      },
      {
        kind: 'media',
        id: 'solution-media',
        layout: 'trio',
        items: [
          {
            src: 'meet-in-room/solution-availability',
            alt: 'Home screen showing rooms that are free right now',
            ratio: '1056/2286',
            caption: 'Availability first',
          },
          {
            src: 'meet-in-room/solution-request',
            alt: 'A taken slot offering a Request action',
            ratio: '1056/2286',
            caption: "Request, don't walk",
          },
          {
            src: 'meet-in-room/solution-inbox',
            alt: 'Attendees added, with invites routed through college email',
            ratio: '1056/2286',
            caption: 'Familiar inbox',
          },
        ],
      },
      {
        kind: 'stats',
        id: 'outcome',
        marker: '06 — Outcome',
        title: 'What eight weeks produced.',
        items: [
          {
            value: '2',
            label: 'Rounds of usability testing',
            note: 'Each round changed the design rather than confirming it — two major revisions came directly out of watching people use the prototype.',
          },
          {
            value: '1',
            label: 'A/B test on the booking entry',
            note: 'Two entry treatments tested head to head to settle how users get from the room list into a booking.',
          },
          {
            value: '7',
            label: 'Components behind 13 screens',
            note: 'Meeting_Room_Card, Head&Back, TabBottom, Select date, Input Field, Chip and Button compose every screen in the flow.',
          },
        ],
      },
      {
        kind: 'list',
        id: 'testing',
        title: 'What testing changed',
        items: [
          {
            term: 'Round 1 — tested at wireframe stage',
            detail:
              'Testers could not act on a room that was already booked. A Requests entry was added to the bottom bar, and a Request button to each taken slot — caught before a single pixel was styled.',
          },
          {
            term: 'Round 2 — tested in high fidelity',
            detail:
              'With more rooms in view, users lost track of which building they were browsing. A persistent filter was pinned above the list so the active building is always visible.',
          },
        ],
      },
      {
        kind: 'media',
        id: 'testing-media',
        layout: 'trio',
        items: [
          {
            src: 'meet-in-room/test-round-1',
            alt: 'Round one testing findings annotated on wireframes',
            ratio: '1624/1078',
            caption: 'Round 1 — at wireframe stage',
          },
          {
            src: 'meet-in-room/test-round-2',
            alt: 'Round two testing findings annotated on high-fidelity screens',
            ratio: '1624/1356',
            caption: 'Round 2 — in high fidelity',
          },
          {
            src: 'meet-in-room/ab-test',
            alt: 'A/B test comparing two booking entry treatments',
            ratio: '1624/1356',
            caption: 'A/B test — booking entry',
          },
        ],
      },
      {
        kind: 'text',
        id: 'lesson',
        marker: 'Biggest lesson learned',
        title: 'Research changed the noun.',
        body: [
          'I went in designing a booking tool and came out designing an availability tool. Building the form first would have solved the wrong problem very convincingly.',
          'The second lesson came from the users themselves — they raised the abuse case before I did, warning that people would reserve rooms and never turn up. I had been designing for good-faith users only. The Requests flow, where a blocked slot can be challenged instead of walked to, exists because they were more honest about their own behaviour than I was.',
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'busstop',
    title: 'BusStop',
    eyebrow: 'Route 01 · Consumer transit app · 2024',
    headline: 'Find the bus. Track the bus.',
    hook: '80% of the riders I surveyed had already missed a bus to a schedule that lied. A guest-first transit app that turns an unreliable timetable into a live, trackable route in three taps.',
    summary:
      'Riders had no trusted source for local bus timings and no way to see where the bus actually was. I designed both — schedule truth and live tracking — behind a guest login.',
    disciplines: ['ux'],
    year: '2024',
    tags: ['Consumer app', 'Transit', 'UX research'],
    meta: {
      role: 'Lead UI/UX Designer',
      timeline: '8 weeks · 2024',
      method: 'Research → IA → UI → Test',
      output: '40 hi-fi · 18 wireframes',
    },
    cover: {
      src: 'busstop/cover',
      alt: 'BusStop — the transit app shown on two phones',
      ratio: '7112/5334',
    },
    presentation: 'case-study',
    featured: false,
    links: [
      {
        label: 'View Figma prototype',
        href: 'https://www.figma.com/proto/xbNlhyfWuoGdGYpjusY0eD/Portfolio?node-id=9-4291&starting-point-node-id=9%3A4291',
        kind: 'prototype',
      },
    ],
    sections: [
      {
        kind: 'text',
        id: 'roadblock',
        marker: 'Stop 02 — The roadblock',
        title: 'The missed connection',
        body: [
          'My hometown had no dependable way to find when the local bus actually leaves — let alone where it is right now. Riders stitched together word of mouth, printed timetables that had already expired, and apps built for trains and metros.',
          'The competitive audit made the gap concrete: across four apps riders already had installed, not one covered local bus schedules and live tracking together.',
        ],
      },
      {
        kind: 'list',
        id: 'gap',
        title: "The gap: the one app that tracks live doesn't do local buses",
        items: [
          { term: 'Schedules', detail: 'No trusted source for local bus timings.' },
          { term: 'Location', detail: 'Zero live location — you wait blind at the stop.' },
          {
            term: 'Access',
            detail: 'Three of four rivals demand signup before you can even look.',
          },
        ],
      },
      {
        kind: 'media',
        id: 'competitive-media',
        layout: 'pair',
        items: [
          {
            src: 'busstop/competitive-analysis',
            alt: 'Competitive analysis matrix comparing Bus Times, Google Maps, Moovit and Where is my Train',
            ratio: '1806/1417',
            caption:
              'Competitive analysis — guest account, local schedules, live tracking, alarm setter.',
          },
          {
            src: 'busstop/persona',
            alt: 'User persona for Dhakshayani C, 22, designer in Bangalore',
            ratio: '1173/1135',
            caption: 'Primary persona — a daily commuter, not an occasional traveller.',
          },
        ],
      },
      {
        kind: 'stats',
        id: 'research',
        marker: 'Stop 03 — Route to success',
        title: 'What the riders told me',
        items: [
          {
            value: '40%',
            label: 'Trip use',
            note: 'have used a local bus for out-of-town trips. The bus is a default for journeys, not just commutes.',
          },
          {
            value: '55%',
            label: 'Daily use',
            note: 'ride a local bus every day for school or work. Daily riders are the core audience — reliability compounds.',
          },
          {
            value: '80%',
            label: 'The breaking point',
            note: 'had already missed a bus to a schedule that was wrong. Live tracking was the single most requested feature.',
          },
        ],
      },
      {
        kind: 'text',
        id: 'system',
        marker: 'Stop 04 — The system map',
        title: 'Built like a city, not a screen',
        body: [
          'Eighteen wireframes became one street plan — every route reusing the same blocks, so a new bus type or a new city drops in without redrawing the map.',
          'The bus card is the atom: list, detail and alarm all reuse it. One search pattern serves stop, route and bus-number lookup. Live tracking is a destination, never a dead end. And the whole thing is guest-first — every screen works before an account exists.',
        ],
      },
      {
        kind: 'media',
        id: 'system-media',
        layout: 'pair',
        items: [
          {
            src: 'busstop/ia',
            alt: 'Information architecture showing home, bus and bus stop branches',
            ratio: '924/668',
            caption: 'Information architecture — guest-first, three ways in.',
          },
          {
            src: 'busstop/user-flow',
            alt: 'User flow from search through bus details to live tracking',
            ratio: '1104/1469',
            caption: 'Search → bus details → live track: one component, three inputs.',
          },
        ],
      },
      {
        kind: 'steps',
        id: 'core-route',
        title: 'Three ways in, one way through',
        items: [
          {
            label: 'Search',
            heading: 'One component, three inputs',
            body: 'From + To stops, bus stop name, or bus number / name — all served by the same search pattern.',
          },
          {
            label: 'Bus details',
            heading: 'Schedules, fare, delay flags',
            body: 'Departure and arrival, operator, fare, and an on-time or delayed status per service.',
          },
          {
            label: 'Live track',
            heading: 'The payoff — where it is now',
            body: 'The map view riders actually came for, with a stop alarm so they can stop watching it.',
          },
        ],
      },
      {
        kind: 'text',
        id: 'visual',
        marker: 'Stop 05 — The destination',
        title: 'The bus, made legible',
        body: [
          'High-visibility blue on navy, oversized numerals, one decision per screen — the interface borrows its manners from the signage at the stop itself.',
        ],
      },
      {
        kind: 'media',
        id: 'screens',
        layout: 'grid',
        items: [
          {
            src: 'busstop/screen-home',
            alt: 'Home screen with From and To inputs',
            ratio: '786/1704',
            caption: 'From and To only. One job per screen.',
          },
          {
            src: 'busstop/screen-find-bus',
            alt: 'Bus results list with fares and on-time status',
            ratio: '786/1704',
            caption: 'Results — schedules, fare, delay flags.',
          },
          {
            src: 'busstop/screen-live-track',
            alt: 'Live tracking view for route 507K',
            ratio: '786/1704',
            caption: 'Redesigned simpler after users stalled on this screen.',
          },
          {
            src: 'busstop/screen-alarm',
            alt: 'Stop alarm configuration screen',
            ratio: '786/1704',
            caption: 'Stop alarm frees riders from watching the map.',
          },
          {
            src: 'busstop/type-color',
            alt: 'Typography and colour system — Quicksand and Reem Kufi on navy',
            ratio: '2634/2470',
            caption: 'Borrowed from the signage — Quicksand and Reem Kufi.',
          },
          {
            src: 'busstop/wireframes',
            alt: 'Eighteen wireframes laid out as a system',
            ratio: '2978/2912',
            caption: 'Eighteen wireframes, one street plan.',
          },
        ],
      },
      {
        kind: 'stats',
        id: 'arrival',
        marker: 'Stop 06 — Arrival',
        title: 'Three taps to a moving bus',
        items: [
          {
            value: '0',
            label: 'Accounts needed before the first search',
            note: 'Guest-first: no signup wall before the first search.',
          },
          {
            value: '1',
            label: 'Feature cut after usability testing',
            note: 'The date picker felt like a feature until testing showed nobody plans a local bus trip for next Tuesday.',
          },
          {
            value: '40',
            label: 'High-fidelity screens designed',
            note: 'From eighteen wireframes, composed from a single reusable block set.',
          },
        ],
        footnote:
          'Three taps from opening the app to watching your bus move on the map — with no account, no signup wall and no guesswork at the stop.',
      },
      {
        kind: 'text',
        id: 'lesson',
        title: 'What cutting taught me',
        body: [
          'The date picker felt like a feature until testing showed nobody plans a local bus trip for next Tuesday. Cutting it — and simplifying the live-tracking screen people stalled on — moved the product further than anything I added.',
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'evergrove',
    title: 'EverGrove',
    eyebrow: 'Interface design · SaaS marketing site',
    headline: 'A productivity platform, dressed for launch.',
    hook: 'A full marketing site for a collaboration platform — hero through pricing and testimonials — designed alongside the button and link system that holds it together.',
    summary:
      'An end-to-end landing page for EverGrove, an all-in-one collaboration and productivity platform: hero, feature story, testimonials, two-tier pricing and footer, built on a small component set with every interaction state drawn.',
    disciplines: ['ux'],
    year: '2024',
    tags: ['Web design', 'Design system', 'Marketing site'],
    meta: {
      platform: 'Responsive web · 1440',
      output: 'Full landing page + component states',
      context: 'Self-directed interface study',
    },
    cover: {
      src: 'evergrove/cover',
      alt: 'EverGrove landing page hero',
      ratio: '2882/2606',
    },
    presentation: 'gallery',
    featured: true,
    links: [],
    sections: [
      {
        kind: 'text',
        id: 'about',
        title: 'What this shows',
        body: [
          'This one is presented as work, not as a case study — there is no research behind it to report, and inventing some would be worse than saying so.',
          'What it does show is composition and system thinking at full page length: a hero that carries a single claim, a feature section that earns its screenshot, social proof that does not swamp the page, and a two-tier pricing table where the difference between plans is legible at a glance. Underneath it sits a component set with default, hover, active and disabled states drawn for every button and link — the part that decides whether a design survives being built.',
        ],
      },
      {
        kind: 'media',
        id: 'page',
        title: 'The page',
        layout: 'full',
        items: [
          {
            src: 'evergrove/page',
            display: 'longform',
            alt: 'Full EverGrove landing page — hero, clients, features, testimonials, pricing and footer',
            ratio: '2882/8958',
            caption: 'Full page at 1440 — hero through footer.',
          },
        ],
      },
      {
        kind: 'media',
        id: 'components',
        title: 'The component set',
        layout: 'full',
        items: [
          {
            src: 'evergrove/components',
            alt: 'Component sheet showing primary and secondary buttons and links in default, hover, active and disabled states',
            ratio: '4012/3186',
            caption:
              'Primary, secondary and link treatments — default, hover, active and disabled.',
          },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'rate-conversion',
    title: 'Rate Conversion Tool',
    eyebrow: 'Interface design · Product landing page',
    headline: 'One claim, one action, one screen.',
    hook: 'A single-screen product landing page for an AI rate-conversion tool — the whole argument made above the fold and closed with one call to action.',
    summary:
      'A responsive landing page for an AI-generated rate conversion tool, built as an exercise in getting a product’s entire pitch — claim, proof and action — to land inside one screen.',
    disciplines: ['ux'],
    year: '2024',
    tags: ['Web design', 'Landing page'],
    meta: {
      platform: 'Responsive web · 1440',
      context: 'Self-directed interface study',
    },
    cover: {
      src: 'rate-conversion/cover',
      alt: 'Rate conversion tool landing page',
      ratio: '3946/2960',
    },
    presentation: 'gallery',
    featured: false,
    links: [],
    sections: [
      {
        kind: 'text',
        id: 'about',
        title: 'What this shows',
        body: [
          'A compact study rather than a case study: no research phase, so none is claimed.',
          'The exercise was compression — a single headline carrying the claim, one supporting line, one proof point, and a single account-creation action, with the product image doing the explaining that copy would otherwise have to.',
        ],
      },
      {
        kind: 'media',
        id: 'page',
        title: 'The page',
        layout: 'full',
        items: [
          {
            src: 'rate-conversion/page',
            alt: 'Rate conversion tool landing page at 1440 width',
            ratio: '2886/2508',
          },
        ],
      },
    ],
  },

  // ── Development ───────────────────────────────────────────────────────────
  // Everything below is transcribed from the repositories themselves — source,
  // Docker and CI files, and `git log`. History is used to check what is true,
  // never quoted: where it cannot support a claim about my own part, the entry
  // simply carries no contribution section.
  {
    slug: 'expense-ai',
    title: 'Expense AI',
    eyebrow: 'Human-in-the-loop · FastAPI + React',
    headline: 'A policy engine that never guesses.',
    hook: 'The working prototype behind the expense agent. A receipt goes in, cited policy issues come out, and any field the OCR is unsure of stops the flow rather than being filled in.',
    summary:
      'The coded prototype of the AI Expense Agent concept: FastAPI, Tesseract and SQLite behind a React and TypeScript front end. The whole idea rests on one claim — that an agent should be able to show its work — so the build is arranged to make that claim true. Every flag traces to a rule ID, and no model sits anywhere near the decision.',
    disciplines: ['development'],
    year: '2026',
    tags: ['FastAPI', 'React 19', 'TypeScript', 'OCR'],
    meta: {
      context: 'Solo project',
      platform: 'FastAPI · React · SQLite',
      output: 'Working local prototype',
    },
    cover: {
      src: 'expense-ai/cover',
      alt: 'Expense AI — a confidence gate on every field',
      ratio: '1600/1000',
    },
    presentation: 'deep-dive',
    featured: false,
    links: [
      {
        label: 'View GitHub repository',
        href: 'https://github.com/neubiii/Expense-AI',
        kind: 'repo',
      },
    ],
    sections: [
      {
        kind: 'text',
        id: 'overview',
        marker: '01 — The system',
        title: 'What it does',
        body: [
          'Photograph a receipt and the service reads it, checks it against an expense policy, and hands back a verdict with the rule behind it. Nothing is filed until the person submitting says so.',
          'It runs a sense–plan–act loop: OCR lifts the fields and their confidences, a rule engine decides, and the interface explains and asks. The interaction design it implements is the AI Expense Agent case study; this page is about how the thing is put together.',
        ],
      },
      {
        kind: 'media',
        id: 'architecture',
        title: 'How a receipt becomes a decision',
        layout: 'full',
        items: [
          {
            src: 'expense-ai/architecture',
            alt: 'Backend pipeline: a React client posts a receipt to FastAPI, which runs OCR, a field parser, the policy engine and an explanation step, writing submissions to SQLite',
            caption: 'Drawn from the routers and services in the repository, including the three rule IDs the engine can raise.',
          },
        ],
      },
      {
        kind: 'steps',
        id: 'decisions',
        marker: '02 — Decisions',
        title: 'Three worth defending',
        items: [
          {
            label: 'One',
            heading: 'The policy engine is deterministic on purpose.',
            body: 'validate_policy walks the extracted fields and returns issues, each carrying a severity, a rule ID and a plain-language summary. Missing required fields raise POL-REQ-001; anything the OCR read with less than 0.75 confidence raises POL-CONF-100; a meal over 20 EUR raises POL-LIM-010. No model is consulted, so the same receipt always produces the same verdict and the interface can cite the exact rule instead of a probability.',
          },
          {
            label: 'Two',
            heading: 'A justification downgrades a failure rather than bypassing it.',
            body: 'When a meal breaks the limit the engine looks for a justification filed against that rule ID. If one is there the issue becomes a WARN with its own message — allowed, but flagged for a reviewer. The escape hatch is a rule, not a special case buried in the interface.',
          },
          {
            label: 'Three',
            heading: 'The explanation is mocked against a real contract.',
            body: 'The explain route builds its answer only from the issues and rule summaries the engine produced, and returns the same JSON shape a model endpoint would. The front end is already written against that contract, so swapping the mock for a hosted model is a change to one file — and the explanation still cannot invent a reason the engine did not raise.',
          },
        ],
      },
      {
        kind: 'list',
        id: 'build',
        marker: '03 — The build',
        title: 'How the rest of it is put together',
        items: [
          {
            term: 'Extraction',
            detail: 'PNG or JPEG only. pytesseract returns per-word confidences, and a regex and keyword parser turns the text into merchant, date, total, currency and category — each with its own confidence, which is what the review screen colours green, amber or red.',
          },
          {
            term: 'Submission gate',
            detail: 'POST /submission/create returns BLOCKED unless user_confirmed is true. The human-in-the-loop rule is enforced by the API, not only by the button.',
          },
          {
            term: 'Audit trail',
            detail: 'Each submission writes a record plus an audit event holding the issues raised, the edits the person made, their justifications and the final review state — so the trail shows what the machine proposed and what the human changed.',
          },
          {
            term: 'Front end',
            detail: 'React 19 and TypeScript over three screens — upload, review, summary — with no component library, so the confidence states are styled rather than fought with.',
          },
          {
            term: 'Voice input',
            detail: 'The description field accepts speech through the browser SpeechRecognition API behind a capability check, and falls back to typing where the API is missing.',
          },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'live-market-dashboard',
    title: 'Live Market Dashboard',
    eyebrow: 'Real-time systems · Python microservices',
    headline: 'One Redis stream, read two different ways.',
    hook: 'Eight FastAPI services around a single Redis stream. One reader fans every tick out to the browser; the other joins a consumer group so an alert is evaluated once, however many instances are running.',
    summary:
      'A live market dashboard fed by Finnhub’s trade websocket and split into eight FastAPI services on one Docker Compose file. Built as a team project, with my work focused on the real-time gateway, the anomaly detection and watchlist flows, the stock relationship graph, and parts of the dashboard they report into.',
    disciplines: ['development'],
    year: '2025',
    tags: ['FastAPI', 'Redis Streams', 'WebSockets', 'Neo4j'],
    meta: {
      role: 'Real-time services, alerts, graph service, dashboard',
      context: 'Group project · 5 contributors',
      platform: 'Docker Compose · 8 services',
    },
    cover: {
      src: 'live-market-dashboard/cover',
      alt: 'Live Market Dashboard — eight services around one Redis stream',
      ratio: '1600/1000',
    },
    presentation: 'deep-dive',
    featured: false,
    links: [
      {
        label: 'View GitHub repository',
        href: 'https://github.com/neubiii/Conversational_LiveMarket_Dashboard-Group-Project-',
        kind: 'repo',
      },
    ],
    sections: [
      {
        kind: 'text',
        id: 'overview',
        marker: '01 — The system',
        title: 'What it does',
        body: [
          'Finnhub publishes trades over a websocket. One service holds that socket open on a background thread, hands each trade to the asyncio loop through a queue, and appends it to a Redis stream called market:stream. Everything downstream reads that one stream.',
          'The dashboard shows live prices, a per-user watchlist, alerts on the symbols that user follows, and a force-directed graph of how companies relate to each other. A conversational assistant answers questions over the same data.',
        ],
      },
      {
        kind: 'media',
        id: 'architecture',
        title: 'How the data moves',
        layout: 'full',
        items: [
          {
            src: 'live-market-dashboard/architecture',
            alt: 'Finnhub feeds the market data service, which writes to a Redis stream; a realtime gateway and an anomaly detector read it differently and each hold a websocket open to the React dashboard',
            caption: 'Service names, ports and read commands are taken from the compose file and the service sources.',
          },
        ],
      },
      {
        kind: 'steps',
        id: 'decisions',
        marker: '02 — Decisions',
        title: 'Three that shaped the build',
        items: [
          {
            label: 'One',
            heading: 'Two readers on one stream, deliberately different.',
            body: 'The gateway does a plain blocking XREAD from the end of the stream and forwards everything to every browser on /ws/market-data, because a price chart is only correct if each client sees each tick. The detector joins the consumer group anomaly_group and acknowledges what it reads, because an alert must fire once no matter how many copies of the service are running. Same stream, opposite requirements — and the two commands are the whole difference.',
          },
          {
            label: 'Two',
            heading: 'Alerts are gated on the watchlist before detection runs.',
            body: 'The feed carries far more symbols than anyone is following. The detector refreshes each connected user’s watchlist from the watchlist service every ten seconds and discards ticks that are not on one, so the detection window only ever fills with symbols someone asked about. It also keeps the work proportional to users rather than to the market.',
          },
          {
            label: 'Three',
            heading: 'Detection is a five-tick window, not a model.',
            body: 'Every watched symbol keeps a deque of its last five trades. The newest price is compared against the oldest in that window and the newest volume against the mean of the rest; crossing either threshold pushes an alert down a second websocket. The thresholds are constants at the top of the file rather than something learned, which is what makes the alert explainable when it fires.',
          },
        ],
      },
      {
        kind: 'text',
        id: 'graph',
        title: 'Why the relationships live in a graph',
        body: [
          'The question the graph page answers — what is connected to this company, and how — is a traversal, not a join. So the relationship service keeps companies as Neo4j nodes and their links as typed edges: SUPPLIES_CHIPS_TO, COMPETES_WITH, OWNED_BY, DISTRIBUTES_THROUGH and a dozen more.',
          'The seed data is written with MERGE rather than CREATE, so restarting the container re-runs it without duplicating anything. The service returns a plain nodes-and-links payload, which the frontend draws with react-force-graph.',
        ],
      },
      {
        kind: 'text',
        id: 'contribution',
        marker: '03 — My part',
        title: 'What I worked on',
        body: [
          'My work focused mainly on the real-time gateway, the anomaly detection service, the watchlist and its alerts, and the stock relationship graph — along with the dashboard pages those services feed.',
          'The two read patterns above are the part I would most want to talk through.',
        ],
      },
      {
        kind: 'list',
        id: 'stack',
        title: 'Stack',
        items: [
          { term: 'Services', detail: 'FastAPI, redis.asyncio, motor for MongoDB, the async Neo4j driver, httpx between services.' },
          { term: 'Frontend', detail: 'React 19, Redux Toolkit, MUI, Chart.js and Recharts, react-force-graph, native WebSocket.' },
          { term: 'Infrastructure', detail: 'Docker Compose brings up Redis, MongoDB, Neo4j and Qdrant alongside the eight services on one network.' },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'cooking-assistant',
    title: 'Cooking Assistant',
    eyebrow: 'Microservices · Observability',
    headline: 'Four services behind one gateway.',
    hook: 'A recipe manager split into four Express services, with a correlation ID that survives every hop and turns four separate logs into one traceable request in Kibana.',
    summary:
      'A team project built for a software architecture course: a recipe manager deliberately split into four Express services behind an API gateway, sharing one MongoDB cluster, containerised with Docker Compose and shipped to Heroku by GitHub Actions.',
    disciplines: ['development'],
    year: '2025',
    tags: ['Node', 'Express', 'MongoDB', 'Docker'],
    meta: {
      context: 'Team project',
      platform: 'Microservices · Vue 3 client',
    },
    cover: {
      src: 'cooking-assistant/cover',
      alt: 'Cooking Assistant — four services behind one gateway',
      ratio: '1600/1000',
    },
    presentation: 'deep-dive',
    featured: false,
    links: [
      {
        label: 'View GitHub repository',
        href: 'https://github.com/neubiii/CookingAssistant',
        kind: 'repo',
      },
    ],
    sections: [
      {
        kind: 'text',
        id: 'overview',
        marker: '01 — The system',
        title: 'What it does',
        body: [
          'Users create and manage recipes; admins manage accounts and pull usage reports. The interesting part is not the feature list — it is that a small application was split four ways on purpose, so the seams had to be designed rather than assumed.',
          'A Vue 3 client talks only to an api-gateway on port 5005. The gateway proxies /api/auth, /api/recipes, /api/user-management and /api/analytics to four Express services with http-proxy-middleware, applies a CORS origin allowlist and a 100-request-per-15-minute rate limit, and publishes a Swagger UI describing the routes it fronts.',
        ],
      },
      {
        kind: 'media',
        id: 'architecture',
        title: 'The topology',
        layout: 'full',
        items: [
          {
            src: 'cooking-assistant/architecture',
            alt: 'A Vue client calls an API gateway on port 5005, which proxies to four Express services sharing one MongoDB cluster, with correlation IDs and Winston logging alongside',
            caption: 'Ports and middleware taken from the gateway source and the compose file.',
          },
        ],
      },
      {
        kind: 'steps',
        id: 'decisions',
        marker: '02 — Decisions',
        title: 'What the split forced us to solve',
        items: [
          {
            label: 'One',
            heading: 'A request that crosses four services needs one identifier.',
            body: 'The gateway takes the incoming x-correlation-id header or mints a UUID, stores it in a cls-hooked namespace, and echoes it on the response. Because the namespace is bound to the async context, any code further down can read the ID without it being threaded through every function signature — which is what usually kills this pattern halfway through.',
          },
          {
            label: 'Two',
            heading: 'Logs are only useful once they are in one place.',
            body: 'Each service logs through Winston to Elasticsearch with its own index, so a single correlation ID reconstructs the whole path of a request in Kibana instead of leaving four partial stories in four terminals. Distributed tracing at its smallest useful size.',
          },
          {
            label: 'Three',
            heading: 'Authorisation is one middleware, not a check per route.',
            body: 'Auth issues a JWT carrying a role; a five-line authorize(role) middleware guards the admin routes. Small, but it is the reason the analytics service can expose report and log-deletion endpoints without every handler repeating the same conditional.',
          },
        ],
      },
      {
        kind: 'list',
        id: 'delivery',
        title: 'Delivery',
        items: [
          { term: 'Local', detail: 'One docker-compose file builds six images — the four services, the gateway and the client — and wires them with environment variables rather than hardcoded hosts.' },
          { term: 'Deploy', detail: 'A GitHub Actions workflow logs into the Heroku container registry and pushes and releases each of the six apps on every merge to main.' },
          { term: 'Docs', detail: 'Every service carries swagger-jsdoc annotations, and the gateway serves a combined Swagger UI at /api-docs.' },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'fraud-detection',
    title: 'Fraud Detection: AutoML vs Custom',
    eyebrow: 'Cloud ML · Model comparison',
    headline: 'Two prediction backends, one response shape.',
    hook: 'The same transaction form answered by a Vertex AI AutoML endpoint and by a custom ensemble on Cloud Run — with the server normalising both into one shape so the interface never learns which model replied.',
    summary:
      'A group project comparing a Vertex AI AutoML classifier against a hand-built ensemble on the same fraud dataset. A React form posts a transaction to an Express API on App Engine, which routes it to one backend or the other and returns a single response shape.',
    disciplines: ['development'],
    year: '2025',
    tags: ['Google Cloud', 'Vertex AI', 'React', 'Express'],
    meta: {
      role: 'Prediction form, results view, integration',
      context: 'Group project · 3 contributors',
      platform: 'App Engine · Cloud Run · Vertex AI',
    },
    cover: {
      src: 'fraud-detection/cover',
      alt: 'Fraud detection — two model backends, one response shape',
      ratio: '1600/1000',
    },
    presentation: 'deep-dive',
    featured: false,
    links: [
      {
        label: 'View GitHub repository',
        href: 'https://github.com/neubiii/fraud-detection-automl-vs-custom-model-GroupProject',
        kind: 'repo',
      },
    ],
    sections: [
      {
        kind: 'text',
        id: 'overview',
        marker: '01 — The system',
        title: 'What it does',
        body: [
          'You fill in a transaction — type, amount, both balances before and after — and get a fraud probability back. The point of the project is that the same form can be answered by two very different backends, so the two can be compared on identical input rather than on published metrics.',
          'The client posts features plus a modelType to a single /predict route on an Express server. What happens next depends entirely on that one field.',
        ],
      },
      {
        kind: 'media',
        id: 'architecture',
        title: 'The two paths',
        layout: 'full',
        items: [
          {
            src: 'fraud-detection/architecture',
            alt: 'A React client posts to an Express server on App Engine, which either calls a Vertex AI AutoML endpoint or a two-step Cloud Run service that preprocesses then predicts with a custom ensemble',
            caption: 'Both routes are in server.js and predict.js; the normalisation happens before the response leaves the API.',
          },
        ],
      },
      {
        kind: 'steps',
        id: 'decisions',
        marker: '02 — Decisions',
        title: 'Where the engineering actually was',
        items: [
          {
            label: 'One',
            heading: 'The two backends disagree about their own output.',
            body: 'AutoML answers with classes and scores. The custom service answers with three separate probabilities — a random forest, a deep network, and a meta-learner over both. The server rebuilds the custom response into the same classes-and-scores pairs before returning it, so the results component renders either one without knowing which model produced it. Without that step the comparison would have leaked into the UI.',
          },
          {
            label: 'Two',
            heading: 'The custom model needs two calls, not one.',
            body: 'Encoding lives with the model rather than with the caller: the Cloud Run service exposes /preprocess and /predict separately, and the server chains them, failing loudly if the first does not return an array. The client also derives three ratio features of its own — amount against the opening balance, and the change in each side’s balance — which is the kind of duplication worth naming rather than hiding.',
          },
          {
            label: 'Three',
            heading: 'Which model is live is an environment change, not a code change.',
            body: 'Two npm scripts, start:automl and start:custom, copy a different .env into place before starting the server. Endpoint IDs and the project stay out of the source, and switching the demo between models takes a restart.',
          },
        ],
      },
      {
        kind: 'text',
        id: 'contribution',
        marker: '03 — My part',
        title: 'What I worked on',
        body: [
          'My work focused on the prediction form and the results view, and on the server-side integration that made both model paths come back to the interface in the same shape. The models themselves were trained and deployed outside this repository.',
        ],
      },
      {
        kind: 'list',
        id: 'delivery',
        title: 'Delivery',
        items: [
          { term: 'Hosting', detail: 'Express on App Engine, runtime nodejs20, instance class F2, serving the built React client as static files from the same service.' },
          { term: 'Auth', detail: 'google-auth-library mints an access token per request for the Vertex endpoint; the Cloud Run service is called directly.' },
          { term: 'CI', detail: 'A GitHub Actions workflow builds the client, installs the server and deploys both with gcloud app deploy on every push to main.' },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'event-scheduler',
    title: 'Event Scheduler',
    eyebrow: 'Testing · Continuous integration',
    headline: 'A calendar app where the testing was the assignment.',
    hook: 'Built for a verification course, so the interesting half is the test suite: ten Jest suites, seven Cypress specs and a pipeline that runs them on every push.',
    summary:
      'A React and Redux Toolkit calendar for creating, editing and sharing events, built for a usability-testing and verification course. A team project, with my work focused on the event editing and invitation features and on most of the unit tests around them.',
    disciplines: ['development'],
    year: '2025',
    tags: ['React', 'Redux Toolkit', 'Jest', 'Cypress'],
    meta: {
      role: 'Event editing, invitations, unit tests',
      context: 'Group project · 3 contributors',
      platform: 'Responsive web',
    },
    cover: {
      src: 'event-scheduler/cover',
      alt: 'Event Scheduler — a calendar app where the tests were the point',
      ratio: '1600/1000',
    },
    presentation: 'deep-dive',
    featured: false,
    links: [
      {
        label: 'View GitHub repository',
        href: 'https://github.com/neubiii/React-Event-Scheduler-Application',
        kind: 'repo',
      },
    ],
    sections: [
      {
        kind: 'text',
        id: 'overview',
        marker: '01 — The system',
        title: 'What it does',
        body: [
          'Sign in, open a calendar, click a slot, and fill in an event. FullCalendar supplies the day, week and month views; Redux Toolkit holds the events; json-server stands in for a backend, which keeps the project honest about being coursework rather than dressing a fixture file up as an API.',
          'Submitting the form also sends invitations: the attendee addresses go straight to EmailJS from the browser. The My Events page lists what you created, with search, filtering and infinite scroll once the list gets long.',
        ],
      },
      {
        kind: 'text',
        id: 'testing',
        marker: '02 — Verification',
        title: 'The half that was the point',
        body: [
          'The brief was a verification course, so the suite is not an afterthought. Ten Jest suites cover the components, an integration suite covers the API layer, and seven Cypress specs drive the real flows — auth, the calendar, navigation, my events, infinite scroll.',
          'A GitHub Actions workflow runs the tests and the production build on every push to main and dev, so a red suite blocks the branch rather than being discovered at a demo.',
        ],
      },
      {
        kind: 'list',
        id: 'contribution',
        marker: '03 — My part',
        title: 'What I worked on',
        items: [
          {
            term: 'Features',
            detail: 'The navbar, the Redux state and API calls behind event creation, edit and delete with the event-details popup, and the EmailJS invitation that goes out when an event is created.',
          },
          {
            term: 'Tests',
            detail: 'Unit suites for My Events, search and filter, infinite scrolling, edit and delete, the navbar and the login screen, plus the Jest setup the suite bootstraps from.',
          },
          {
            term: 'Written work',
            detail: 'The test plan and a usability test of the edit-and-delete flow — the course wanted both the automated and the observed kind of verification, and both are in the repository.',
          },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'lost-and-found',
    title: 'Lost and Found',
    eyebrow: 'Vue 3 · Campus utility',
    headline: 'Matching a lost report to a found item.',
    hook: 'A Vue 3 app for reporting lost and found things on campus, where the whole product is one join: does this found item look like anyone’s lost report?',
    summary:
      'A Vue 3 project: report something lost, report something found, and let the app score the two lists against each other. Built as a team project, with my work focused on the edit and delete flows, the lost items, item detail and profile pages, and a share of the design and prototype.',
    disciplines: ['development'],
    year: '2024',
    tags: ['Vue 3', 'Vuex', 'json-server'],
    meta: {
      role: 'Edit and delete, lost items, item detail, profile',
      context: 'Group project · 4 developers',
      platform: 'Responsive web',
    },
    cover: {
      src: 'lost-and-found/cover',
      alt: 'Lost and Found — matching a lost report to a found item',
      ratio: '1600/1000',
    },
    presentation: 'deep-dive',
    featured: false,
    links: [
      {
        label: 'View GitHub repository',
        href: 'https://github.com/neubiii/LostandFound',
        kind: 'repo',
      },
    ],
    sections: [
      {
        kind: 'text',
        id: 'overview',
        marker: '01 — The system',
        title: 'What it does',
        body: [
          'Two report forms, two lists, and a matched-items view that scores how well a found item fits a lost report. Everything else — search, filtering by location or category, a profile page of your own posts — exists to get people to that comparison.',
          'Vuex holds the session and the item lists; a thin util module wraps fetch for each resource, so the components never build a URL themselves. json-server on port 5001 is the data layer.',
        ],
      },
      {
        kind: 'text',
        id: 'honest',
        marker: '02 — What I would change',
        title: 'The part that has not aged well',
        body: [
          'Authentication is entirely client-side: passwords are hashed with bcryptjs in the browser and the signed-in email is base64-encoded into sessionStorage. That is encoding, not security, and with a real backend none of it stays in the client.',
          'The same goes for the data layer. json-server was the right call for a two-week project — it made the API shape real without anyone standing up a server — but every write is unauthenticated, so it is a prototype boundary rather than a design.',
        ],
      },
      {
        kind: 'text',
        id: 'contribution',
        marker: '03 — My part',
        title: 'What I worked on',
        body: [
          'Edit and delete for both lost and found posts, the lost items, item detail and profile pages, and the store actions and fetch helpers behind them. The design and the prototype were a shared effort.',
        ],
      },
    ],
  },
]

/**
 * The portfolio's three content types, in nav order. `Blogs` is intentionally
 * empty and says so in one line — the showcase renders whatever `projects`
 * contains, so writing arrives as data with no layout change.
 */
export const categories = [
  { id: 'ux', label: 'UI/UX', empty: 'UI/UX work will be added next.' },
  { id: 'development', label: 'Development', empty: 'Development projects will be added next.' },
  { id: 'writing', label: 'Blogs', empty: 'Writing will be added next.' },
] as const satisfies readonly { id: Discipline; label: string; empty: string }[]

export type CategoryId = (typeof categories)[number]['id']

/** How a project's shape is named to a reader, in the index and on the page. */
export const presentationLabel: Record<Project['presentation'], string> = {
  'case-study': 'Case study',
  'deep-dive': 'Deep dive',
  gallery: 'Visual study',
}

/** A project appears under every discipline it claims. */
export const projectsIn = (category: CategoryId): Project[] =>
  projects.filter((p) => p.disciplines.includes(category))

export const findProject = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug)

/**
 * Next project for the end-of-page pager. It wraps within the current project's
 * first discipline, so finishing a case study offers another case study rather
 * than dropping the reader into a service topology — and a project that claims
 * both categories still has exactly one successor.
 */
export const nextProject = (slug: string): Project | undefined => {
  const current = findProject(slug)
  if (!current) return undefined
  const siblings = projectsIn(current.disciplines[0])
  if (siblings.length < 2) return undefined
  const i = siblings.findIndex((p) => p.slug === slug)
  return siblings[(i + 1) % siblings.length]
}
