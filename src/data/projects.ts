import type { Project } from '@/types'

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
 * Nothing here is invented. Where the source is silent — a role title, a
 * prototype link — the field is absent rather than filled in.
 *
 * `Designwork-Newsletter` is an empty page in Figma and has no entry.
 */
export const projects: Project[] = [
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'ai-expense-agent',
    index: '01',
    title: 'AI Expense Agent',
    eyebrow: 'Agentic UX · SAP Fiori for iOS',
    headline: 'An AI expense agent that shows its work.',
    hook: 'Why 96% of users picked an AI that asks over one that guesses. A human-in-the-loop agent that cites the policy rule behind every flag.',
    summary:
      'Enterprise expense tools optimise for speed, then reject you for a policy you never saw. I designed a human-in-the-loop AI agent for SAP Fiori for iOS that cites the exact policy rule behind every flag and stops to ask the moment its confidence drops, validated with 30 users and a moderated usability study scoring 74.4 SUS.',
    discipline: 'ux',
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
    links: [],
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
            ratio: '393/852',
            caption: 'Upload',
          },
          {
            src: 'ai-expense-agent/flow-review',
            alt: 'Review step — fields marked "Suggested by AI", low-confidence fields flagged amber',
            ratio: '393/852',
            caption: 'Review — confidence surfaced per field',
          },
          {
            src: 'ai-expense-agent/flow-justify',
            alt: 'Justification step — a policy violation asking for a written justification',
            ratio: '393/852',
            caption: 'Justify — a violation invites an explanation',
          },
          {
            src: 'ai-expense-agent/flow-messages',
            alt: 'Messages panel grouping errors, warnings and information',
            ratio: '393/852',
            caption: 'Messages — errors, warnings, information',
          },
          {
            src: 'ai-expense-agent/flow-confirm',
            alt: 'Confirm step — the completed report before submission',
            ratio: '393/852',
            caption: 'Confirm',
          },
          {
            src: 'ai-expense-agent/flow-submitted',
            alt: 'Submitted confirmation screen',
            ratio: '393/852',
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
    index: '02',
    title: 'Meet-in-Room',
    eyebrow: 'Meet-in-Room · 8-week solo UX case study',
    headline: 'Turning a 300-metre walk into a three-tap booking.',
    hook: 'No system existed for booking a campus meeting room, so students walked 300 metres to find out if one was free. Availability you can see before you walk.',
    summary:
      'SRH Heidelberg had no system for booking meeting rooms: students and faculty walked between buildings just to find out whether one was free. I designed a mobile app that makes live room availability visible and bookable in seconds, refined across two rounds of usability testing and an A/B test on the booking entry point.',
    discipline: 'ux',
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
      ratio: '1220/450',
    },
    presentation: 'case-study',
    featured: true,
    links: [],
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
            ratio: '1680/614',
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
            ratio: '812/640',
            caption: 'Paper wireframes — structure and flow before any styling.',
          },
          {
            src: 'meet-in-room/ia-sitemap',
            alt: 'Sitemap showing three task branches off the home page',
            ratio: '812/851',
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
            ratio: '1680/997',
            caption: 'The booking flow with its failure paths drawn in.',
          },
          {
            src: 'meet-in-room/style-guide',
            alt: 'Style guide showing the type ramp, colour palette and component library',
            ratio: '1680/685',
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
            ratio: '528/1143',
            caption: 'Availability first',
          },
          {
            src: 'meet-in-room/solution-request',
            alt: 'A taken slot offering a Request action',
            ratio: '528/1143',
            caption: "Request, don't walk",
          },
          {
            src: 'meet-in-room/solution-inbox',
            alt: 'Attendees added, with invites routed through college email',
            ratio: '528/1143',
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
            ratio: '812/539',
            caption: 'Round 1 — at wireframe stage',
          },
          {
            src: 'meet-in-room/test-round-2',
            alt: 'Round two testing findings annotated on high-fidelity screens',
            ratio: '812/678',
            caption: 'Round 2 — in high fidelity',
          },
          {
            src: 'meet-in-room/ab-test',
            alt: 'A/B test comparing two booking entry treatments',
            ratio: '812/678',
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
    index: '03',
    title: 'BusStop',
    eyebrow: 'Route 01 · Consumer transit app · 2024',
    headline: 'Find the bus. Track the bus.',
    hook: '80% of the riders I surveyed had already missed a bus to a schedule that lied. A guest-first transit app that turns an unreliable timetable into a live, trackable route in three taps.',
    summary:
      'Riders had no trusted source for local bus timings and no way to see where the bus actually was. I designed both — schedule truth and live tracking — behind a guest login.',
    discipline: 'ux',
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
      ratio: '1232/440',
    },
    presentation: 'case-study',
    featured: false,
    links: [],
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
            ratio: '1805/1322',
            caption:
              'Competitive analysis — guest account, local schedules, live tracking, alarm setter.',
          },
          {
            src: 'busstop/persona',
            alt: 'User persona for Dhakshayani C, 22, designer in Bangalore',
            ratio: '1479/1446',
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
            ratio: '1365/1798',
            caption: 'Information architecture — guest-first, three ways in.',
          },
          {
            src: 'busstop/user-flow',
            alt: 'User flow from search through bus details to live tracking',
            ratio: '3112/2666',
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
            ratio: '393/852',
            caption: 'From and To only. One job per screen.',
          },
          {
            src: 'busstop/screen-find-bus',
            alt: 'Bus results list with fares and on-time status',
            ratio: '393/852',
            caption: 'Results — schedules, fare, delay flags.',
          },
          {
            src: 'busstop/screen-live-track',
            alt: 'Live tracking view for route 507K',
            ratio: '393/852',
            caption: 'Redesigned simpler after users stalled on this screen.',
          },
          {
            src: 'busstop/screen-alarm',
            alt: 'Stop alarm configuration screen',
            ratio: '393/852',
            caption: 'Stop alarm frees riders from watching the map.',
          },
          {
            src: 'busstop/type-color',
            alt: 'Typography and colour system — Quicksand and Reem Kufi on navy',
            ratio: '1317/1235',
            caption: 'Borrowed from the signage — Quicksand and Reem Kufi.',
          },
          {
            src: 'busstop/wireframes',
            alt: 'Eighteen wireframes laid out as a system',
            ratio: '3971/2251',
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
    index: '04',
    title: 'EverGrove',
    eyebrow: 'Interface design · SaaS marketing site',
    headline: 'A productivity platform, dressed for launch.',
    hook: 'A full marketing site for a collaboration platform — hero through pricing and testimonials — designed alongside the button and link system that holds it together.',
    summary:
      'An end-to-end landing page for EverGrove, an all-in-one collaboration and productivity platform: hero, feature story, testimonials, two-tier pricing and footer, built on a small component set with every interaction state drawn.',
    discipline: 'ux',
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
      ratio: '1441/1080',
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
            alt: 'Full EverGrove landing page — hero, clients, features, testimonials, pricing and footer',
            ratio: '1441/4479',
            fit: 'contain',
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
            ratio: '1926/1513',
            fit: 'contain',
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
    index: '05',
    title: 'Rate Conversion Tool',
    eyebrow: 'Interface design · Product landing page',
    headline: 'One claim, one action, one screen.',
    hook: 'A single-screen product landing page for an AI rate-conversion tool — the whole argument made above the fold and closed with one call to action.',
    summary:
      'A responsive landing page for an AI-generated rate conversion tool, built as an exercise in getting a product’s entire pitch — claim, proof and action — to land inside one screen.',
    discipline: 'ux',
    year: '2024',
    tags: ['Web design', 'Landing page'],
    meta: {
      platform: 'Responsive web · 1440',
      context: 'Self-directed interface study',
    },
    cover: {
      src: 'rate-conversion/cover',
      alt: 'Rate conversion tool landing page',
      ratio: '1443/1254',
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
            ratio: '1443/1254',
            fit: 'contain',
          },
        ],
      },
    ],
  },
]

export const disciplines = [
  { id: 'ux', label: 'UI/UX', phase: 1 },
  { id: 'development', label: 'Development', phase: 2 },
  { id: 'writing', label: 'Writing', phase: 2 },
] as const

export type DisciplineId = (typeof disciplines)[number]['id']

export const findProject = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug)

export const featuredProjects = (): Project[] => projects.filter((p) => p.featured)

export const caseStudies = (): Project[] =>
  projects.filter((p) => p.presentation === 'case-study')

/** Next project in the index, wrapping — powers the end-of-page pager. */
export const nextProject = (slug: string): Project | undefined => {
  const i = projects.findIndex((p) => p.slug === slug)
  if (i === -1 || projects.length < 2) return undefined
  return projects[(i + 1) % projects.length]
}
